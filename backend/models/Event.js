import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, default: "" },
    location: { type: String, default: "" },
    type: { type: String, default: "Festival" },
    description: { type: String, default: "" },
    attendees: { type: Number, default: 0 },
    rsvps: [{ type: String }], // Array of user IDs or emails who RSVP'd
    isUpcoming: { type: Boolean, default: true },
    authorUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    family: { type: mongoose.Schema.Types.ObjectId, ref: "Family" },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
