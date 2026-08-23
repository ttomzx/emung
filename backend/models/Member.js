import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    relation: { type: String, default: "Family Member" },
    generation: { type: Number, required: true, default: 1 },
    gender: { type: String, enum: ["male", "female", "Other", "Male", "Female"], default: "male" },
    dateOfBirth: { type: String },
    dateOfDeath: { type: String, default: null },
    biography: { type: String, default: "" },
    location: { type: String, default: "" },
    profession: { type: String, default: "" },
    interests: [{ type: String }],
    profilePhoto: { type: String, default: "" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    family: { type: mongoose.Schema.Types.ObjectId, ref: "Family" },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
