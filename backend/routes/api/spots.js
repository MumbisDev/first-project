const express = require("express");
const { Op, Sequelize } = require("sequelize");
const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
  sequelize,
} = require("../../db/models");
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

const validateQueryParams = [
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Size must be between 1 and 20"),
  check("minLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid"),
  check("maxLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  check("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  check("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  check("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];

router.get("/:spotId", async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    res.status(200).json({ spot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", validateQueryParams, async (req, res) => {
  try {
    const {
      page = 1,
      size = 20,
      minLat,
      maxLat,
      minLng,
      maxLng,
      minPrice,
      maxPrice,
    } = req.query;

    const where = {};

    if (minLat && maxLat) {
      where.lat = { [Op.between]: [minLat, maxLat] };
    } else if (minLat) {
      where.lat = { [Op.gte]: minLat };
    } else if (maxLat) {
      where.lat = { [Op.lte]: maxLat };
    }

    if (minLng && maxLng) {
      where.lng = { [Op.between]: [minLng, maxLng] };
    } else if (minLng) {
      where.lng = { [Op.gte]: minLng };
    } else if (maxLng) {
      where.lng = { [Op.lte]: maxLng };
    }

    if (minPrice && maxPrice) {
      where.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice) {
      where.price = { [Op.gte]: minPrice };
    } else if (maxPrice) {
      where.price = { [Op.lte]: maxPrice };
    }

    const pagination = {
      limit: parseInt(size),
      offset: (parseInt(page) - 1) * parseInt(size),
    };

    // First, get all spots with basic info
    const spots = await Spot.findAll({
      where,
      ...pagination,
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
        "description",
        "price",
        "createdAt",
        "updatedAt",
      ],
    });

    // Then, enhance each spot with its preview image and average rating
    const enhancedSpots = await Promise.all(
      spots.map(async (spot) => {
        const spotData = spot.toJSON();

        // Get preview image
        const previewImage = await SpotImage.findOne({
          where: {
            spotId: spot.id,
            preview: true,
          },
          attributes: ["url"],
        });

        // Get average rating
        const avgRating = await Review.findOne({
          where: { spotId: spot.id },
          attributes: [
            [Sequelize.fn("AVG", Sequelize.col("stars")), "average"],
          ],
          raw: true,
        });

        return {
          ...spotData,
          avgRating: avgRating?.average
            ? parseFloat(avgRating.average).toFixed(1)
            : null,
          previewImage: previewImage?.url || null,
        };
      })
    );

    res.json({
      Spots: enhancedSpots,
      page: parseInt(page),
      size: parseInt(size),
    });
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

router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    await spot.update(req.body);
    return res.json(spot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:spotId", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await spot.destroy();
  return res.json({ message: "Successfully deleted" });
});

router.get("/:spotId/reviews", async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const reviews = await Review.findAll({
      where: { spotId: req.params.spotId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });

    res.json({ Reviews: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res) => {
    try {
      const spot = await Spot.findByPk(req.params.spotId);
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }

      const existingReview = await Review.findOne({
        where: {
          spotId: req.params.spotId,
          userId: req.user.id,
        },
      });

      if (existingReview) {
        return res
          .status(500)
          .json({ message: "User already has a review for this spot" });
      }

      const review = await Review.create({
        userId: req.user.id,
        spotId: parseInt(req.params.spotId),
        review: req.body.review,
        stars: req.body.stars,
      });

      res.status(201).json(review);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
module.exports = router;
