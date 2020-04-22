const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    errorMessage: "",
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, password: password },
      validationErrors: errors.array(),
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          errorMessage: "No user found",
          oldInput: { email: email, password: password },
          validationErrors: errors.array(),
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.user = user;
            return req.session.save(() => {
              res.redirect("/");
            });
          } else {
            return res.status(422).render("auth/login", {
              errorMessage: "wrong password",
              oldInput: { email: email, password: password },
              validationErrors: errors.array(),
            });
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    errorMessage: "",
    oldInput: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      pricePerWaterUnit: "",
      pricePerElectricityUnit: "",
    },
    validationErrors: [],
  });
};
exports.postSignup = (req, res, next) => {
  const name = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const pricePerWaterUnit = req.body.pricePerWaterUnit;
  const pricePerElectricityUnit = req.body.pricePerElectricityUnit;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
        pricePerWaterUnit: pricePerElectricityUnit,
        pricePerElectricityUnit: pricePerElectricityUnit,
      },
      validationErrors: errors.array(),
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        pricePerWaterUnit: pricePerWaterUnit,
        pricePerElectricityUnit: pricePerElectricityUnit,
        units: { water: [], electricity: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.getEditUser = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.redirect("/");
      }
      res.render("auth/edit", {
        id: user._id,
        fullName: user.name,
        email: user.email,
        password: user.password,
        pricePerElectricityUnit: user.pricePerElectricityUnit,
        pricePerWaterUnit: user.pricePerWaterUnit,
        editing: editMode,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditUser = (req, res, next) => {
  User.findById(req.body.id)
    .then((user) => {
      if (!user) {
        res.redirect("/");
      }
      user.pricePerElectricityUnit = req.body.pricePerElectricityUnit;
      user.pricePerWaterUnit = req.body.pricePerWaterUnit;
      return user
        .save()
        .then((result) => {
          res.redirect("/");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
