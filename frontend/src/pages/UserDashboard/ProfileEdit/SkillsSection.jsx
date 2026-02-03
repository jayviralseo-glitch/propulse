import React, { useState } from "react";
import { Plus, X, Zap } from "lucide-react";

export default function SkillsSection({ profile, onAddSkill, onRemoveSkill }) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onAddSkill("skills", newSkill);
      setNewSkill("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="card-modern hover-lift bg-gradient-to-br from-white to-green-50/30 rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-medium">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Skills
          </h2>
        </div>
      </div>
      <div className="p-1 sm:p-3 lg:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill..."
            className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
            onKeyPress={handleKeyPress}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold flex items-center justify-center"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            Add
          </button>
        </div>
        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {profile.skills.map((skill, index) => (
              <div
                key={index}
                className="border-2 border-green-200 text-green-700 bg-green-50 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium text-sm hover:bg-green-100 transition-all duration-300 flex items-center gap-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => onRemoveSkill("skills", index)}
                  className="ml-2 sm:ml-3 hover:text-red-600 transition-colors duration-200 p-1"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {(!profile.skills || profile.skills.length === 0) && (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <Zap className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
            <p className="text-sm sm:text-base font-medium mb-1 sm:mb-2">
              No skills added yet
            </p>
            <p className="text-xs sm:text-sm">
              Start adding your professional skills above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
