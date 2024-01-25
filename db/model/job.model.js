import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enum: ["onsite", "remotely", "hyprid"],
      default: "onsite",
    },
    workingTime: {
      type: String,
      enum: ["part-time", "full-time"],
      default: "full-time",
    },
    seniorityLevel: {
      type: String,
      enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
      default: "Junior",
    },
    jobDescription: String,
    technicalSkills: [String],
    softSkills: [String],
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "company",
    },
  },
  { timestamps: true }
);

const jobModel = model("job", jobSchema);

export default jobModel;
