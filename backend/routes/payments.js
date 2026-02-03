// routes/payments.js
import express from "express";
import { body, validationResult } from "express-validator";
import { authenticateToken } from "../middleware/auth.js";
import Payment from "../models/Payment.js";
import PricingPlan from "../models/PricingPlan.js";
import User from "../models/User.js";
import PayFastService from "../services/payfast.js";

const router = express.Router();

/** Simple USD -> ZAR (replace with real FX in prod) */
function usdToZar(usd) {
  const rate = 18.5;
  const val = typeof usd === "number" ? usd : parseFloat(String(usd));
  if (Number.isNaN(val)) throw new Error("Invalid USD amount");
  return val * rate;
}

/**
 * Create monthly subscription (PayFast)
 */
router.post(
  "/create-payment",
  authenticateToken,
  [
    body("planId").notEmpty().withMessage("Plan ID is required"),
    body("billingType")
      .isIn(["monthly"])
      .withMessage("Billing type must be monthly"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { planId, billingType } = req.body;
      const userId = req.user._id;

      const user = await User.findById(userId);
      const plan = await PricingPlan.findById(planId);

      if (!user) return res.status(404).json({ message: "User not found" });
      if (!plan || !plan.active)
        return res.status(404).json({ message: "Plan not found or inactive" });

      const amountUsd = plan.monthlyPriceUsd;
      const amountZar = usdToZar(amountUsd);

      const paymentId = `subscription_${Date.now()}_${userId}`;
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      nextBillingDate.setDate(1);

      await new Payment({
        userId,
        planId,
        paymentId,
        pfPaymentId: paymentId,
        amount: Number(amountZar.toFixed(2)),
        currency: "ZAR",
        status: "pending",
        paymentMethod: "payfast",
        billingType: "monthly",
        verificationStatus: "pending",
        isSubscription: true,
        subscriptionToken: null,
      }).save();

      const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const serverUrl = process.env.SERVER_URL || "http://localhost:3000";

      const payfast = new PayFastService();
      payfast.init();

      // Build subscription payload (ordered + signed)
      const subscriptionData = {
        mPaymentId: paymentId,
        amount: amountZar,
        itemName: `${plan.name} Plan - ${billingType} Subscription`,
        itemDescription: `${plan.description} - ${billingType} recurring billing`,
        returnUrl: `${baseUrl}/payment/success?payment_id=${paymentId}`,
        cancelUrl: `${baseUrl}/payment/cancel?payment_id=${paymentId}`,
        notifyUrl: `${serverUrl}/api/payments/notify`,
        nameFirst: user.name || "User",
        nameLast: user.name || "Name",
        emailAddress: user.email,
        customStr1: userId.toString(),
        customStr2: planId.toString(),
        customStr3: `${billingType}_subscription`,
        billingDate: nextBillingDate.toISOString().split("T")[0], // YYYY-MM-DD
        frequency: 3,
        cycles: 0,
        currency: "ZAR",
      };

      const paymentData = payfast.createSubscriptionData(subscriptionData);

      // Debug signature generation in development
      if (process.env.NODE_ENV !== "production") {
        console.log("=== PayFast Debug Info ===");
        console.log("Subscription data:", subscriptionData);
        console.log("Generated fields:", paymentData);
        console.log("========================");
      }

      // ⬇️ Return an auto-submit HTML form so the browser posts EXACTLY what we signed.
      const html = payfast.getPaymentFormHTML(paymentData);
      res.type("html").send(html);
    } catch (error) {
      console.error("Payment creation error:", error);
      return res.status(500).json({ message: "Server error creating payment" });
    }
  }
);

/**
 * ITN webhook
 * IMPORTANT: app must capture the RAW body (see app.js snippet below).
 */
router.post("/notify", async (req, res) => {
  try {
    const raw = req.rawBody || ""; // exact wire string
    const post = req.body || {};

    const payfast = new PayFastService();
    payfast.init();

    const { receivedSignature, calculatedSignature } =
      payfast.signRawItnBody(raw);

    // Basic required fields
    const m_payment_id = post.m_payment_id;
    const pf_payment_id = post.pf_payment_id;
    const payment_status = post.payment_status;
    const amount_gross = post.amount_gross;
    const token = post.token || null;
    const billing_date = post.billing_date || null;

    if (!payment_status || !receivedSignature) {
      console.error("Missing required fields in ITN");
      return res.status(400).send("Missing required fields");
    }

    let payment = await Payment.findOne({ paymentId: m_payment_id }).populate(
      "userId planId"
    );
    if (!payment) {
      console.error("Payment not found for ITN:", m_payment_id);
      return res.status(404).send("Payment not found");
    }

    // Store mismatch (and optionally bail out)
    if (calculatedSignature !== receivedSignature) {
      console.error("Invalid PayFast signature");
      payment.payfastData = {
        ...(payment.payfastData || {}),
        ...post,
        signature_mismatch: true,
        expected_signature: calculatedSignature,
        received_signature: receivedSignature,
        processed_at: new Date(),
        requires_manual_verification: true,
      };
      await payment.save();
      // Return OK to stop retries; do NOT activate benefits.
      return res.status(200).send("OK");
    }

    // (Optional) Extra checks for certification:
    // - Validate source IP is PayFast
    // - Confirm amount matches your record
    // - POST back to /eng/query/validate with pf_payment_id

    // If already completed, treat as recurring cycle
    if (payment.status === "completed") {
      if (payment.isSubscription && payment_status === "COMPLETE") {
        const recurringPaymentId = `recurring_${Date.now()}_${
          payment.userId._id
        }`;
        const recurringPayment = new Payment({
          userId: payment.userId._id,
          planId: payment.planId._id,
          paymentId: recurringPaymentId,
          pfPaymentId: pf_payment_id || recurringPaymentId,
          amount: parseFloat(amount_gross) || payment.amount,
          currency: payment.currency,
          status: "completed",
          paymentMethod: "payfast",
          billingType: payment.billingType,
          verificationStatus: "verified",
          isSubscription: false,
          payfastData: {
            ...post,
            processed_at: new Date(),
            itn_processed: true,
            billing_cycle: (payment.completedBillingCycles || 0) + 1,
          },
        });
        await recurringPayment.save();

        const user = payment.userId;
        const plan = payment.planId;
        if (user && plan) {
          if (token) {
            payment.subscriptionToken = token;
            user.subscriptionToken = token;
            await payment.save();
          }

          const currentExpiry = new Date(user.planExpirationDate || new Date());
          currentExpiry.setMonth(currentExpiry.getMonth() + 1);
          user.planExpirationDate = currentExpiry;
          user.lastBillingDate = new Date();
          user.completedBillingCycles = (user.completedBillingCycles || 0) + 1;
          user.availableProposals = plan.monthlyProposals;

          if (billing_date) {
            const nextBilling = new Date(billing_date);
            nextBilling.setMonth(nextBilling.getMonth() + 1);
            user.nextBillingDate = nextBilling;
          } else {
            const nextBilling = new Date(currentExpiry);
            nextBilling.setMonth(nextBilling.getMonth() + 1);
            user.nextBillingDate = nextBilling;
          }

          await user.save();
        }
      }

      return res.status(200).send("OK");
    }

    // First-time completion
    if (payment_status === "COMPLETE") {
      payment.status = "completed";
      payment.verificationStatus = "verified";
      payment.pfPaymentId = pf_payment_id;
      payment.payfastData = {
        ...post,
        processed_at: new Date(),
        itn_processed: true,
      };
      if (payment.isSubscription && token) payment.subscriptionToken = token;
      await payment.save();

      const user = payment.userId;
      const plan = payment.planId;
      if (user && plan) {
        const now = new Date();
        const expiry = new Date(now);
        expiry.setMonth(expiry.getMonth() + 1);

        user.planExpirationDate = expiry;
        user.planStatus = "active";
        user.currentPlan = plan.slug;
        user.planPurchaseDate = now;
        user.billingPeriod = payment.billingType;
        user.subscriptionId = payment._id;
        user.nextBillingDate = new Date(
          now.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        user.lastBillingDate = now;
        user.billingFrequency = payment.billingType;
        user.recurringAmount = payment.amount;
        user.completedBillingCycles = 1;
        user.availableProposals = plan.monthlyProposals;
        if (token) user.subscriptionToken = token;

        await user.save();
      }
    } else if (payment_status === "FAILED" || payment_status === "CANCELLED") {
      payment.status = "failed";
      payment.verificationStatus = "failed";
      payment.payfastData = {
        ...post,
        processed_at: new Date(),
        itn_processed: true,
      };
      await payment.save();
    } else {
      payment.payfastData = {
        ...(payment.payfastData || {}),
        ...post,
        processed_at: new Date(),
        itn_processed: true,
        unknown_status: payment_status,
      };
      await payment.save();
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("ITN processing error:", error);
    return res.status(200).send("OK"); // stop retries
  }
});

/**
 * Verify payment via PayFast validate API (optional helper)
 */
router.post("/verify-payment", authenticateToken, async (req, res) => {
  try {
    const { paymentId, pfPaymentId } = req.body;
    if (!paymentId) {
      return res
        .status(400)
        .json({ success: false, message: "Payment ID is required" });
    }

    const payment = await Payment.findOne({ paymentId }).populate(
      "userId planId"
    );
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    if (payment.status === "completed") {
      return res.json({
        success: true,
        message: "Payment already completed",
        payment: { id: payment.paymentId, status: payment.status },
      });
    }

    if (pfPaymentId) {
      const payfast = new PayFastService();
      payfast.init();
      const isValid = await payfast.verifyPayment(pfPaymentId);

      if (isValid) {
        payment.status = "completed";
        payment.verificationStatus = "verified";
        payment.pfPaymentId = pfPaymentId;
        payment.payfastData = {
          payment_status: "COMPLETE",
          verified_via_api: true,
          verified_at: new Date(),
        };
        await payment.save();

        if (payment.userId && payment.planId) {
          const user = payment.userId;
          const plan = payment.planId;

          const now = new Date();
          const expiry = new Date(now);
          expiry.setMonth(expiry.getMonth() + 1);

          user.planExpirationDate = expiry;
          user.planStatus = "active";
          user.currentPlan = plan.slug;
          user.planPurchaseDate = now;
          user.availableProposals = plan.monthlyProposals;
          user.billingPeriod = payment.billingType;
          user.subscriptionId = payment._id;
          user.nextBillingDate = new Date(
            now.getTime() + 30 * 24 * 60 * 60 * 1000
          );
          user.lastBillingDate = now;
          user.billingFrequency = payment.billingType;
          user.recurringAmount = payment.amount;
          user.completedBillingCycles = 1;
          await user.save();
        }

        return res.json({
          success: true,
          message: "Payment verified and completed successfully",
          payment: {
            id: payment.paymentId,
            status: payment.status,
            plan: payment.planId?.name || "Unknown Plan",
            amount: payment.amount,
            currency: payment.currency,
            billingType: payment.billingType,
          },
        });
      } else {
        payment.status = "failed";
        payment.verificationStatus = "failed";
        payment.payfastData = {
          payment_status: "FAILED",
          verified_via_api: false,
          verified_at: new Date(),
        };
        await payment.save();

        return res.json({
          success: false,
          message: "Payment verification failed",
          payment: { id: payment.paymentId, status: payment.status },
        });
      }
    }

    // Manual completion fallback (avoid in prod)
    payment.status = "completed";
    payment.verificationStatus = "verified";
    payment.payfastData = {
      payment_status: "COMPLETE",
      manually_completed: true,
      completed_at: new Date(),
    };
    await payment.save();

    if (payment.userId && payment.planId) {
      const user = payment.userId;
      const plan = payment.planId;
      const now = new Date();
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + 1);

      user.planExpirationDate = expiry;
      user.planStatus = "active";
      user.currentPlan = plan.slug;
      user.planPurchaseDate = now;
      user.availableProposals = plan.monthlyProposals;
      user.billingPeriod = payment.billingType;
      user.subscriptionId = payment._id;
      user.nextBillingDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      user.lastBillingDate = now;
      user.billingFrequency = payment.billingType;
      user.recurringAmount = payment.amount;
      user.completedBillingCycles = 1;
      await user.save();
    }

    return res.json({
      success: true,
      message: "Payment manually completed successfully",
      payment: {
        id: payment.paymentId,
        status: payment.status,
        plan: payment.planId?.name || "Unknown Plan",
        amount: payment.amount,
        currency: payment.currency,
        billingType: payment.billingType,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error verifying payment",
      error: error.message,
    });
  }
});

export default router;
