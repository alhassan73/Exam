import { Schema, model } from "mongoose";

const jobsSchema = new Schema({
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
});

const jobsModel = model("jobs", jobsSchema);

export default jobsModel;
