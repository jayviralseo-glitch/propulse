import React from "react";
import { Plus, Trash2, Briefcase } from "lucide-react";

export default function EmploymentHistory({
  profile,
  onAddEmployment,
  onRemoveEmployment,
  onArrayChange,
}) {
  return (
    <div className="card-modern hover-lift bg-gradient-to-br from-white to-purple-50/30 rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="flex flex-row items-center justify-between p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-green-600 rounded-2xl flex items-center justify-center shadow-medium">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Employment History
          </h2>
        </div>
        <button
          type="button"
          onClick={onAddEmployment}
          className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 rounded-2xl p-2 sm:px-4 sm:py-2.5 font-medium transition-all duration-300 w-[140px] flex"
        >
          <Plus className="h-5 w-8  text-[8px]" />
          Add Job
        </button>
      </div>
      <div className="p-1 sm:p-4">
        {profile?.employmentHistory && profile.employmentHistory.length > 0 ? (
          profile.employmentHistory.map((job, index) => (
            <div
              key={index}
              className="sm:border-2 border-purple-100 rounded-2xl px-2 py-4 sm:py-6 bg-white/60 hover:bg-white/80 transition-all duration-300 mb-4"
            >
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                  Job #{index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => onRemoveEmployment(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl px-3 sm:px-4 py-2 transition-all duration-300"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={job.title}
                    onChange={(e) =>
                      onArrayChange("employmentHistory", index, {
                        ...job,
                        title: e.target.value,
                      })
                    }
                    placeholder="Software Developer"
                    required
                    className="w-full border-2 border-gray-200 rounded-2xl py-2 px-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={job.company}
                    onChange={(e) =>
                      onArrayChange("employmentHistory", index, {
                        ...job,
                        company: e.target.value,
                      })
                    }
                    placeholder="Tech Corp"
                    required
                    className="w-full border-2 border-gray-200 rounded-2xl py-2 px-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
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
                    value={job.startDate}
                    onChange={(e) =>
                      onArrayChange("employmentHistory", index, {
                        ...job,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-200 rounded-2xl py-2 px-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={job.endDate}
                    onChange={(e) =>
                      onArrayChange("employmentHistory", index, {
                        ...job,
                        endDate: e.target.value,
                      })
                    }
                    disabled={job.isCurrent}
                    className="w-full border-2 border-gray-200 rounded-2xl py-2 px-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="mt-4 sm:mt-6">
                <label className="flex items-center gap-2 sm:gap-3 text-gray-700 font-semibold text-sm sm:text-base">
                  <input
                    type="checkbox"
                    checked={job.isCurrent}
                    onChange={(e) =>
                      onArrayChange("employmentHistory", index, {
                        ...job,
                        isCurrent: e.target.checked,
                      })
                    }
                    className="rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-2 w-4 h-4 sm:w-5 sm:h-5"
                  />
                  Current Position
                </label>
              </div>
              <div className="mt-4 sm:mt-6">
                <label className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
                  Job Description
                </label>
                <textarea
                  value={job.description}
                  onChange={(e) =>
                    onArrayChange("employmentHistory", index, {
                      ...job,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your role and responsibilities..."
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-2xl py-2 px-3 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
            <p className="text-base sm:text-lg font-medium mb-2">
              No employment history added yet
            </p>
            <p className="text-xs sm:text-sm">
              Click "Add Job" to start building your work experience
            </p>
          </div>
        )}
      </div>
    </div>
  );
}