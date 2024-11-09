const express = require("express");
const { Review, User, Spot, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

// Get all reviews of current user
router.get("/current/:userId", requireAuth, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const reviews = await Review.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Spot,
          attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "price",
          ],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });

    res.json({ Reviews: reviews });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add an image to a review
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const imageCount = await ReviewImage.count({
      where: { reviewId: req.params.reviewId },
    });

    if (imageCount >= 10) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached",
      });
    }

    const image = await ReviewImage.create({
      reviewId: parseInt(req.params.reviewId),
      url: req.body.url,
    });

    res.status(201).json({
      id: image.id,
      url: image.url,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Edit a review
router.put("/:reviewId", requireAuth, validateReview, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await review.update({
      review: req.body.review,
      stars: req.body.stars,
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a review
router.delete("/:reviewId", requireAuth, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await review.destroy();
    res.json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
