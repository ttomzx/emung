import express from "express";
import Story from "../models/Story.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/stories
// @desc    Get all stories
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/stories/:id
// @desc    Get single story by ID
router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/stories
// @desc    Create a story
router.post("/", protect, async (req, res) => {
  try {
    const { title, category, tag, author, readTime, summary, content } = req.body;

    const story = new Story({
      title,
      category: category || "Tradition",
      tag: tag || "Ancestry",
      author: author || req.user.name,
      authorUser: req.user._id,
      readTime: readTime || "3 min read",
      summary,
      content,
      family: req.user.family?._id,
    });

    const createdStory = await story.save();
    res.status(201).json(createdStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/stories/:id
// @desc    Update a story
router.put("/:id", protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.authorUser && String(story.authorUser) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this story" });
    }

    Object.assign(story, req.body);
    const updatedStory = await story.save();
    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/stories/:id
// @desc    Delete a story
router.delete("/:id", protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.authorUser && String(story.authorUser) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this story" });
    }

    await story.deleteOne();
    res.json({ message: "Story removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
