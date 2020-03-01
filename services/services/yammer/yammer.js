let newMessage = require("./actions/newMessage");
let likedPost = require("./actions/likedPost");
let postMessage = require("./reactions/postMessage");
let axios = require('axios');

const client_id = 'iuehWeP8YgCsUboIBI5EQ';
const client_secret = 'ZVBwNBqbyKDnBUiTcUJm5ReKuJgJVF8kNcSwpxTY';
const yammer_api = 'https://www.yammer.com/api/v1/';


const getMessages = async (inputDatas, serviceData) => {
    let url = yammer_api + 'messages/in_group/' + inputDatas.yammer_group + '.json';

    let config = {
        headers: {
            'Authorization': 'Bearer ' + serviceData.access_token
        }
    };

    let response = await axios.get(url, config);

    let lists = [];
    for (let each of response.data.messages) {
        lists.push({
            label: each.full_name,
            key: each.id
        });
    }
    return lists;
};


const getGroups = async (inputDatas, serviceData) => {
    let url = yammer_api + 'groups/for_user/' + serviceData.user_id + '.json';

    let config = {
        headers: {
            'Authorization': 'Bearer ' + serviceData.access_token
        }
    };

    let response = await axios.get(url, config);

    let lists = [];
    for (let each of response.data) {
        lists.push({
            label: each.full_name,
            key: each.id
        });
    }
    return lists;
};


const oauth = async (url, accessToken) => {
    url = url.replace('&', '?');
    query = url.split("?")[1];
    let token = (query.split('='))[1];

    let config = {
        params: {
            client_id: client_id,
            client_secret: client_secret,
            code: token
        }
    };

    let response = await axios
        .get("https://www.yammer.com/oauth2/access_token.json", config)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });

    const body = {
        'access_token': response.access_token['token'],
        'user_id': response.user['id'],
    };

    const apiUrl = "http://localhost:8080/users/services/yammer";
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
        newMessageInGroup: newMessage,
        likedPost: likedPost
    },
    reaction: {
        postMessageInGroup: postMessage
    },
    functions: {
        getGroups: getGroups,
        getMessages: getMessages
    },
    oauth: oauth
};
