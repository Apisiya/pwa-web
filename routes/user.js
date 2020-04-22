const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const User = require("../models/user");
//GET => Index
router.get("/", isAuth, userController.getIndex);
//GET => /input
router.get("/unit/water", isAuth, userController.getUnitWater);
//GET => /input
router.get("/unit/electricity", isAuth, userController.getUnitElectricity);
//POST => /add-unit-water
router.post(
  "/add-unit-water",
  isAuth,
  [
    body("unitWater").custom((value, { req }) => {
      return User.findById(req.user).then((user) => {
        if (parseInt(value) < parseInt(user.units.water.slice(-1)[0].units)) {
          return Promise.reject(
            "Please inset unit that greater than the old one"
          );
        }
      });
    }),
  ],
  userController.postUnitWater
);
//POST => /add-unit-electricity
router.post(
  "/add-unit-electricity",
  [
    body("unitElectricity").custom((value, { req }) => {
      return User.findById(req.user).then((user) => {
        if (
          parseInt(value) < parseInt(user.units.electricity.slice(-1)[0].units)
        ) {
          return Promise.reject(
            "Please inset unit that greater than the old one"
          );
        }
      });
    }),
  ],
  isAuth,
  userController.postUnitElectricity
);
module.exports = router;
