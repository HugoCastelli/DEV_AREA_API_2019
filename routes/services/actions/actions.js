var express = require('express');
let firebase = require('../../../config/firebase');
let utils = require('../../../services/utils');
let error = require('../../../config/errorMessages');

var router = express.Router();

/* Get all Actions or a specific Action */
router.get('/services/:serviceName/actions/:actionName?', async function(
    req,
    res
) {
    let params = req.params;
    let services = utils.getAboutValue('server.services');

    if (!utils.findIn(services, params.serviceName, '.name'))
        return res.status(400).send(error.SERVICE_NOT_FOUND);
    let service = services.find(service => service.name === params.serviceName);

    if (params.actionName) {
        if (!utils.findIn(service['actions'], params.actionName, '.name'))
            return res.status(400).send(error.ACTION_NOT_FOUND);
        return res.send(
            service['actions'].find(action => action.name === params.actionName)
        );
    }
    return res.send(service['actions']);
});

/* Get input fields of an Action */
router.get('/services/:serviceName/actions/:actionName/inputs', async function(
    req,
    res
) {
    let params = req.params;
    let services = utils.getAboutValue('server.services');

    if (!utils.findIn(services, params.serviceName, '.name'))
        return res.status(400).send(error.SERVICE_NOT_FOUND);
    let service = services.find(service => service.name === params.serviceName);

    if (!utils.findIn(service['actions'], params.actionName, '.name'))
        return res.status(400).send(error.ACTION_NOT_FOUND);

    return res.send(
        utils.getParam(params.serviceName, 'action', params.actionName)[
            'inputFields'
        ]
    );
});

/* Simulate output fields of an Action */
router.post(
    '/services/:serviceName/actions/:actionName/outputs',
    async function(req, res) {
        let params = req.params;
        let body = req.body;
        let services = utils.getAboutValue('server.services');
        let user = await firebase.getUserByToken(req.token);

        if (!user) return res.status(400).send(error.USER_NOT_FOUND);
        let serviceData = await firebase.get(
            'users/' + user.id + '/services/' + params.serviceName
        );

        if (!utils.findIn(services, params.serviceName, '.name'))
            return res.status(400).send(error.SERVICE_NOT_FOUND);
        let service = services.find(
            service => service.name === params.serviceName
        );

        if (!utils.findIn(service['actions'], params.actionName, '.name'))
            return res.status(400).send(error.ACTION_NOT_FOUND);

        let actionParams = utils.getParam(
            params.serviceName,
            'action',
            params.actionName
        );
        console.log('after get param before perform');
        let newValues = await actionParams['perform'](body, serviceData);

        if (newValues.length == 0) {
            if (actionParams['defaultResponse'])
                return res.send(actionParams['defaultResponse']);
            else return res.status(400).send(error.DEFAULT_RESPONSE_NOT_FOUND);
        } else {
            let randomIndex = Math.floor(Math.random() * newValues.length);
            return res.send(newValues[randomIndex]);
        }
    }
);

module.exports = router;
