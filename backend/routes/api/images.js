const express = require("express");
const { SpotImage, ReviewImage, Spot, Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Delete a spot image
router.delete("/spot/images/:imageId", requireAuth, async (req, res) => {
  try {
    const spotImage = await SpotImage.findByPk(req.params.imageId, {
      include: [{ model: Spot }],
    });

    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    if (spotImage.Spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await spotImage.destroy();
    res.json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a review image
router.delete("/review/images/:imageId", requireAuth, async (req, res) => {
  try {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
      include: [{ model: Review }],
    });

    if (!reviewImage) {
      return res
        .status(404)
        .json({ message: "Review Image couldn't be found" });
    }

    if (reviewImage.Review.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await reviewImage.destroy();
    res.json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
