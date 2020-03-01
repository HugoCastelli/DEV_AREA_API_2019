var express = require("express");
let firebase = require("../../../config/firebase");
let utils = require("../../../services/utils");
let error = require("../../../config/errorMessages");

var router = express.Router();

/* Get all Services of a User or a specific one */
router.get("/users/services/:serviceName?", async function(req, res) {
    let params = req.params;
    let services = utils.getAboutValue("server.services");
    let user = await firebase.getUserByToken(req.token);

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);

    if (params.serviceName) {
        if (!utils.findIn(services, params.serviceName, ".name"))
            return res.status(400).send(error.SERVICE_NOT_FOUND);

        if (!user["services"] || !user["services"][params.serviceName])
            return res.status(400).send(error.SERVICE_NOT_ACTIVATED);
        return res.send(user["services"][params.serviceName]);
    }
    return res.json(user["services"] || {});
});

/* Add a new Service to a User */
router.post("/users/services/:serviceName", async function(req, res) {
    let params = req.params;
    let body = req.body;
    let services = utils.getAboutValue("server.services");
    let user = await firebase.getUserByToken(req.token);

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);

    if (!utils.findIn(services, params.serviceName, ".name"))
        return res.status(400).send(error.SERVICE_NOT_FOUND);
    if (user["services"] && utils.findIn(Object.keys(user["services"]), params.serviceName))
        return res.status(400).send(error.SERVICE_ACTIVATED);

    firebase.pushId("users/" + user.id + "/services/", params.serviceName, body);
    return res.send(await firebase.get("users/" + user.id + "/services"));
});

/* Update a Service of a User */
router.put("/users/services/:serviceName", async function(req, res) {
    let params = req.params;
    let body = req.body;
    let services = utils.getAboutValue("server.services");
    let user = await firebase.getUserByToken(req.token);

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);

    if (!utils.findIn(services, params.serviceName, ".name"))
        return res.status(400).send(error.SERVICE_NOT_FOUND);
    if (!user["services"] || !utils.findIn(Object.keys(user["services"]), params.serviceName))
        return res.status(400).send(error.SERVICE_NOT_ACTIVATED);

    let serviceRef = "users/" + user.id + "/services/" + params.serviceName;
    firebase.update(serviceRef, body);
    return res.send(await firebase.get(serviceRef));
});

/* Delete a Service of a User */
router.delete("/users/services/:serviceName", async function(req, res) {
    let params = req.params;
    let services = utils.getAboutValue("server.services");
    let user = await firebase.getUserByToken(req.token);

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);

    if (!utils.findIn(services, params.serviceName, ".name"))
        return res.status(400).send(error.SERVICE_NOT_FOUND);
    if (!user["services"] || !utils.findIn(Object.keys(user["services"]), params.serviceName))
        return res.status(400).send(error.SERVICE_NOT_ACTIVATED);

    if (user["areas"]) {
        Object.entries(user["areas"]).forEach(([areaId, area]) => {
            if (
                area.action.serviceName == params.serviceName ||
                area.reaction.serviceName == params.serviceName
            ) {
                firebase.update("users/" + user.id + "/areas/" + areaId, {
                    activated: false
                });
            }
        });
    }

    let servicesRef = "users/" + user.id + "/services/";
    firebase.remove(servicesRef + params.serviceName);

    return res.send((await firebase.get(servicesRef)) || {});
});

module.exports = router;
