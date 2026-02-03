import React, { useState } from "react";
import { Plus, X, Award, Trash2 } from "lucide-react";

export default function CertificationsSection({
  profile,
  onAddCertification,
  onRemoveCertification,
  onAddCertificationSkill,
  onRemoveCertificationSkill,
}) {
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    verification: "",
    skills: [],
  });
  const [newCertSkill, setNewCertSkill] = useState("");

  const handleAddCertification = () => {
    if (newCertification.name.trim()) {
      onAddCertification("certifications", newCertification);
      setNewCertification({
        name: "",
        issuer: "",
        issueDate: "",
        verification: "",
        skills: [],
      });
    }
  };

  const addCertSkill = () => {
    if (newCertSkill.trim()) {
      setNewCertification((prev) => ({
        ...prev,
        skills: [...prev.skills, newCertSkill.trim()],
      }));
      setNewCertSkill("");
    }
  };

  const removeCertSkill = (skillIndex) => {
    setNewCertification((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== skillIndex),
    }));
  };

  return (
    <div className="card-modern hover-lift bg-gradient-to-br from-white to-pink-50/30 rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-medium">
            <Award className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
          </div>
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
            Certifications
          </h2>
        </div>
      </div>
      <div className="p-2 sm:p-3 lg:p-4 space-y-2.5 sm:space-y-3 lg:space-y-4">
        {/* Add New Certification Form */}
        <div className="border-2 border-pink-100 rounded-2xl p-2 sm:p-3 lg:p-4 bg-white/60 space-y-2.5 sm:space-y-3 lg:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900">
            Add New Certification
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div>
              <label
                htmlFor="certName"
                className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base"
              >
                Certification Name *
              </label>
              <input
                id="certName"
                type="text"
                value={newCertification.name}
                onChange={(e) =>
                  setNewCertification((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="e.g., MongoDB Advanced Schema Design"
                className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="certIssuer"
                className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base"
              >
                Issuing Organization
              </label>
              <input
                id="certIssuer"
                type="text"
                value={newCertification.issuer}
                onChange={(e) =>
                  setNewCertification((prev) => ({
                    ...prev,
                    issuer: e.target.value,
                  }))
                }
                placeholder="e.g., MongoDB"
                className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div>
              <label
                htmlFor="certIssueDate"
                className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base"
              >
                Issue Date
              </label>
              <input
                id="certIssueDate"
                type="date"
                value={newCertification.issueDate}
                onChange={(e) =>
                  setNewCertification((prev) => ({
                    ...prev,
                    issueDate: e.target.value,
                  }))
                }
                className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="certVerification"
                className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base"
              >
                Verification Status
              </label>
              <input
                id="certVerification"
                type="text"
                value={newCertification.verification}
                onChange={(e) =>
                  setNewCertification((prev) => ({
                    ...prev,
                    verification: e.target.value,
                  }))
                }
                placeholder="e.g., Verified by Credly"
                className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="certSkills"
              className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base"
            >
              Skills
            </label>
            <div className="flex gap-3">
              <input
                id="certSkills"
                type="text"
                value={newCertSkill}
                onChange={(e) => setNewCertSkill(e.target.value)}
                placeholder="Add a skill..."
                className="flex-1 border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCertSkill())
                }
              />
              <button
                type="button"
                onClick={addCertSkill}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-xl sm:rounded-2xl px-4 py-2 font-semibold flex items-center justify-center"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            {newCertification.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
                {newCertification.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="border-2 border-pink-200 text-pink-700 bg-pink-50 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm hover:bg-pink-100 transition-all duration-300 flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeCertSkill(skillIndex)}
                      className="ml-1 sm:ml-2 hover:text-red-600 transition-colors duration-200 p-0.5"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddCertification}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-xl sm:rounded-2xl px-4 py-2 font-semibold w-full flex items-center justify-center text-sm sm:text-base"
            disabled={!newCertification.name.trim()}
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            Add Certification
          </button>
        </div>

        {/* Display Existing Certifications */}
        {profile?.certifications && profile.certifications.length > 0 ? (
          <div className="space-y-2.5 sm:space-y-3 lg:space-y-4 mt-4">
            <h4 className="text-base sm:text-lg font-bold text-gray-900">
              Added Certifications:
            </h4>
            {profile.certifications.map((cert, index) => (
              <div
                key={index}
                className="border-2 border-pink-100 rounded-2xl p-2 sm:p-3 lg:p-4 bg-white/60 space-y-2.5 sm:space-y-3 lg:space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                      {cert.name}
                    </h5>
                    {cert.issuer && (
                      <p className="text-gray-600 font-medium text-xs sm:text-sm">
                        Issuer: {cert.issuer}
                      </p>
                    )}
                    {cert.issueDate && (
                      <p className="text-gray-600 font-medium text-xs sm:text-sm">
                        Issue Date: {cert.issueDate}
                      </p>
                    )}
                    {cert.verification && (
                      <p className="text-gray-600 font-medium text-xs sm:text-sm">
                        Verification: {cert.verification}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onRemoveCertification("certifications", index)
                    }
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl p-2 transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
                {cert.skills && cert.skills.length > 0 && (
                  <div>
                    <label className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {cert.skills.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="border-2 border-pink-200 text-pink-700 bg-pink-50 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm hover:bg-pink-100 transition-all duration-300 flex items-center gap-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() =>
                              onRemoveCertificationSkill(index, skillIndex)
                            }
                            className="ml-1 sm:ml-2 hover:text-red-600 transition-colors duration-200 p-0.5"
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <Award className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
            <p className="text-sm sm:text-base font-medium mb-1 sm:mb-2">
              No certifications added yet
            </p>
            <p className="text-xs sm:text-sm">
              Add your professional certifications above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
