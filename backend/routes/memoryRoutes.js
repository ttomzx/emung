import express from "express";
import Memory from "../models/Memory.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/memories
// @desc    Get all memories
router.get("/", async (req, res) => {
  try {
    const memories = await Memory.find().sort({ date: -1 });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/memories
// @desc    Create a memory
router.post("/", protect, async (req, res) => {
  try {
    const { title, date, location, category, imageUrl, caption } = req.body;

    const memory = new Memory({
      title,
      date: date || new Date().toISOString().split("T")[0],
      location: location || "",
      category: category || "Reunion",
      imageUrl,
      caption: caption || "",
      likes: 0,
      authorUser: req.user._id,
      family: req.user.family?._id,
    });

    const createdMemory = await memory.save();
    res.status(201).json(createdMemory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/memories/:id/like
// @desc    Toggle like on a memory
router.put("/:id/like", protect, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    const hasLiked = memory.likedBy.includes(req.user._id);

    if (hasLiked) {
      memory.likedBy = memory.likedBy.filter((id) => String(id) !== String(req.user._id));
      memory.likes = Math.max(0, memory.likes - 1);
    } else {
      memory.likedBy.push(req.user._id);
      memory.likes += 1;
    }

    const updatedMemory = await memory.save();
    res.json(updatedMemory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/memories/:id
// @desc    Update memory details
router.put("/:id", protect, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    if (memory.authorUser && String(memory.authorUser) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this memory" });
    }

    Object.assign(memory, req.body);
    const updatedMemory = await memory.save();
    res.json(updatedMemory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/memories/:id
// @desc    Delete a memory
router.delete("/:id", protect, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    if (memory.authorUser && String(memory.authorUser) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this memory" });
    }

    await memory.deleteOne();
    res.json({ message: "Memory removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
