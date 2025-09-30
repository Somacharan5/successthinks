const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const User = require('../models/User');
const rejectBadRequests = require("../services/validationService");
require('dotenv').config()

const loginBodyValidators = [
  body("email").notEmpty().withMessage("name field is required"),
  body("password").notEmpty().withMessage("password field is required"),
];

/**
 * verify token
 */
Router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

/**
 * login
 */
Router.post(
  "/",
  loginBodyValidators,
  rejectBadRequests,

  async (req, res) => {
    const { email, password } = req.body;

    const emailLowerCase = email.toLowerCase();

    try {
      let user = await User.findOne({ email :  emailLowerCase });

      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: [{ msg: "Wrong Password" }] });
      }

      if (user.isActive === false) {
        return res.status(401).json({ error: [{ msg: "Your Account is not active. Please contact admin if you have paid already." }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const userData = {
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        userreference: user.userreference,
        activeIncome: user.activeIncome,
        passiveIncome: user.passiveIncome,
        students: user.students,
        sevenDaysIncome: user.sevenDaysIncome,
        todayIncome: user.todayIncome,
        thirtyDaysIncome: user.thirtyDaysIncome,
        products: user.products,
        isActive: user.isActive,
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token, userData });
        }
      );

      return;
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
      return;
    }
  }
);

module.exports = Router;
