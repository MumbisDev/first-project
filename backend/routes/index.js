// routes/index.js
const express = require("express");
const router = express.Router();
const apiRouter = require("./api");

router.use("/api", apiRouter);

// Add a test route
router.get("/test", function (req, res) {
  res.json({ message: "test route" });
});

module.exports = router;
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    "XSRF-Token": csrfToken,
  });
});

module.exports = router;
