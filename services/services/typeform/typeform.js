let new_entries = require("./actions/newEntries");
let axios = require("axios");
var qs = require("qs");

const clientId = "DdGUbtv17aGTrtnFegPC8X3b9pg21iicAjc1MtihRaiC";
const clientSecret = "8YZsM76uJ1jwBuADev3J59iJHL11LmEKG3VLNMPvdwMU";
const redirectUri = "http://localhost:8081/usr/home?from=typeform";

const oauth = async (url, accessToken) => {
    query = url.split("?")[1];
    queryParams = query.split("&");

    code = queryParams.find(queryParam => queryParam.split("=")[0] == "code").split("=")[1];

    config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    typeformBody = {
        grant_type: "authorization_code",
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
    };

    oauth2ApiUrl = "https://api.typeform.com/oauth/token";
    typeformAccessToken = await axios
        .post(oauth2ApiUrl, qs.stringify(typeformBody), config)
        .then(response => {
            return response.data.access_token;
        })
        .catch(_ => {
            return null;
        });
    if (!typeformAccessToken) return "Error typeform's API.";

    body = {
        access_token: typeformAccessToken
    };

    apiUrl = "http://localhost:8080/users/services/typeform";
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
        new_entries: new_entries
    },
    oauth: oauth
};
