const express = require("express");
const { Booking, Spot, User, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage("startDate must be a valid date")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("startDate cannot be in the past");
      }
      return true;
    }),
  check("endDate")
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage("endDate must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("endDate cannot be on or before startDate");
      }
      return true;
    }),
  handleValidationErrors,
];

// Get all bookings of current user
router.get("/current/:userId", requireAuth, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
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
          include: [
            {
              model: SpotImage,
              where: { preview: true },
              attributes: ["url"],
              required: false,
            },
          ],
        },
      ],
    });

    // Transform the data to include previewImage
    const formattedBookings = bookings.map((booking) => {
      const bookingData = booking.toJSON();

      // Format the Spot data
      if (bookingData.Spot) {
        bookingData.Spot.previewImage =
          bookingData.Spot.SpotImages?.[0]?.url || null;

        // Remove the SpotImages array
        delete bookingData.Spot.SpotImages;
      }

      return bookingData;
    });

    res.json({ Bookings: formattedBookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get bookings by spot ID
router.get("/spots/:spotId/bookings", requireAuth, async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Different response based on ownership
    if (spot.ownerId === req.user.id) {
      const bookings = await Booking.findAll({
        where: { spotId: req.params.spotId },
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });
      return res.json({ Bookings: bookings });
    } else {
      const bookings = await Booking.findAll({
        where: { spotId: req.params.spotId },
        attributes: ["spotId", "startDate", "endDate"],
      });
      return res.json({ Bookings: bookings });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a booking
router.post(
  "/:spotId/bookings",
  requireAuth,
  validateBooking,
  async (req, res) => {
    try {
      const spot = await Spot.findByPk(req.params.spotId);
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }

      if (spot.ownerId === req.user.id) {
        return res.status(403).json({ message: "Cannot book your own spot" });
      }

      // Check for booking conflicts
      const conflictingBooking = await Booking.findOne({
        where: {
          spotId: req.params.spotId,
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [req.body.startDate, req.body.endDate],
              },
            },
            {
              endDate: {
                [Op.between]: [req.body.startDate, req.body.endDate],
              },
            },
          ],
        },
      });

      if (conflictingBooking) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
          },
        });
      }

      const booking = await Booking.create({
        spotId: parseInt(req.params.spotId),
        userId: req.user.id,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      });

      res.status(201).json(booking);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Edit a booking
router.put("/:bookingId", requireAuth, validateBooking, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (new Date(booking.endDate) < new Date()) {
      return res
        .status(403)
        .json({ message: "Past bookings can't be modified" });
    }

    // Check for booking conflicts
    const conflictingBooking = await Booking.findOne({
      where: {
        id: { [Op.ne]: req.params.bookingId },
        spotId: booking.spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [req.body.startDate, req.body.endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [req.body.startDate, req.body.endDate],
            },
          },
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    await booking.update({
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    const spot = await Spot.findByPk(booking.spotId);
    if (booking.userId !== req.user.id && spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (new Date(booking.startDate) <= new Date()) {
      return res.status(403).json({
        message: "Bookings that have been started can't be deleted",
      });
    }

    await booking.destroy();
    res.json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
