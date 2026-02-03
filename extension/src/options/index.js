document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("settingsForm");
  const apiKeyInput = document.getElementById("apiKey");
  const modelSelect = document.getElementById("model");
  const enabledSelect = document.getElementById("enabled");
  const statusDiv = document.getElementById("status");

  // Load saved settings
  loadSettings();

  // Handle form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const settings = {
      apiKey: apiKeyInput.value.trim(),
      model: modelSelect.value,
      enabled: enabledSelect.value === "true",
    };

    try {
      // Save settings
      await chrome.storage.sync.set(settings);

      showStatus("Settings saved successfully!", "success");

      // Clear status after 3 seconds
      setTimeout(() => {
        hideStatus();
      }, 3000);
    } catch (error) {
      showStatus("Error saving settings: " + error.message, "error");
    }
  });

  // Load settings from storage
  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        "apiKey",
        "model",
        "enabled",
      ]);

      if (result.apiKey) {
        apiKeyInput.value = result.apiKey;
      }

      if (result.model) {
        modelSelect.value = result.model;
      }

      if (result.enabled !== undefined) {
        enabledSelect.value = result.enabled.toString();
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      showStatus("Error loading settings: " + error.message, "error");
    }
  }

  // Show status message
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = "block";
  }

  // Hide status message
  function hideStatus() {
    statusDiv.style.display = "none";
  }

  // Test API key button (optional)
  const testButton = document.createElement("button");
  testButton.textContent = "Test API Key";
  testButton.className = "btn";
  testButton.style.marginLeft = "10px";
  testButton.style.marginTop = "20px";

  testButton.addEventListener("click", async function () {
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
      showStatus("Please enter an API key first", "error");
      return;
    }

    try {
      testButton.disabled = true;
      testButton.textContent = "Testing...";

      // Test the API key by making a simple request
      const response = await chrome.runtime.sendMessage({
        action: "testAPIKey",
        apiKey: apiKey,
      });

      if (response.success) {
        showStatus("API key is valid!", "success");
      } else {
        showStatus("API key test failed: " + response.error, "error");
      }
    } catch (error) {
      showStatus("Error testing API key: " + error.message, "error");
    } finally {
      testButton.disabled = false;
      testButton.textContent = "Test API Key";
    }
  });

  // Add test button after the form
  form.appendChild(testButton);
});
