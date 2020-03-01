let axios = require('axios');

const newMostPopularVideo = async (inputData, serviceData) => {
    let response = await axios.get(
        'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=1&regionCode=' +
            inputData.regionCode +
            '&key=AIzaSyCWcxmLs9PLeEsk9wcRFQfoDG3zqdnXq10'
    );
    return response.data.items.map(value => {
        return {
            id: value.id,
            title: value.snippet.title,
            description: value.snippet.description,
            publishedAt: value.snippet.publishedAt
        };
    });
};

const findDifference = (prevValues, newValues) => {
    prevValuesStringyfied = prevValues.map(val => JSON.stringify(val));
    newValuesStringyfied = newValues.map(val => JSON.stringify(val));

    return newValuesStringyfied.filter(
        val => !prevValuesStringyfied.includes(val)
    );
};

module.exports = {
    inputFields: [
        {
            key: 'regionCode',
            label: 'Region Code',
            required: true,
            type: "inputText"
        }
    ],
    outputFields: [
        { key: 'id', label: 'ID' },
        { key: 'description', label: 'Description' },
        { key: 'publishedAt', label: 'Publication Date' },
        { key: 'title', label: 'Title' }
    ],
    defaultResponse: {
        title: 'ON MANGE BLEU PENDANT 24H ! OMG FLECHE ROUGE',
        description: 'Default description, abonne toi, poce blo',
        publishedAt: '2010-09-08T09:18:31.000Z',
        id: 'UCZ_oIYI9ZNpOfWbpZxWNuRQ'
    },
    perform: newMostPopularVideo,
    diff: findDifference
};
