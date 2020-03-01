let axios = require("axios");

let newFile = require("./actions/newFile");

const clientId = "izn9we8fkah0zim";
const clientSecret = "qp24btjriw9soj6";
const redirectUri = "http://localhost:8081/usr/home?from=dropbox";

const oauth = async (url, accessToken) => {
    query = url.split("?")[1];
    queryParams = query.split("&");

    code = queryParams.find(queryParam => queryParam.split("=")[0] == "code").split("=")[1];

    oauth2ApiUrl = "https://api.dropboxapi.com/oauth2/token?";
    oauth2ApiUrl += "grant_type=" + "authorization_code" + "&";
    oauth2ApiUrl += "redirect_uri=" + redirectUri + "&";
    oauth2ApiUrl += "client_id=" + clientId + "&";
    oauth2ApiUrl += "client_secret=" + clientSecret + "&";
    oauth2ApiUrl += "code=" + code;

    dropboxAccessToken = await axios.post(oauth2ApiUrl).then(response => {
        return response.data.access_token;
    });
    if (!dropboxAccessToken) return "Error dropbox's API.";

    body = {
        access_token: dropboxAccessToken
    };

    apiUrl = "http://localhost:8080/users/services/dropbox";
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
        newFile: newFile
    },
    // functions: {
    //     repositoryList: getRepositoryList
    // },
    oauth: oauth
};
