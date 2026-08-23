import express from "express";
import Event from "../models/Event.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/events
// @desc    Create an event
router.post("/", protect, async (req, res) => {
  try {
    const { title, date, time, location, type, description, attendees } = req.body;

    const event = new Event({
      title,
      date,
      time: time || "",
      location: location || "",
      type: type || "Festival",
      description: description || "",
      attendees: Number(attendees) || 1,
      rsvps: [req.user.email],
      isUpcoming: true,
      authorUser: req.user._id,
      family: req.user.family?._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/events/:id/rsvp
// @desc    RSVP to an event
router.put("/:id/rsvp", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const userEmail = req.user.email;
    const hasRsvped = event.rsvps.includes(userEmail);

    if (hasRsvped) {
      event.rsvps = event.rsvps.filter((e) => e !== userEmail);
      event.attendees = Math.max(0, event.attendees - 1);
    } else {
      event.rsvps.push(userEmail);
      event.attendees += 1;
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event
router.put("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    Object.assign(event, req.body);
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
router.delete("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
