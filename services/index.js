let firebase = require('../config/firebase');
let consts = require('../config/constants');
let utils = require('./utils');

let transformInputData = require('./transformInputData');

function updateResponse(userId, areaId, newValues) {
    firebase.update('users/' + userId + '/areas/' + areaId + '/action', {
        prevValues: JSON.stringify(newValues)
    });
}

function checkProcess(area) {
    let services = utils.getAboutValue('server.services');

    let actionService = utils.findIn(
        services,
        area.action.serviceName,
        '.name'
    );
    if (!actionService) {
        console.log(
            'Error: Service ' +
                area.action.serviceName +
                ' does not exist. Pass.'
        );
        return false;
    }

    let reactionService = utils.findIn(
        services,
        area.reaction.serviceName,
        '.name'
    );
    if (!reactionService) {
        console.log(
            'Error: Service ' +
                area.reaction.serviceName +
                ' does not exist. Pass.'
        );
        return false;
    }

    if (
        actionService['actions'] &&
        !utils.findIn(actionService['actions'], area.action.name, '.name')
    ) {
        console.log(
            'Error: Action ' + area.action.name + ' does not exist. Pass.'
        );
        return false;
    }
    if (
        reactionService['reactions'] &&
        !utils.findIn(reactionService['reactions'], area.reaction.name, '.name')
    ) {
        console.log(
            'Error: Reaction ' + area.reaction.name + ' does not exist. Pass.'
        );
        return false;
    }
    return true;
}

async function triggerProcess(area, services, userId, areaId) {
    let actionServiceData = services[area.action.serviceName];
    let reactionServiceData = services[area.reaction.serviceName];

    let actionParams = utils.getParam(
        area.action.serviceName,
        'action',
        area.action.name
    );
    let reactionParams = utils.getParam(
        area.reaction.serviceName,
        'reaction',
        area.reaction.name
    );

    let actionInputData = utils.getInputData(area, 'action');
    let reactionInputData = utils.getInputData(area, 'reaction');

    let newValues = await actionParams['perform'](
        actionInputData,
        actionServiceData
    );
    let prevValues = area.action.prevValues;

    if (prevValues) {
        let differences = actionParams['diff'](
            JSON.parse(prevValues),
            newValues,
            actionInputData
        );
        for (let difference of differences) {
            transformedInputData = transformInputData(
                reactionInputData,
                JSON.parse(difference)
            );
            reactionParams['perform'](
                transformedInputData,
                reactionServiceData
            );
        }
    }

    await updateResponse(userId, areaId, newValues);
}

function browseAreas(areas, services, userId) {
    if (!areas) return;
    for ([areaId, area] of Object.entries(areas)) {
        if (area.activated == true && checkProcess(area) == true) {
            triggerProcess(area, services, userId, areaId);
        }
    }
}

async function browseUsers() {
    let users = await firebase.get('users');

    if (!users) return;
    for ([userId, user] of Object.entries(users)) {
        browseAreas(user.areas, user.services, userId);
    }
}

function initProcess() {
    setInterval(() => {
        browseUsers();
    }, consts.ACTION_CHECK_TIMING * 1000);
}

const run = () => {
    initProcess();
};

exports.run = run;
