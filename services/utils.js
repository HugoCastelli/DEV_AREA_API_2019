let aboutJson = require("../config/about.json");
let servicesFunc = require("./services/services");

function getParam(serviceName, processType, processName) {
    return servicesFunc[serviceName][processType][processName];
}

function getServiceFunctions(serviceName) {
    return servicesFunc[serviceName]["functions"];
}

function getServiceOauthFunction(serviceName) {
    return servicesFunc[serviceName]["oauth"];
}

function getInputData(area, processType) {
    return area[processType]["inputData"];
}

const findIn = (arrayValue, valueToCheck, arrayValueToCheck = "") => {
    return arrayValue.find(value => eval(`value${arrayValueToCheck}`) === valueToCheck);
};

const getAboutValue = pathToValue => {
    return eval(`aboutJson.${pathToValue}`);
};

module.exports = {
    getParam: getParam,
    getInputData: getInputData,
    findIn: findIn,
    getAboutValue: getAboutValue,
    getServiceFunctions: getServiceFunctions,
    getServiceOauthFunction: getServiceOauthFunction
};
