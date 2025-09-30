const Router = require("express").Router();
const auth = require("../middleware/auth");
const { body } = require("express-validator");
const DiscountCoupon = require("../models/DiscountCoupon");
const rejectBadRequests = require("../services/validationService");
const User = require("../models/User");

const discountCouponAddEditBodyValidators = [
    body("name")
        .notEmpty()
        .withMessage("name field is required")
        .isString()
        .withMessage("name must be a string."),
    body("active")
        .notEmpty()
        .withMessage("active field is required")
        .isBoolean()
        .withMessage("active must be a string."),
    body("type")
        .notEmpty()
        .withMessage("type field is required")
        .isString()
        .withMessage("type must be a string."),
    body("amount")
        .notEmpty()
        .withMessage("amount field is required")
        .isNumeric()
        .withMessage("amount must be a number."),
];

const verifyDiscountCouponBodyValidators = [
    body("coupon")
        .notEmpty()
        .withMessage("coupon field is required")
        .isString()
        .withMessage("coupon must be a string."),
];

/**
 * create a Discount Coupon
 */
Router.post("/",
    auth,
    discountCouponAddEditBodyValidators,
    rejectBadRequests,
    async (req, res) => {
        const admin = await User.findById(req.user.id);
        if (admin.userType !== "0") {
            return res
                .status(401)
                .send({ msg: "You are not authorized to make this action." });
        }
        try {

            const data = {
                ...req.body,
                name: req.body.name.toLowerCase(),
                type: req.body.type.toLowerCase(),
            }

            const discountCoupon = new DiscountCoupon(data);
            await discountCoupon.save().catch((err) => {
                console.log(err);
                return res
                    .status(400)
                    .send("some error occured while creating discount coupon.");
            });
            return res.status(200).send("Dicsount coupon created Successfully");
        } catch (err) {
            console.log(err.message);
            res.status(500).send("server error");
        }
    });

/**
* verify a Discount Coupon
*/
Router.post("/verify",
    verifyDiscountCouponBodyValidators,
    rejectBadRequests,
    async (req, res) => {
        try {

            const discountCoupon = await DiscountCoupon.findOne({ name: req.body.coupon.toLowerCase() });

            let data;

            if (discountCoupon && discountCoupon.active) {

                if (discountCoupon.type === 'flat') {
                    data = {
                        valid: true,
                        discount: discountCoupon.amount,
                        price: req.body.price - discountCoupon.amount,
                    }
                } else if (discountCoupon.type === 'percentage') {
                    let discount = Math.floor((req.body.price * discountCoupon.amount) / 100)
                    data = {
                        valid: true,
                        discount: discount,
                        price: req.body.price - discount,
                    }
                }
            } else {
                data = {
                    valid: false,
                }
            }
            return res.status(200).send(data);
        } catch (err) {
            console.log(err.message);
            res.status(500).send("server error");
        }
    });

/**
 * get list of discount coupon
 */
Router.get("/", auth, async (req, res) => {

    const admin = await User.findById(req.user.id);

    if (admin.userType !== "0") {
        return res
            .status(401)
            .send({ msg: "You are not authorized to make this action." });
    }
    try {
        const discountCoupons = await DiscountCoupon.find();

        return res.status(200).send(discountCoupons);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }

});

/**
 * get discount coupon by Id
 */
Router.get("/:id", auth, async (req, res) => {

    const admin = await User.findById(req.user.id);

    if (admin.userType !== "0") {
        return res
            .status(401)
            .send({ msg: "You are not authorized to make this action." });
    }
    try {
        const discountCoupon = await DiscountCoupon.findById(req.params.id);

        return res.status(200).send(discountCoupon);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }
});

/**
 * update discount coupon
 */
Router.patch("/:discountCouponId",
    auth,
    discountCouponAddEditBodyValidators,
    rejectBadRequests, async (req, res) => {
        const admin = await User.findById(req.user.id);

        if (admin.userType !== "0") {
            return res
                .status(401)
                .send({ msg: "You are not authorized to make this action." });
        }

        try {
            const discountCoupon = await DiscountCoupon.findById(req.params.discountCouponId);

            if (!discountCoupon) {
                return res.status(404).send({ msg: "no Discount coupon found with this id" });
            }

            await DiscountCoupon.findByIdAndUpdate(req.params.discountCouponId, req.body)
                .then(() => {
                    return res.status(200).send("Discount Coupon updated Successfully");
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(400).send(err);
                });
        } catch (err) {
            console.log(err.message);
            res.status(500).send("server error");
        }
    });

/**
 * delete discount coupon
 */
Router.delete("/:discountCouponId", auth, async (req, res) => {
    const admin = await User.findById(req.user.id);

    if (admin.userType !== "0") {
        return res
            .status(401)
            .send({ msg: "You are not authorized to make this action." });
    }

    try {
        const discountCoupon = await DiscountCoupon.findById(req.params.discountCouponId);

        if (!discountCoupon) {
            return res.status(404).send({ msg: "no Discount coupon found with this id" });
        }

        await DiscountCoupon.findByIdAndDelete(req.params.discountCouponId)
            .then(() => {
                return res.status(200).send("Discount Coupon deleted Successfully");
            })
            .catch((err) => {
                console.log(err);
                return res.status(400).send(err);
            });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }
});

module.exports = Router;