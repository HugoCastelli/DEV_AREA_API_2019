let axios = require('axios');
let yammerUtils = require('../yammerUtils');

const likedPost = async (inputData, serviceData) => {
    let userId = serviceData.user_id;
    const url = yammerUtils.yammerApiUrl + 'messages/in_group/' + inputData.yammer_group + '.json';
    let responseArray = [];
    
    // console.log(serviceData);
    //Board ID : 5db6b87b41f58c1b93bc565d
    //List ID : 5dc14d946c9d755acef7d7bd

    let config = {
        headers: {
            'Authorization': 'Bearer ' + serviceData.access_token
        }
    };
    let response = await axios.get(url, config);
    if (response.status !== 200) {
        return [];
    }

    for (let message of response.data.messages) {
        responseArray.push({
            message_id: message.id,
            message: message.body.plain,
            url: message.web_url,
            created_at: message.created_at
        });
    }

    return responseArray;
};

const findDifference = (prevValues, newValues, inputData) => {
    prevValuesStringyfied = prevValues.map(val => JSON.stringify(val));
    newValuesStringyfied = newValues.map(val => JSON.stringify(val));

    return newValuesStringyfied.filter(val => !prevValuesStringyfied.includes(val));
};

module.exports = {
    inputFields: [
        {key: "yammer_group", label: "Yammer Group", required: true, type: 'selectDynamic', function: "getGroups"},
        {key: "yammer_message", label: "Yammer Message", required: true, type: 'selectDynamic', function: "getMessages"}
    ],
    defaultResponse: {
        message_id: "",
        message: "",
        url: "",
        created_at: ""
    },
    perform: likedPost,
    diff: findDifference
};
