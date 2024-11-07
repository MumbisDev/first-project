const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Spot } = require("../../db/models");

// const authenticate = require('../../utils/auth');

const { setTokenCookie, requireAuth } = require("../../utils/auth");






const router = express.Router();

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
        const spots = await Spot.findAll({ where: {id: req.params.userId }});
        if (!spots) {
            return res.status(404).json({ message: "No spots found" });
          }
          res.status(200).json({ spots });
  } catch (err) {
    console.error(err);  
    res.status(500).json({ message: "Internal server error" });
  }
})

  
module.exports = router;