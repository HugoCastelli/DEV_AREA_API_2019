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

    let url = trelloUtils.trelloUrl + 'boards/' + inputData.trello_board + '/lists';
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

    for (let list of response.data) {
        responseArray.push({
            list_id: list.id,
            list_name: list.name,
            board_id: list.idBoard,
        });
    }

    return responseArray;
};

const findDifference = (prevValues, newValues, inputData) => {
    let res = [];
    let differences = newValues.filter(item1 => !prevValues.some(item2 => (item2.id === item1.id && item2.name === item1.name)));

    for (let diff of differences) {
        res.push(JSON.stringify(diff));
    }
    return res;
};

module.exports = {
    inputFields: [
        {key: "trello_board", label: "Trello Board", required: true, type: 'selectDynamic', function: "getBoards"}
    ],
    defaultResponse: {
        list_id: "",
        list_name: "",
        board_id: "",
    },
    perform: newCardInList,
    diff: findDifference
};
