const express = require("express");
const { Spot } = require("../../db/models");
const { SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isInt({ gt: 0 })
    .withMessage("Price per day must be positive number"),
  handleValidationErrors,
];

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

router.get("/current/:userId", requireAuth, async (req, res) => {
  try {
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
        ownerId: req.params.userId,
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

router.post("/", requireAuth, validateSpot, async (req, res) => {
  try {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const newSpot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    res.status(201).json({ spot: newSpot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:spotId/images", requireAuth, async (req, res) => {
  try {
    const spot = await Spot.findByPk(parseInt(req.params.spotId));

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
        errors: {
          message: "You must be the owner of this spot to add images",
        },
      });
    }

    const spotImage = await SpotImage.create({
      spotId: parseInt(req.params.spotId),
      url: req.body.url,
      preview: req.body.preview,
    });

    res.status(201).json({ image: spotImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
