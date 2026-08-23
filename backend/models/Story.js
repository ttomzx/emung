import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "Tradition" },
    tag: { type: String, default: "Ancestry" },
    author: { type: String, required: true },
    authorUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: String, default: () => new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
    readTime: { type: String, default: "3 min read" },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    family: { type: mongoose.Schema.Types.ObjectId, ref: "Family" },
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);
