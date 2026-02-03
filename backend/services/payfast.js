// services/payfast.js
import crypto from "crypto";

class PayFastService {
  constructor() {
    this.merchantId = process.env.PAYFAST_MERCHANT_ID;
    this.merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    this.passphrase = process.env.PAYFAST_PASSPHRASE || ""; // required for subscriptions
    this.sandbox = process.env.NODE_ENV !== "production";
    this.baseUrl = this.sandbox
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";
    this.baseApi = this.sandbox
      ? "https://sandbox.payfast.co.za"
      : "https://www.payfast.co.za";
  }

  init() {
    if (!this.merchantId || !this.merchantKey) {
      throw new Error("PayFast credentials not configured");
    }
  }

  // PHP-style urlencode (space -> '+')
  phpUrlEncode(v) {
    return encodeURIComponent(v).replace(/%20/g, "+");
  }

  /**
   * Generate PayFast signature exactly as shown in their documentation
   * @param {Object} data - payment data object
   * @param {string} passPhrase - optional passphrase
   * @returns {string} MD5 signature
   */
  generateSignature(data, passPhrase = "") {
    const orderedFields = [
      "merchant_id",
      "merchant_key",
      "return_url",
      "cancel_url",
      "notify_url",
      "name_first",
      "name_last",
      "email_address",
      "m_payment_id",
      "amount",
      "item_name",
      "item_description",
      "custom_str1",
      "custom_str2",
      "custom_str3",
      "custom_int1",
      "custom_int2",
      "subscription_type",
      "frequency",
      "cycles",
      "currency",
    ];

    let sigString = "";

    for (let field of orderedFields) {
      if (
        Object.prototype.hasOwnProperty.call(data, field) &&
        data[field] !== undefined &&
        data[field] !== null &&
        data[field] !== ""
      ) {
        sigString += `${field}=${this.phpUrlEncode(
          data[field].toString().trim()
        )}&`;
      }
    }

    sigString = sigString.slice(0, -1);

    // Append passphrase if provided
    if (passPhrase) {
      sigString += `&passphrase=${this.phpUrlEncode(passPhrase.trim())}`;
    }

    console.log("🔍 Signature String:", sigString);

    return crypto.createHash("md5").update(sigString).digest("hex");
  }

  normalizeAmount(amount) {
    const n = typeof amount === "number" ? amount : parseFloat(String(amount));
    if (Number.isNaN(n)) throw new Error("Invalid amount");
    return n.toFixed(2);
  }

  /**
   * Build form body string in the EXACT order given by `fields`, skipping empty values,
   * then sign that exact string (appending passphrase only to the string being hashed).
   * PayFast requires specific field ordering and encoding for signature validation.
   *
   * @param {Array<[string, any]>} fields - ordered pairs
   * @returns {{ bodyString: string, signature: string, dataObj: object }}
   */
  buildBodyAndSignature(fields) {
    const pairs = [];
    const dataObj = {};

    for (const [k, v] of fields) {
      if (v === undefined || v === null) continue;
      const s = String(v).trim();
      if (s === "") continue;

      // PayFast expects PHP-style URL encoding (space -> '+')
      pairs.push(`${k}=${this.phpUrlEncode(s)}`);
      dataObj[k] = s;
    }

    const bodyString = pairs.join("&");

    // For signature calculation, append passphrase without URL encoding
    const sigBase =
      this.passphrase && this.passphrase.trim()
        ? `${bodyString}&passphrase=${this.passphrase.trim()}`
        : bodyString;

    const signature = crypto.createHash("md5").update(sigBase).digest("hex");
    return { bodyString, signature, dataObj };
  }

  /**
   * Create subscription payload (recurring)
   * Return BOTH: structured object + ready-to-post body string.
   * Uses exact same data and order for signature generation and PayFast submission.
   */
  buildSubscription({
    mPaymentId,
    amount,
    itemName,
    itemDescription,
    returnUrl,
    cancelUrl,
    notifyUrl,
    nameFirst,
    nameLast,
    emailAddress,
    customStr1,
    customStr2,
    customStr3,
    billingDate, // YYYY-MM-DD
    frequency = 3, // monthly
    cycles = 0, // indefinite
    currency = "ZAR",
  }) {
    // Build data object with all required fields
    const data = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      name_first: nameFirst,
      name_last: nameLast,
      email_address: emailAddress,
      m_payment_id: mPaymentId,
      amount: this.normalizeAmount(amount),
      item_name: itemName,
      item_description: itemDescription,
      custom_str1: customStr1,
      custom_str2: customStr2,
      custom_str3: customStr3,
      subscription_type: 1,
      frequency: String(frequency),
      cycles: String(cycles),
      currency: currency,
    };

    // Generate signature using PayFast's exact method
    const signature = this.generateSignature(data, this.passphrase);

    // Debug: Log exactly what we're sending
    console.log("🔍 === PAYFAST DEBUG ===");
    console.log("🔍 Data object:", JSON.stringify(data, null, 2));
    console.log("🔍 Generated signature:", signature);

    // Debug: Log the signature generation process
    let debugSigString = "";
    const debugFields = [
      "merchant_id",
      "merchant_key",
      "return_url",
      "cancel_url",
      "notify_url",
      "name_first",
      "name_last",
      "email_address",
      "m_payment_id",
      "amount",
      "item_name",
      "item_description",
      "custom_str1",
      "custom_str2",
      "custom_str3",
      "subscription_type",
      "frequency",
      "cycles",
      "currency",
    ];

    for (const field of debugFields) {
      if (
        data[field] !== undefined &&
        data[field] !== null &&
        data[field] !== ""
      ) {
        debugSigString += `${field}=${this.phpUrlEncode(
          String(data[field]).trim()
        )}&`;
      }
    }
    debugSigString = debugSigString.slice(0, -1); // Remove last &

    if (this.passphrase) {
      debugSigString += `&passphrase=${this.phpUrlEncode(
        this.passphrase.trim()
      )}`;
    }

    console.log("🔍 Signature string (without MD5):", debugSigString);
    console.log("🔍 Passphrase used:", this.passphrase ? "YES" : "NO");
    console.log("🔍 =========================");

    // Add signature to data
    data.signature = signature;

    // Build body string in the same order as PayFast expects
    let bodyString = "";
    const orderedFields = [
      "merchant_id",
      "merchant_key",
      "return_url",
      "cancel_url",
      "notify_url",
      "name_first",
      "name_last",
      "email_address",
      "m_payment_id",
      "amount",
      "item_name",
      "item_description",
      "custom_str1",
      "custom_str2",
      "custom_str3",
      "subscription_type",
      "frequency",
      "cycles",
      "currency",
      "signature",
    ];

    for (const field of orderedFields) {
      if (
        data[field] !== undefined &&
        data[field] !== null &&
        data[field] !== ""
      ) {
        if (bodyString) bodyString += "&";
        bodyString += `${field}=${this.phpUrlEncode(
          String(data[field]).trim()
        )}`;
      }
    }

    const postUrl = this.baseUrl;

    return {
      postUrl,
      bodyString,
      fields: data,
    };
  }

  /**
   * Create subscription data (matches working service for subscription payments)
   */
  createSubscriptionData(orderData) {
    const data = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      return_url: orderData.returnUrl || "",
      amount: parseFloat(orderData.amount).toFixed(2),
      item_name: orderData.itemName || "Starter Plan - monthly",
      subscription_type: 1,
      frequency: Number(orderData.frequency || 3),
      cycles: Number(orderData.cycles || 0),
    };

    // Generate signature using PayFast's exact method
    data.signature = this.generateSignature(data, this.passphrase);

    console.log("PayFast Final Subscription Data:", data);
    return data;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionToken) {
    // All fields required by PayFast for subscription cancellation
    const data = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      subscription_token: subscriptionToken,
      cancel_reason: "User requested cancellation",
    };

    // Generate signature
    const signature = this.generateSignature(data, this.passphrase);
    data.signature = signature;

    // Build body string
    let bodyString = "";
    const sortedKeys = Object.keys(data).sort();
    for (const key of sortedKeys) {
      if (bodyString) bodyString += "&";
      bodyString += `${key}=${this.phpUrlEncode(data[key])}`;
    }

    const res = await fetch(`${this.baseApi}/eng/subscriptions/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: bodyString,
    });

    const text = await res.text();
    console.log("PayFast subscription cancellation response:", text);
    return text.includes("SUCCESS");
  }

  /**
   * Minimal PayFast validate call
   */
  async verifyPayment(pfPaymentId) {
    // All fields required by PayFast for payment verification
    const data = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      pf_payment_id: pfPaymentId,
    };

    // Generate signature
    const signature = this.generateSignature(data, this.passphrase);
    data.signature = signature;

    // Build body string
    let bodyString = "";
    const sortedKeys = Object.keys(data).sort();
    for (const key of sortedKeys) {
      if (bodyString) bodyString += "&";
      bodyString += `${key}=${this.phpUrlEncode(data[key])}`;
    }

    const res = await fetch(`${this.baseApi}/eng/query/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: bodyString,
    });

    const text = await res.text();
    console.log("PayFast verification response:", text);
    return text.includes("VALID") || text.includes("COMPLETE");
  }

  /**
   * Compute signature for ITN using the RAW body (order preserved).
   * Signature verification uses all fields, not just specific ones.
   * @param {string} rawBody - original x-www-form-urlencoded string
   * @returns {{ receivedSignature: string, calculatedSignature: string }}
   */
  signRawItnBody(rawBody) {
    const parts = (rawBody || "").split("&");
    const data = {};
    let receivedSignature = "";

    // Parse the raw body into key-value pairs
    for (const p of parts) {
      const [k, ...rest] = p.split("=");
      const value = rest.join("=") || "";

      if (k === "signature") {
        receivedSignature = decodeURIComponent(value.replace(/\+/g, " "));
      } else {
        // Decode the value for signature calculation
        data[k] = decodeURIComponent(value.replace(/\+/g, " "));
      }
    }

    // Generate signature using the same method as outgoing requests
    const calculatedSignature = this.generateSignature(data, this.passphrase);

    return { receivedSignature, calculatedSignature };
  }

  /**
   * Debug method to help troubleshoot signature issues
   */
  debugSignature(fields) {
    const { bodyString, signature } = this.buildBodyAndSignature(fields);
    console.log("=== PayFast Signature Debug ===");
    console.log(
      "Fields being signed:",
      fields.filter(
        ([k, v]) => v !== undefined && v !== null && String(v).trim() !== ""
      )
    );
    console.log("Body string for signature:", bodyString);
    console.log("Passphrase used:", this.passphrase ? "YES" : "NO");
    console.log("Generated signature:", signature);
    console.log("===============================");
    return { bodyString, signature };
  }

  /**
   * Build an auto-submit HTML form so the browser posts EXACTLY what we signed.
   */
  getPaymentFormHTML(fieldsObj) {
    const inputs = Object.entries(fieldsObj)
      .map(
        ([k, v]) =>
          `<input type="hidden" name="${k}" value="${String(v).replace(
            /"/g,
            "&quot;"
          )}" />`
      )
      .join("");
    return `<!doctype html>
<html>
  <body onload="document.forms[0].submit()">
    <form action="${this.baseUrl}" method="POST" accept-charset="utf-8">
      ${inputs}
      <noscript><button type="submit">Continue</button></noscript>
    </form>
  </body>
</html>`;
  }
}

export default PayFastService;
