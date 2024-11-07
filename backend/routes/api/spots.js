const express = require("express");
const { Spot } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Public route - anyone can see all spots
router.get("/", async (req, res) => {
  try {
    const spots = await Spot.findAll();

    if (!spots) {
      return res.status(404).json({ message: "No spots found" });
    }
    res.status(200).json({ spots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected route - only authenticated users can see their spots
router.get("/current/:userId", requireAuth, async (req, res) => {
  try {
    // Check if the authenticated user matches the requested userId
    if (req.user.id !== parseInt(req.params.userId)) {
      return res.status(403).json({
        message: "Forbidden",
        errors: {
          message: "You don't have permission to view these spots",
        },
      });
    }

    const spots = await Spot.findAll({
      where: {
        ownerId: req.params.userId, // Assuming spots have an ownerId field
      },
    });

    if (!spots || spots.length === 0) {
      return res.status(404).json({ message: "No spots found" });
    }

    res.status(200).json({ spots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
