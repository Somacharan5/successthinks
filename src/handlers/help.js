const Router = require("express").Router();

const helpNumnbers = ['https://wa.link/bucok2', 'https://wa.link/cm2zin'];

let count = 0;

/**
 * get whatsapp link for help
 */
Router.get("/", async (req, res) => {

    let helpNumber = helpNumnbers[0];

    if (count % 2 === 1) {
        helpNumber = helpNumnbers[1];
    }

    count++;

    res.status(200).send(helpNumber)
    return 

});

module.exports = Router;