var express = require("express");
let firebase = require("../../config/firebase");
let utils = require("../../services/utils");
let error = require("../../config/errorMessages");

var router = express.Router();

/* Get all Services or a specific Service */
router.get("/services/:serviceName?", async function(req, res) {
    let params = req.params;
    let services = utils.getAboutValue("server.services");

    if (params.serviceName) {
        if (!utils.findIn(services, params.serviceName, ".name"))
            return res.status(400).send(error.SERVICE_NOT_FOUND);
        return res.send(services.find(service => service.name === params.serviceName));
    }
    return res.send(services);
});

/* Execute a function of a Service and return the result */
router.post("/services/:serviceName/functions/:functionName", async function(req, res) {
    let inputDatas = req.body;
    let serviceName = req.params.serviceName;
    let functionName = req.params.functionName;
    let services = utils.getAboutValue("server.services");
    let user = await firebase.getUserByToken(req.token);

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);
    let serviceData = await firebase.get("users/" + user.id + "/services/" + serviceName);

    if (!utils.findIn(services, serviceName, ".name"))
        return res.status(400).send(error.SERVICE_NOT_FOUND);

    let servicesFunctions = utils.getServiceFunctions(serviceName);
    let response = await servicesFunctions[functionName](inputDatas, serviceData);
    if (!response) return res.status(400).send(error.DEFAULT_RESPONSE_NOT_FOUND);

    return res.send(response);
});

/* Execute the oauth connection to a service */
router.post("/services/:serviceName/oauth", async function(req, res) {
    console.log("test #1");

    let accessToken = req.token;
    let redirectUrl = req.body.url;
    let serviceName = req.params.serviceName;
    let services = utils.getAboutValue("server.services");
    let user = await firebase.getUserByToken(req.token);

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);

    service = utils.findIn(services, serviceName, ".name");
    if (!service || service.oauth2 == false) return res.status(400).send(error.SERVICE_NOT_FOUND);

    response = await utils.getServiceOauthFunction(serviceName)(redirectUrl, accessToken);
    return res.status(200).send(response);
});

module.exports = router;
