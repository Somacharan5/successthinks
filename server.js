const express = require("express");
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const LoginHandler = require("./src/handlers/auth");
const UserHandler = require("./src/handlers/user");
const PaymentHandler = require("./src/handlers/payment");
const VideoHandler = require("./src/handlers/video");
const BankHandler = require("./src/handlers/bank");
const AdminHandler = require("./src/handlers/admin");
const WithdrawalHandler = require("./src/handlers/withdrawal");
const NotificationHandler = require("./src/handlers/notification");
const VideoTopicHandler = require("./src/handlers/videoTopic");
const DiscountCouponHandler = require("./src/handlers/discountCoupon");
const HelpHandler = require("./src/handlers/help");
const path = require("path");
const rankUsers = require("./src/services/rankingService")

const app = express();

const appName = "Success Thinks";
const port = process.env.PORT || 4000;

const isDevelopment = port.toString().includes("4000");

const mongoUrl = isDevelopment
  ? "mongodb+srv://admin:gOlYb6hkwkPuByZv@cluster0.a9byj.mongodb.net/testDatabase?retryWrites=true&w=majority"
  : "mongodb+srv://admin:gOlYb6hkwkPuByZv@cluster0.a9byj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//mongoose connection
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("MongoDB connected successfully");
});

// app.use(express.static("public"));
app.use(express.json({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,Content-Disposition, x-auth-token"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST, PUT, DELETE, OPTIONS, PATCH");
  if (req.method === "OPTIONS") {
    return res.send();
  }
  next();
});

app.use("/auth", LoginHandler);
app.use("/user", UserHandler);
app.use("/payment", PaymentHandler);
app.use("/video", VideoHandler);
app.use("/admin", AdminHandler);
app.use("/bank", BankHandler);
app.use("/withdrawal-request", WithdrawalHandler);
app.use("/notification", NotificationHandler);
app.use("/video-topic", VideoTopicHandler);
app.use("/help-request", HelpHandler);
app.use("/discount-coupon", DiscountCouponHandler);

// serve static assets in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

schedule.scheduleJob( '15 04 * * *', async () => {
  await rankUsers();
  console.log('ranking mechanism ran');
  return;
})

//listen
app.listen(port, () => {
  console.log(`${appName} listening on port ${port}`);
});
