import React, { useState } from "react";
import { Download, Chrome, ExternalLink, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function ExtensionInstall() {
  const [isInstalled, setIsInstalled] = useState(false);

  const handleInstallClick = () => {
    // Open extension store based on detected browser
    const userAgent = navigator.userAgent;
    let storeUrl = "https://chrome.google.com/webstore"; // Default to Chrome

    if (userAgent.includes("Firefox")) {
      storeUrl = "https://addons.mozilla.org/en-US/firefox/";
    } else if (userAgent.includes("Edge")) {
      storeUrl = "https://microsoftedge.microsoft.com/addons/";
    }

    // Open in new tab
    window.open(storeUrl, "_blank");

    // Show installed state (in real app, you'd detect actual installation)
    setIsInstalled(true);
  };

  const handleLearnMore = () => {
    window.open("https://docs.propulse-ai.com/extension", "_blank");
  };

  if (isInstalled) {
    return (
      <Card className="card-modern hover-lift bg-gradient-to-br from-white to-green-50/50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-medium">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl opacity-20 blur-lg"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-900 mb-1">
                Extension Installed!
              </h3>
              <p className="text-sm text-green-700 font-medium">
                You're all set to generate AI proposals
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsInstalled(false)}
            className="w-full border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 rounded-xl py-2 text-sm font-medium transition-all duration-300"
          >
            Reinstall
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-modern hover-lift bg-gradient-to-br from-white to-blue-50/50">
      <CardContent className="p-6">
        {/* Header with Icon and Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-xl flex items-center justify-center shadow-medium">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-xl opacity-20 blur-lg"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Install Propulse AI Extension
            </h2>
            <p className="text-sm text-gray-600">
              Generate AI proposals from Upwork
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          Get the browser extension to generate AI-powered proposals directly
          from Upwork job pages. Save time and increase your success rate with
          personalized proposals.
        </p>

        {/* Browser Compatibility */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <Chrome className="h-4 w-4 text-blue-600" />
            <span>Chrome</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Firefox</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Edge</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-sm font-semibold rounded-xl shadow-medium hover:shadow-large transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Install Extension
          </Button>
          <Button
            variant="outline"
            onClick={handleLearnMore}
            className="w-full border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-blue-300 hover:text-blue-700 rounded-xl py-2 text-sm font-medium transition-all duration-300"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
