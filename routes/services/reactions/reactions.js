var express = require("express");
let utils = require("../../../services/utils");
let error = require("../../../config/errorMessages");

var router = express.Router();

/* Get all Reactions or a specific Reaction */
router.get("/services/:serviceName/reactions/:reactionName?", async function(req, res) {
    let params = req.params;
    let services = utils.getAboutValue("server.services");

    if (!utils.findIn(services, params.serviceName, ".name"))
        return res.status(400).send(error.SERVICE_NOT_FOUND);
    let service = services.find(service => service.name === params.serviceName);

    if (params.reactionName) {
        if (!utils.findIn(service["reactions"], params.reactionName, ".name"))
            return res.status(400).send(error.REACTION_NOT_FOUND);
        return res.send(
            service["reactions"].find(reaction => reaction.name === params.reactionName)
        );
    }
    return res.send(service["reactions"]);
});

/* Get input fields of a Reaction */
router.get("/services/:serviceName/reactions/:reactionName/inputs", async function(req, res) {
    let params = req.params;
    let services = utils.getAboutValue("server.services");

    if (!utils.findIn(services, params.serviceName, ".name"))
        return res.status(400).send(error.SERVICE_NOT_FOUND);
    let service = services.find(service => service.name === params.serviceName);

    if (!utils.findIn(service["reactions"], params.reactionName, ".name"))
        return res.status(400).send(error.REACTION_NOT_FOUND);

    return res.send(
        utils.getParam(params.serviceName, "reaction", params.reactionName)["inputFields"]
    );
});

module.exports = router;
