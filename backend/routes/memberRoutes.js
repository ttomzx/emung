import express from "express";
import Member from "../models/Member.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/members
// @desc    Get all family members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().populate("parent", "name relation generation").sort({ generation: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/members/:id
// @desc    Get single family member by ID
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate("parent", "name relation generation");
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/members
// @desc    Create a new family member
router.post("/", protect, async (req, res) => {
  try {
    const { name, relation, generation, gender, dateOfBirth, dateOfDeath, biography, location, profession, interests, parent } = req.body;

    const member = new Member({
      name,
      relation,
      generation: Number(generation) || 1,
      gender: gender || "male",
      dateOfBirth,
      dateOfDeath: dateOfDeath || null,
      biography,
      location,
      profession,
      interests: Array.isArray(interests) ? interests : (interests ? interests.split(",").map(i => i.trim()) : []),
      parent: parent || null,
      user: req.user._id,
      family: req.user.family?._id,
    });

    const createdMember = await member.save();
    res.status(201).json(createdMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/members/:id
// @desc    Update a family member
router.put("/:id", protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const fields = [
      "name", "relation", "generation", "gender", "dateOfBirth",
      "dateOfDeath", "biography", "location", "profession", "interests", "parent"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "interests" && typeof req.body[field] === "string") {
          member[field] = req.body[field].split(",").map((i) => i.trim());
        } else {
          member[field] = req.body[field];
        }
      }
    });

    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/members/:id
// @desc    Delete a family member (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await member.deleteOne();
    res.json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
