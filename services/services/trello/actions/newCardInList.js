let axios = require('axios');
let trelloUtils = require('../trelloUtils');

const newCardInList = async (inputData, serviceData) => {
    let userId = serviceData.idMember;
    let responseArray = [];

    // console.log(userId);
    // console.log(inputData);
    // console.log(serviceData);
    //Board ID : 5db6b87b41f58c1b93bc565d
    //List ID : 5dc14d946c9d755acef7d7bd

    let url = trelloUtils.trelloUrl + '/lists/' + inputData.trello_list + '/cards';
    let config = {
        params: {
            token: serviceData.access_token,
            key: trelloUtils.trelloAppKey
        }
    };
    let response = await axios.get(url, config);
    if (response.status !== 200) {
        return [];
    }

    for (let card of response.data) {
        responseArray.push({
            card_id: card.id,
            card_name: card.name,
            board_id: card.idBoard,
            list_id: card.idList
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
        {key: "trello_board", label: "Trello Board", required: true, type: 'selectDynamic', function: "getBoards"},
        {key: "trello_list", label: "Trello List", required: true, type: 'selectDynamic', function: "getLists"}
    ],
    defaultResponse: {
        card_id: "",
        card_name: "",
        board_id: "",
        list_id: ""
    },
    perform: newCardInList,
    diff: findDifference
};
