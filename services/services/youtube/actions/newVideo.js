let axios = require('axios');

const newVideo = async (inputData, serviceData) => {
    let response = await axios.get(
        'https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=' +
            inputData.username +
            '&key=AIzaSyCWcxmLs9PLeEsk9wcRFQfoDG3zqdnXq10'
    );
    return response.data.items.map(value => {
        return {
            count: value.statistics.videoCount,
            username: inputData.username
        };
    });
};

const findDifference = (prevValues, newValues, inputData) => {
    if (newValues[0].count > prevValues[0].count)
        return [JSON.stringify(newValues[0])];
    return [];
};

module.exports = {
    inputFields: [
        {
            key: 'username',
            label: 'Username',
            required: true,
            type: "inputText"
        }
    ],
    outputFields: [
        { key: 'count', label: 'Videos Count' },
        { key: 'username', label: 'Username' }
    ],
    defaultResponse: {
        count: 123,
        username: 'ZeratorSC2'
    },
    perform: newVideo,
    diff: findDifference
};
