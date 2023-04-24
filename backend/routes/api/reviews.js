const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");

const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { User, Booking, Spot, Review, Image, sequelize } = require("../../db/models");

const router = express.Router();

router.get("/current", requireAuth, async (req, res, next) => {
  const userReviews = await Review.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"]
        }
      },
      {
        model: Image,
        attributes: ["id", "url"],
        as: "ReviewImages",
      },
    ],
  });

  return res.json({ Reviews: userReviews });
});


module.exports = router;
