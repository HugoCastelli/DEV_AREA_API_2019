const axios = require("axios");

const starRepository = async (inputData, serviceData) => {
    url = "https://api.github.com/user/starred";
    url += "/" + inputData.user;
    url += "/" + inputData.repository;
    // console.log(serviceData.access_token);
    config = {
        headers: {
            Authorization: "Bearer " + serviceData.access_token
        }
    };
    axios.put(url, null, config).catch(error => {
        console.log(error);
    });
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
    perform: starRepository
};
