import { Schema, model } from "mongoose";

const applicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "job",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  userTechSkills: [String],
  userSoftSkills: [String],
  userResume: String,
});

const applicationModel = model("application", applicationSchema);

export default applicationModel;
