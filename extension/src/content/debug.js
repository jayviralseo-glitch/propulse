// Debug file to test module functionality
console.log("Debug: Testing module imports...");

// Test import
import { showTemplateModal } from "./templateModal.js";
import { showProposalInterface } from "./proposalInterface.js";
import { generateProposalWithTemplate } from "./utils.js";

console.log("Debug: showTemplateModal function:", typeof showTemplateModal);
console.log(
  "Debug: showProposalInterface function:",
  typeof showProposalInterface
);
console.log(
  "Debug: generateProposalWithTemplate function:",
  typeof generateProposalWithTemplate
);

// Test if functions are callable
try {
  console.log("Debug: Testing function calls...");
  if (typeof showTemplateModal === "function") {
    console.log("Debug: showTemplateModal is callable");
  }
  if (typeof showProposalInterface === "function") {
    console.log("Debug: showProposalInterface is callable");
  }
  if (typeof generateProposalWithTemplate === "function") {
    console.log("Debug: generateProposalWithTemplate is callable");
  }
} catch (error) {
  console.error("Debug: Error testing functions:", error);
}

console.log("Debug: Module test complete");
