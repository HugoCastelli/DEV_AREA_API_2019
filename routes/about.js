let express = require("express");
let router = express.Router();

let Moment = require("moment");
let about = require("../config/about.json");

/* GET about page. */
router.get("/about.json", function(req, res, next) {
    about.client.host = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    about.server.current_time = Moment().unix();
    return res.send(about);
});

module.exports = router;
