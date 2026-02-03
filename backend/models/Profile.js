import mongoose from "mongoose";

const employmentHistorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false, // Made optional
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false, // Made optional
  },
  skills: [
    {
      type: String,
    },
  ],
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
});

const profileSchema = new mongoose.Schema(
  {
    profileName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
    },
    skills: [
      {
        type: String,
      },
    ],
    employmentHistory: [employmentHistorySchema],
    certifications: [
      {
        name: {
          type: String,
          required: true,
        },
        issuer: {
          type: String,
        },
        issueDate: {
          type: String,
        },
        verification: {
          type: String,
        },
        skills: [
          {
            type: String,
          },
        ],
      },
    ],
    projects: [projectSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema);
