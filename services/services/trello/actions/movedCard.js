let axios = require('axios');
let trelloUtils = require('../trelloUtils');

const movedCard = async (inputData, serviceData) => {
    let responseArray = [];

    // console.log(userId);
    // console.log(inputData);
    // console.log(serviceData);
    //Board ID : 5db6b87b41f58c1b93bc565d
    //List ID : 5dc14d946c9d755acef7d7bd

    let url = trelloUtils.trelloUrl + '/cards/' + inputData.trello_card;
    let config = {
        params: {
            token: serviceData.access_token,
            key: trelloUtils.trelloAppKey,
            fields: 'all'
        }
    };
    let response = await axios.get(url, config);
    let listResponse = await axios.get(trelloUtils.trelloUrl + '/lists/' + inputData.trello_list, config);
    if (response.status !== 200 && listResponse.status !== 200) {
        return [];
    }

    responseArray.push({
        card_id: response.data.id,
        card_name: response.data.name,
        list_name: listResponse.data.name
    });

    return responseArray;
};

const findDifference = (prevValues, newValues, inputData) => {
    prevValuesStringyfied = prevValues.map(val => JSON.stringify(val));
    newValuesStringyfied = newValues.map(val => JSON.stringify(val));

    return newValuesStringyfied.filter(val => !prevValuesStringyfied.includes(val));
};

module.exports = {
    inputFields: [
        {key: "trello_board", label: "Trello Board", required: true, type: 'selectDynamic', function: "getBoards"},
        {key: "trello_list", label: "Trello List", required: true, type: 'selectDynamic', function: "getLists"},
        {key: "trello_card", label: "Trello Card", required: true, type: 'selectDynamic', function: "getCards"}
    ],
    defaultResponse: {
        card_id: "",
        card_name: "",
        list_name: ""
    },
    perform: movedCard,
    diff: findDifference
};
