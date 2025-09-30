const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var multer = require("multer");
const { body } = require("express-validator");
const User = require("../models/User");
const Rank = require("../models/Rank");
const Order = require("../models/Order");
const rejectBadRequests = require("../services/validationService");
const { v4: uuidv4 } = require("uuid");
const auth = require("../middleware/auth");
var cloudinary = require("cloudinary").v2;
const { calculateActiveCommission, calculatePassiveCommission } = require("../utils/userCommission")
const Sib = require('sib-api-v3-sdk')
require('dotenv').config()

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE_API_KEY

const port = process.env.PORT || 4000;

const IS_PROD = process.env.NODE_ENV === "production";
const API_URL = IS_PROD ? "www.successthinks.com" : "http://localhost:3000";

// const isDevelopment = port.toString().includes("4000");


cloudinary.config({
  cloud_name: "dtqrvcvp8",
  api_key: "137487476221951",
  api_secret: "uSHY3PvYKXbMfoYnw0AN0wGFYV8",
});

// TODO include payment details as well
const userPostBodyValidators = [
  body("name").notEmpty().withMessage("name field is required"),
  body("username").notEmpty().withMessage("username field is required"),
  body("phone").notEmpty().withMessage("phone field is required"),
  body("email").notEmpty().withMessage("email field is required"),
  body("password").notEmpty().withMessage("password field is required"),
];

var upload = multer({ dest: "public/uploads/" });

/**
 * create a user
 */
Router.post(
  "/",
  userPostBodyValidators,
  rejectBadRequests,
  async (req, res) => {
    const { paymentData, confirmPassword, ...userDetails } = req.body;
    // const { confirmPassword, product, productPrice, ...userDetails } = req.body;


    const userreference = uuidv4();

    const { email, phone, password } = userDetails;

    const productId = paymentData.product;

    try {
      let user = await User.findOne({ email });

      if (user) {
        res.status(409).json({
          error: [{ msg: "User already Exists with this email address" }],
        });
        return;
      }

      user = await User.findOne({ phone });

      if (user) {
        res.status(409).json({
          error: [{ msg: "User already Exists with this phone number" }],
        });
        return;
      }

      user = new User({
        ...userDetails,
        userreference: userreference,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save().catch((err) => {
        console.log(err);
        res
          .status(400)
          .send(
            "some error occured while creating user, Please contact admin if money has been deducted"
          );
        return;
      });

      await User.findByIdAndUpdate(user.id, {
        $push: { products: productId },
      }).catch((err) => {
        console.log(err);
        res
          .status(400)
          .send(
            "User registered successfully, but failed to update some attributes, Please contact admin."
          );
        return;
      });

      order = new Order({
        ...paymentData,
        userreference: userreference,
        user: user.id,
      });

      await order.save().catch((err) => {
        console.log(err);
        res
          .status(400)
          .send(
            "User registered successfully, but failed to update referer, Please contact admin."
          );
        return;
      });

      if (
        userDetails.introducerreference !== undefined &&
        userDetails.introducerreference !== "" &&
        userDetails.introducerreference !== null
      ) {
        await User.findOneAndUpdate(
          { userreference: userDetails.introducerreference },
          { $push: { downlineUsers: user.id } }
        ).catch((err) => {
          console.log(err);
          res
            .status(400)
            .send(
              "User registered successfully, but failed to update referer, Please contact admin. You can login from the login page"
            );
          return;
        });
      }


      // sgMail
      //   .send(msg)
      //   .catch((error) => {
      //     console.error(error);
      //   });

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
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token, userData });
        }
      );

      return;
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send("Some error occurred while creating user. Contact Admin");
      return;
    }
  }
);

/**
 * User update api
 */
Router.patch("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send({ msg: "no user found with this user ID" });
    }

    if (req.body.withdrawalRequest === true) {

      const tranEmailApi = new Sib.TransactionalEmailsApi()
      const sender = {
        email: 'business@successthinks.com',
        name: 'Team Success Thinks',
      }
      // userreference
      const receivers = [
        {
          email: 'teamsuccessthinks@gmail.com',
        },
      ]

      tranEmailApi
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: `New withdrawal request`,
          htmlContent: `<p>A withdrawal request has been raised by user - ${user.name} <br/> 
        <a clicktracking="off" href="${API_URL}/income-dashboard/${user.userreference}" >
        click here to go to profile</a> <br/>`,
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ msg: "Some error occurred while creating request, please try again later." });
          return;
        });

    }
    await User.findByIdAndUpdate(req.user.id, req.body)
      .then(() => {
        return res.status(200).send("User details updated successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
        return;
      });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

// TODO change to patch
/**
 * User image update api
 */
Router.post(
  "/image/:userId",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      image = await cloudinary.uploader.upload(req?.file?.path);
    } catch (error) {
      console.log(error);
    }

    var data = { profile_image: image?.secure_url };

    try {
      const user = await User.find({ userreference: req.params.userId });

      if (!user) {
        return res.status(404).send({ msg: "no user found with this user ID" });
      }

      await User.findOneAndUpdate({ userreference: req.params.userId }, data)
        .then(() => {
          return res.status(200).send("User details updated successfully");
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send(err);
          return;
        });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

/**
 * get current user income
 */
Router.get("/income", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).send({ msg: "no user found with this user ID" });
    }

    const userRank = await Rank.findOne({ userreference: user.userreference });

    let activeUsers = await User.find({
      introducerreference: user.userreference,
    });

    // filter out active users 
    activeUsers = activeUsers.filter(user => user.isActive !== false);

    let passiveUsers = [];

    for (let i = 0; i < activeUsers.length; i++) {
      let tempUsers = await User.find({
        introducerreference: activeUsers[i].userreference,
      });
      passiveUsers = passiveUsers.concat(tempUsers);
    }

    // filter out active users 
    passiveUsers = passiveUsers.filter(user => user.isActive !== false);

    const activeUsersVar = activeUsers.map((person) => ({
      ...person._doc,
      // commission: person?.products?.includes("2") ? "1600" : "3000",
      commission: calculateActiveCommission(person.products, person.createdAt, user.products)
    }));

    const passiveUsersVar = passiveUsers.map((person) => ({
      ...person._doc,
      // commission: person?.products?.includes("2") ? "150" : "500",
      commission: calculatePassiveCommission(person.products, person.createdAt, user.products)
    }));

    return res
      .status(200)
      .send({ activeUsers: activeUsersVar, passiveUsers: passiveUsersVar, userRank });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

/**
 * get leaderboard details
 */
Router.get("/leaderboard", auth, async (req, res) => {
  try {

    const currentUser = await User.findById(req.user.id).select("userreference");

    const currentUserRank = await Rank.findOne({ userreference: currentUser.userreference })

    const responseList = [];

    const users = await Rank.find({
      rank: { $lte: 10, $gte: 1 }
    })

    for (let i = 0; i < users.length; i++) {
      let userDetails = await User.findOne({ userreference: users[i].userreference }).select("name profile_image username")
      responseList.push({ ...userDetails._doc, ...users[i]._doc })
    }
    // .select("userreference email name LeaderBoardIncome profile_image username");

    return res
      .status(200)
      .send({ list: responseList, currentUserRank });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

/**
 * forgot password requests
 */
Router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ msg: "No user found with provided email address." });
    } else {
      var payload = {
        user: {
          id: user.userreference,
        },
      };

      var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "4h" });

      const tranEmailApi = new Sib.TransactionalEmailsApi()
      const sender = {
        email: 'business@successthinks.com',
        name: 'Team Success Thinks',
      }
      const receivers = [
        {
          email: user.email,
        },
      ]

      tranEmailApi
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: `Reset Password for ${user.name}`,
          htmlContent: `<p>Below is your password reset link <br/> 
        <a clicktracking="off" href="${API_URL}/reset-password?token=${token}" >
        click here</a> <br/>
         This link is only valid for 4 hours </p>`,
        })
        .then(() => {
          return res.status(200).json({ msg: "Email with reset link has been sent to registered email address" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ msg: "Some error occurred while sending email. Please try again or contact admin" });
          return;
        });

    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Some error occurred while sending email. Please try again or contact admin" });
    return;
  }
})


/**
 * reset password
 */
Router.post("/reset-password", async (req, res) => {
  const token = req.body.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userreference = decoded.user.id;

    var user = await User.findOne({ userreference: userreference });

    if (!user) {
      res.status(401).json(
        {
          msg: "Unable to authenticate token. Please initiate a new forgot password request"
        }
      );
      return;
    }

    const salt = await bcrypt.genSalt(10);

    const password = await bcrypt.hash(req.body.password, salt);

    await User.findOneAndUpdate(
      { userreference: userreference },
      { $set: { password } },
    ).then(() => {
      res.status(200).json({ msg: 'password updated successfully.' })
    }).catch((err) => {
      console.log(err);
      res
        .status(400)
        .send(
          { msg: 'Some error occured while updating the password. Please try again or contact the admin.' }
        );
      return;
    });


  } catch (err) {
    console.log(err)
    res.status(401).json(
      {
        msg: "Unable to authenticate token. Please initiate a new forgot password request"
      }
    );
    return;
  }
})

/**
 * get name of referrer
 */
Router.get("/referrer-name/:userUuid", async (req, res) => {

  try {
    const user = await User.findOne({ userreference: req.params.userUuid }).select("name");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = Router;
