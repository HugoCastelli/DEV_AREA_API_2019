let axios = require('axios');

const viewCount = async (inputData, serviceData) => {
    let response = await axios.get(
        'https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=' +
            inputData.username +
            '&key=AIzaSyCWcxmLs9PLeEsk9wcRFQfoDG3zqdnXq10'
    );
    return response.data.items.map(value => {
        return {
            count: value.statistics.viewCount,
            username: inputData.username
        };
    });
};

const findDifference = (prevValues, newValues, inputData) => {
    if (
        newValues[0].count >= inputData.reachValue &&
        prevValues[0].count < inputData.reachValue
    ) {
        return [JSON.stringify(newValues[0])];
    }
    return [];
};

module.exports = {
    inputFields: [
        {
            key: 'username',
            label: 'Username',
            required: true,
            type: "inputText"
        },
        {
            key: 'reachValue',
            label: 'Value to be reached',
            required: true,
            type: "inputNumber"
        }
    ],
    outputFields: [
        { key: 'count', label: 'View Count' },
        { key: 'username', label: 'Username' }
    ],
    defaultResponse: {
        count: 1500000,
        username: 'ZeratorSC2'
    },
    perform: viewCount,
    diff: findDifference
};
