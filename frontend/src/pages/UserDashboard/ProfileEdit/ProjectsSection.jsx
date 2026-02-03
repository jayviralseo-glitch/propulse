import React from "react";
import { Plus, Trash2, FolderOpen, X } from "lucide-react";

export default function ProjectsSection({
  profile,
  onAddProject,
  onRemoveProject,
  onArrayChange,
  onAddProjectSkill,
  onRemoveProjectSkill,
}) {
  return (
    <div className="card-modern hover-lift bg-gradient-to-br from-white to-blue-50/30 rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="flex flex-row items-center justify-between p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-medium">
            <FolderOpen className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Projects
          </h2>
        </div>
        <button
          type="button"
          onClick={onAddProject}
          className="border-2 border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-300 rounded-2xl sm:px-4 p-2 sm:py-2.5 font-medium transition-all duration-300 flex"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Project
        </button>
      </div>
      <div className="p-1 sm:p-4">
        {profile?.projects && profile.projects.length > 0 ? (
          profile.projects.map((project, index) => (
            <div
              key={index}
              className="sm:border-2 border-yellow-100 rounded-2xl px-2 py-4 sm:py-6 bg-white/60 hover:bg-white/80 transition-all duration-300 mb-4"
            >
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                  Project #{index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => onRemoveProject(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl px-3 sm:px-4 py-2 transition-all duration-300"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) =>
                      onArrayChange("projects", index, {
                        ...project,
                        name: e.target.value,
                      })
                    }
                    placeholder="E-commerce Platform"
                    required
                    className="w-full border-2 border-gray-200 rounded-2xl py-2 px-3 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
                    Project Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) =>
                      onArrayChange("projects", index, {
                        ...project,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the project..."
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-2xl py-2 px-3 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300 resize-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                <div>
                  <label className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={project.startDate}
                    onChange={(e) =>
                      onArrayChange("projects", index, {
                        ...project,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-200 rounded-2xl py-2 px-3 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={project.endDate}
                    onChange={(e) =>
                      onArrayChange("projects", index, {
                        ...project,
                        endDate: e.target.value,
                      })
                    }
                    disabled={project.isCurrent}
                    className="w-full border-2 border-gray-200 rounded-2xl py-2 px-3 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="mt-4 sm:mt-6">
                <label className="flex items-center gap-2 sm:gap-3 text-gray-700 font-semibold text-sm sm:text-base">
                  <input
                    type="checkbox"
                    checked={project.isCurrent}
                    onChange={(e) =>
                      onArrayChange("projects", index, {
                        ...project,
                        isCurrent: e.target.checked,
                      })
                    }
                    className="rounded border-2 border-yellow-300 text-yellow-600 focus:ring-yellow-500 focus:ring-offset-2 w-4 h-4 sm:w-5 sm:h-5"
                  />
                  Ongoing Project
                </label>
              </div>
              <div className="mt-4 sm:mt-6">
                <label className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
                  Project Skills
                </label>
                <div className="flex gap-3 mt-3">
                  <input
                    type="text"
                    placeholder="Add skill..."
                    className="flex-1 border-2 border-gray-200 rounded-2xl py-2 px-3 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onAddProjectSkill(index, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      onAddProjectSkill(index, input.value);
                      input.value = "";
                    }}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-2xl px-4 py-3 font-semibold"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {project.skills && project.skills.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {project.skills.map((skill, skillIndex) => (
                      <div
                        key={skillIndex}
                        className="border-2 border-yellow-200 text-yellow-700 bg-yellow-50 px-3 py-1 rounded-xl font-medium text-sm hover:bg-yellow-100 transition-all duration-300 flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() =>
                            onRemoveProjectSkill(index, skillIndex)
                          }
                          className="ml-2 hover:text-red-600 transition-colors duration-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <FolderOpen className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
            <p className="text-base sm:text-lg font-medium mb-2">
              No projects added yet
            </p>
            <p className="text-xs sm:text-sm">
              Click "Add Project" to showcase your work
            </p>
          </div>
        )}
      </div>
    </div>
  );
}