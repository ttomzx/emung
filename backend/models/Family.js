import mongoose from "mongoose";

const familySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: "Emung Family Heritage" },
    familyCode: { type: String, required: true, unique: true, default: "EMUNG-MAIN" },
    settings: {
      allowMemberAddMember: { type: Boolean, default: true },
      allowMemberCreateEvent: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Family", familySchema);
