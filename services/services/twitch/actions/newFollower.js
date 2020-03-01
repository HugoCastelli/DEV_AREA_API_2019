let axios = require('axios');

const newFollower = async (inputData, serviceData) => {
    let response = await axios.get('https://api.twitch.tv/helix/users', {
        params: {
            login: inputData.username
        },
        headers: {
            'Client-ID': 'ds7pbaktgkm7gxyghq4rec20ya8ij8'
        }
    });

    response = await axios.get('https://api.twitch.tv/helix/users/follows', {
        params: {
            to_id: response.data.data[0].id
        },
        headers: {
            'Client-ID': 'ds7pbaktgkm7gxyghq4rec20ya8ij8'
        }
    });
    return response.data.data.map(value => {
        return {
            from_name: value.from_name,
            followed_at: value.followed_at
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
            key: 'username',
            label: 'Username',
            required: true,
            type: "inputText"
        }
    ],
    defaultResponse: {
        from_name: 'Ninja',
        followed_at: '2010-09-08T09:18:31.000Z'
    },
    perform: newFollower,
    diff: findDifference
};
