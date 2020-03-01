let axios = require('axios');

const userWentLive = async (inputData, serviceData) => {
    let response = await axios.get('https://api.twitch.tv/helix/users', {
        params: {
            login: inputData.username
        },
        headers: {
            'Client-ID': 'ds7pbaktgkm7gxyghq4rec20ya8ij8'
        }
    });
    if (response.data.data.length === 0) return [];

    response = await axios.get('https://api.twitch.tv/helix/streams', {
        params: {
            user_id: response.data.data[0].id
        },
        headers: {
            'Client-ID': 'ds7pbaktgkm7gxyghq4rec20ya8ij8'
        }
    });
    return response.data.data.map(value => {
        return {
            user_name: value.user_name,
            title: value.title,
            started_at: value.started_at
        };
    });
};

const findDifference = (prevValues, newValues) => {
    const res = [];

    newValues.forEach((newValue, ind) => {
        if (
            !prevValues.some(
                prevValue => prevValue.started_at === newValue.started_at
            )
        )
            res.push(JSON.stringify(newValue));
    });
    return res;
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
    defaultResponse: {
        user_name: 'Ninja',
        started_at: '2010-09-08T09:18:31.000Z',
        title: "We're live on Fortnite boys !"
    },
    perform: userWentLive,
    diff: findDifference
};
