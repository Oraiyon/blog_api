const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Users = require("../models/users");
const bcrypt = require("bcryptjs");

exports.signup_get = (req, res, next) => {
  res.render("signup", {
    title: "Sign Up"
  });
};

exports.signup_post = [
  body("username", "Username must be specified").trim().isLength({ min: 1 }).escape(),
  body("password", "Password must be specified").trim().isLength({ min: 6 }).escape(),
  body("confirmPassword", " Confirm Password must be match password")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),
  asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      } else {
        const errors = validationResult(req);
        const user = new Users({
          username: req.body.username,
          password: hashedPassword,
          admin: false
        });
        if (!errors.isEmpty()) {
          res.render("signup", {
            title: "Sign Up",
            user,
            errors
          });
          return;
        } else {
          await user.save();
          res.redirect("/login");
        }
      }
    });
  })
];
