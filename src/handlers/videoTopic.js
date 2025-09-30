const Router = require("express").Router();
const auth = require("../middleware/auth");
const { body } = require("express-validator");
const VideoTopic = require("../models/VideoTopic");
const User = require("../models/User");

/**
 * create a video topic
 */
Router.post("/", auth, async (req, res) => {
    const admin = await User.findById(req.user.id);
    if (admin.userType !== "0") {
        return res
            .status(401)
            .send({ msg: "You are not authorized to make this action." });
    }
    try {

        const data = {
            title: req.body.title,
            key: req.body.title.toUpperCase().replace(/ /g, "_"),
        }

        const videoTopic = new VideoTopic(data);
        await videoTopic.save().catch((err) => {
            console.log(err);
            return res
                .status(400)
                .send("some error occured while saving video topic, Please contact admin");
        });
        return res.status(200).send("Video topic created Successfully");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }
});

/**
 * get list of topics
 */
Router.get("/", auth, async (req, res) => {

    const admin = await User.findById(req.user.id);

    if (admin.userType !== "0") {
        return res
            .status(401)
            .send({ msg: "You are not authorized to make this action." });
    }
    try {
        const videoTopics = await VideoTopic.find();

        return res.status(200).send(videoTopics);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }

});


/**
 * video Topic Delete APi
 */
Router.delete("/:videoTopicId", auth, async (req, res) => {
    const admin = await User.findById(req.user.id);

    if (admin.userType !== "0") {
        return res
            .status(401)
            .send({ msg: "You are not authorized to make this action." });
    }

    try {
        const videoTopicVar = await VideoTopic.findById(req.params.videoTopicId);

        if (!videoTopicVar) {
            return res.status(404).send({ msg: "no Video Topic found with this id" });
        }

        await VideoTopic.findByIdAndDelete(req.params.videoTopicId)
            .then(() => {
                return res.status(200).send("Video Topic deleted Successfully");
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