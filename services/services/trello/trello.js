let newcardAction = require("./actions/newCardInList");
let newListInBoard = require("./actions/newListInBoard");
let movedCard = require("./actions/movedCard");
let axios = require('axios');

let trello_key = "f4319a3120463a49dfe493eefb21db51";
let trello_api = 'https://api.trello.com/1/';

const getTrelloBoards = async (inputDatas, serviceData) => {
    let userId = serviceData.idMember;
    let url = trello_api + 'members/' + userId + '/boards';
    let config = {
        params: {
            token: serviceData.access_token,
            key: trello_key
        }
    };
    let response = await axios.get(url, config);
    let boards = [];
    for (let each of response.data) {
        boards.push({
            label: each.name,
            key: each.id
        });
    }
    return boards;
};

const getTrelloList = async (inputDatas, serviceData) => {
    let url = trello_api + 'boards/' + inputDatas.trello_board + '/lists';
    console.log(url);
    let config = {
        params: {
            token: serviceData.access_token,
            key: trello_key
        }
    };
    let response = await axios.get(url, config);

    let lists = [];
    for (let each of response.data) {
        lists.push({
            label: each.name,
            key: each.id
        });
    }
    return lists;
};

const getTrelloCardsInList = async (inputDatas, serviceData) => {
    let responseArray = [];

    let url = trello_api + 'lists/' + inputDatas.trello_list + '/cards';
    let config = {
        params: {
            token: serviceData.access_token,
            key: trello_key
        }
    };
    let response = await axios.get(url, config);
    if (response.status !== 200) {
        return [];
    }

    for (let card of response.data) {
        responseArray.push({
            key: card.id,
            label: card.name,
        });
    }

    return responseArray;
};

const oauth = async (url, accessToken) => {
    url = url.replace('#', '?');
    query = url.split("?")[2];
    let token = (query.split('='))[1];

    let urlToken = trello_api + "tokens/" + token;
    let config = {
        params: {
            token: token,
            key: trello_key
        }
    };
    let response = await axios
        .get(urlToken, config)
        .catch(error => {
            return error.response.data;
        });
    const idMember = response.data.idMember;

    const body = {
        'access_token': token,
        'idMember': idMember
    };

    const apiUrl = "http://localhost:8080/users/services/trello";
    return await axios
        .post(apiUrl, body,{
            headers: {Authorization: "Bearer " + accessToken}
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
};


module.exports = {
    action: {
        newCardInList: newcardAction,
        newListInBoard: newListInBoard,
        movedCard: movedCard
    },
    functions: {
        getBoards: getTrelloBoards,
        getLists: getTrelloList,
        getCards: getTrelloCardsInList
    },
    oauth: oauth
};
