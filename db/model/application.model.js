import { Schema, model } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    userTechSkills: [String],
    userSoftSkills: [String],
    userResume: { type: String, required: true },
  },
  { timestamps: true }
);

const applicationModel = model("application", applicationSchema);

export default applicationModel;
