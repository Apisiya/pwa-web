const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const User = require("../models/user");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
//GET => /login
router.get("/login", authController.getLogin);
//POST => /login
router.post(
  "/login",
  [
    body("email", "Please Enter a valid email").isEmail().normalizeEmail(),
    body("password", "password must be character or number and more than 5")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);
//GET => /signup
router.get("/signup", authController.getSignup);
//POST => /signup
router.post(
  "/signup",
  [
    body("fullName", "Name is required").trim().not().isEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password", "password must be character or number and more than 5")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password mismatch");
        }
        return true;
      }),
    body(
      "pricePerWaterUnit",
      "Price per Unit must be number and greater than 0"
    )
      .trim()
      .isFloat({ gt: 0.0 }),
    body(
      "pricePerElectricityUnit",
      "Price per Unit must be number and greater than 0"
    )
      .trim()
      .isFloat({ gt: 0.0 }),
  ],
  authController.postSignup
);
//POST => /logout
router.post("/logout", isAuth, authController.postLogout);
//GET => /edit-user/
router.get("/edit-user/:userId", isAuth, authController.getEditUser);
//POST => /edit-user
router.post("/edit-user", isAuth, authController.postEditUser);
module.exports = router;
