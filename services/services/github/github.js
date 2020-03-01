let axios = require("axios");

let newRepository = require("./actions/newRepository");

let starRepository = require("./reactions/starRepository");
let unstarRepository = require("./reactions/unstarRepository");

const clientId = "604b48ec3267e7b3ab2e";
const clientSecret = "40ecd9616b8a5f7254864ac430d37d8c33b9e0ce";

const getRepositoryList = async (inputData, serviceData) => {
    url = "https://api.github.com/users/" + inputData.user + "/repos";
    config = {
        headers: {
            Authorization: "Bearer " + serviceData.access_token
        }
    };
    repositories = (await axios.get(url, config)).data;
    return repositories.map(repository => {
        return {
            key: repository.name,
            label: repository.name
        };
    });
};

const oauth = async (url, accessToken) => {
    query = url.split("?")[1];
    queryParams = query.split("&");

    code = queryParams.find(queryParam => queryParam.split("=")[0] == "code").split("=")[1];

    oauth2ApiUrl = "https://github.com/login/oauth/access_token?";
    oauth2ApiUrl += "client_id=" + clientId + "&";
    oauth2ApiUrl += "client_secret=" + clientSecret + "&";
    oauth2ApiUrl += "code=" + code;

    githubAccessToken = await axios.post(oauth2ApiUrl).then(response => {
        if (response.data.split("&").find(queryParam => queryParam.split("=")[0] == "error")) {
            return null;
        }
        return response.data
            .split("&")
            .find(queryParam => queryParam.split("=")[0] == "access_token")
            .split("=")[1];
    });
    if (!githubAccessToken) return "Error github's API.";

    body = {
        access_token: githubAccessToken
    };

    apiUrl = "http://localhost:8080/users/services/github";
    return await axios
        .post(apiUrl, body, {
            headers: { Authorization: "Bearer " + accessToken }
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
        newRepository: newRepository
    },
    reaction: {
        starRepository: starRepository,
        unstarRepository: unstarRepository
    },
    functions: {
        repositoryList: getRepositoryList
    },
    oauth: oauth
};
