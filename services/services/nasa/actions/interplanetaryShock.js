let axios = require("axios");
let utils = require("../nasaUtils");

const interplanetaryShock = async (inputData, serviceData) => {
    apiUrl = "https://api.nasa.gov/DONKI/IPS?api_key=" + utils.apiKey;

    if (inputData.startDate) apiUrl += "&startDate=" + inputData.startDate;
    if (inputData.endDate) apiUrl += "&endDate=" + inputData.endDate;
    if (inputData.location) apiUrl += "&location=" + inputData.location;
    if (inputData.catalog) apiUrl += "&catalog=" + inputData.catalog;

    let data = (await axios.get(apiUrl)).data;
    if (!data) return [];

    test = data.map(shock => {
        newShock = {};
        utils.flattenObject("", shock, newShock);
        return newShock;
    });
    return test;
};

const findDifference = (prevValues, newValues) => {
    prevValuesStringyfied = prevValues.map(val => JSON.stringify(val));
    newValuesStringyfied = newValues.map(val => JSON.stringify(val));

    return newValuesStringyfied.filter(val => !prevValuesStringyfied.includes(val));
};

module.exports = {
    inputFields: [
        { key: "startDate", label: "Start Date (YYYY-MM-DD)", required: false, type: "inputText" },
        { key: "endDate", label: "End Date (YYYY-MM-DD)", required: false, type: "inputText" },
        {
            key: "location",
            label: "Location of the shock",
            required: false,
            type: "select",
            values: ["Earth", "MESSENGER", "STEREO A", "STEREO B"]
        },
        {
            key: "catalog",
            label: "Catalog",
            required: false,
            type: "select",
            values: ["SWRC_CATALOG", "WINSLOW_MESSENGER_ICME_CATALOG"]
        }
    ],
    defaultResponse: {
        catalog: "SWRC_CATALOG",
        activityID: "2019-01-11T15:00:00-IPS-001",
        location: "STEREO A",
        eventTime: "2019-01-11T15:00Z",
        instruments_0_id: 20,
        instruments_0_displayName: "STEREO A: IMPACT",
        instruments_1_id: 21,
        instruments_1_displayName: "STEREO A: PLASTIC"
    },
    perform: interplanetaryShock,
    diff: findDifference
};