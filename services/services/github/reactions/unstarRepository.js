const axios = require("axios");

const unstarRepository = async (inputData, serviceData) => {
    url = "https://api.github.com/user/starred";
    url += "/" + inputData.user;
    url += "/" + inputData.repository;
    config = {
        headers: {
            Authorization: "Bearer " + serviceData.access_token
        }
    };
    axios.delete(url, config);
};

module.exports = {
    inputFields: [
        {
            key: "user",
            label: "User",
            required: true,
            type: "inputText"
        },
        {
            key: "repository",
            label: "Repository",
            required: true,
            type: "selectDynamic",
            function: "repositoryList"
        }
    ],
    perform: unstarRepository
};
