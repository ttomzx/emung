import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, default: "" },
    category: { type: String, default: "Reunion" },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    authorUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    family: { type: mongoose.Schema.Types.ObjectId, ref: "Family" },
  },
  { timestamps: true }
);

export default mongoose.model("Memory", memorySchema);
