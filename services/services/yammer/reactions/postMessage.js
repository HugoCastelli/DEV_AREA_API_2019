const axios = require("axios");
let yammerUtils = require('../yammerUtils');

const postMessage = async (inputData, serviceData) => {
    let userId = serviceData.user_id;
    const url = yammerUtils.yammerApiUrl + 'messages.json';

    let config = {
        headers: {
            'Authorization': 'Bearer ' + serviceData.access_token
        }
    };
    const body=  {
        body: inputData.message,
        group_id: inputData.yammer_group
    };
    let response = await axios.post(url, body, config);
    console.log(response.data);
};

module.exports = {
    inputFields: [
        { key: "yammer_group", label: "Yammer Group", required: true, type: 'selectDynamic', function: "getGroups" },
        { key: "message", label: "Message", required: true, type: "inputText" }
    ],
    perform: postMessage
};
