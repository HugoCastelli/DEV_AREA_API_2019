let axios = require('axios');

const newGameStream = async (inputData, serviceData) => {
    let response = await axios.get('https://api.twitch.tv/helix/games', {
        params: {
            name: inputData.game
        },
        headers: {
            'Client-ID': 'ds7pbaktgkm7gxyghq4rec20ya8ij8'
        }
    });
    const gameName = response.data.data[0].name;

    response = await axios.get('https://api.twitch.tv/helix/streams', {
        params: {
            first: 10,
            game_id: response.data.data[0].id
        },
        headers: {
            'Client-ID': 'ds7pbaktgkm7gxyghq4rec20ya8ij8'
        }
    });
    return response.data.data.map(value => {
        return {
            username: value.user_name,
            title: value.title,
            startedAt: value.started_at,
            gameName: gameName
        };
    });
};

const findDifference = (prevValues, newValues) => {
    const res = [];

    newValues.forEach((newValue, ind) => {
        if (
            !prevValues.some(
                prevValue => prevValue.startedAt === newValue.startedAt
            )
        )
            res.push(JSON.stringify(newValue));
    });
    return res;
};

module.exports = {
    inputFields: [
        { key: 'game', label: 'Game', required: true, type: 'inputText' }
    ],
    defaultResponse: {
        username: 'Ninja',
        startedAt: '2010-09-08T09:18:31.000Z',
        title: "We're live on Fortnite boys !",
        gameName: 'Fortnite'
    },
    perform: newGameStream,
    diff: findDifference
};
