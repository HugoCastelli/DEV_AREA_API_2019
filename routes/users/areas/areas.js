var express = require("express");
let firebase = require("../../../config/firebase");
let utils = require("../../../services/utils");
let error = require("../../../config/errorMessages");

var router = express.Router();

/* Get all Areas of a User or a specific one */
router.get("/users/areas/:areaName?", async function(req, res) {
    let params = req.params;
    let user = await firebase.getUserByToken(req.token);

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);

    if (params.areaName) {
        if (
            !user["areas"] ||
            !(area = utils.findIn(Object.values(user["areas"]), params.areaName, ".name"))
        )
            return res.status(400).send(error.AREA_NOT_FOUND);
        return res.send(area);
    }
    return res.send(user["areas"] || {});
});

/* Add a new Area to a User */
router.post("/users/areas", async function(req, res) {
    let body = req.body;
    let services = utils.getAboutValue("server.services");
    let user = await firebase.getUserByToken(req.token);

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);

    if (user["areas"] && utils.findIn(Object.values(user["areas"]), body.name, ".name"))
        return res.status(400).send(error.AREA_ALREADY_EXIST);

    let actionService = utils.findIn(services, body.action.serviceName, ".name");
    if (!actionService) return res.status(400).send(error.ACTION_SERVICE_NOT_FOUND);
    let reactionService = utils.findIn(services, body.reaction.serviceName, ".name");
    if (!reactionService) return res.status(400).send(error.REACTION_SERVICE_NOT_FOUND);

    if (!user["services"] || !utils.findIn(Object.keys(user["services"]), body.action.serviceName))
        return res.status(400).send(error.ACTION_SERVICE_NOT_ACTIVATED);
    if (
        !user["services"] ||
        !utils.findIn(Object.keys(user["services"]), body.reaction.serviceName)
    )
        return res.status(400).send(error.REACTION_SERVICE_NOT_ACTIVATED);

    if (
        actionService["actions"] &&
        !utils.findIn(actionService["actions"], body.action.name, ".name")
    )
        return res.status(400).send(error.ACTION_NOT_FOUND);
    let actionInputFields = utils.getParam(body.action.serviceName, "action", body.action.name)[
        "inputFields"
    ];
    if (
        reactionService["reactions"] &&
        !utils.findIn(reactionService["reactions"], body.reaction.name, ".name")
    )
        return res.status(400).send(error.REACTION_NOT_FOUND);
    let reacInputFields = utils.getParam(body.reaction.serviceName, "reaction", body.reaction.name)[
        "inputFields"
    ];

    for (inputData in body.action.inputData)
        if (!utils.findIn(actionInputFields, inputData, ".key"))
            return res.status(400).send(error.ACTION_FIELD_NOT_FOUND);
    for (inputData in body.reaction.inputData)
        if (!utils.findIn(reacInputFields, inputData, ".key"))
            return res.status(400).send(error.REACTION_FIELD_NOT_FOUND);

    for (inputField of actionInputFields) {
        if (
            !utils.findIn(Object.keys(body.action.inputData), inputField.key) &&
            inputField.required
        )
            return res.status(400).send(error.ACTION_FIELD_MISSING);
    }
    for (inputField of reacInputFields) {
        if (
            !utils.findIn(Object.keys(body.reaction.inputData), inputField.key) &&
            inputField.required
        )
            return res.status(400).send(error.REACTION_FIELD_MISSING);
    }

    if (!body.action.inputData || Object.keys(body.action.inputData).length == 0)
        body.action.inputData = "";
    firebase.push("users/" + user.id + "/areas/", body);
    return res.send(body);
});

/* Switch Area state */
router.post("/users/areas/:areaName/switch", async function(req, res) {
    let params = req.params;
    let user = await firebase.getUserByToken(req.token);

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);

    if (!user["areas"]) return res.status(400).send(error.AREA_NOT_FOUND);

    let areas = Object.entries(user["areas"]);
    let [areaId, area] = utils.findIn(areas, params.areaName, "[1].name") || [null, null];

    if (!area) return res.status(400).send(error.AREA_NOT_FOUND);

    if (!user["services"]) return res.status(400).send(error.SERVICE_NOT_ACTIVATED);

    let services = Object.entries(user["services"]);
    if (!utils.findIn(services, area.action.serviceName, "[0]"))
        return res.status(400).send(error.ACTION_SERVICE_NOT_ACTIVATED);
    if (!utils.findIn(services, area.reaction.serviceName, "[0]"))
        return res.status(400).send(error.REACTION_SERVICE_NOT_ACTIVATED);

    let areaRef = "users/" + user.id + "/areas/" + areaId;
    await firebase.update(areaRef, { activated: !area.activated });

    return res.send(await firebase.get(areaRef));
});

/* Delete an Area of a User */
router.delete("/users/areas/:areaName", async function(req, res) {
    let params = req.params;
    let user = await firebase.getUserByToken(req.token);

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);

    if (!user["areas"]) return res.status(400).send(error.AREA_NOT_FOUND);

    let areas = Object.entries(user["areas"]);
    let [areaId, area] = utils.findIn(areas, params.areaName, "[1].name") || [null, null];

    if (!area) return res.status(400).send(error.AREA_NOT_FOUND);

    let areasRef = "users/" + user.id + "/areas/";
    await firebase.remove(areasRef + areaId);

    return res.send((await firebase.get(areasRef)) || {});
});

module.exports = router;
