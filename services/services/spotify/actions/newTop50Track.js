let axios = require('axios');
let SpotifyWebApi = require('spotify-web-api-node');
let spotifyApi = new SpotifyWebApi({
    clientId: 'ffb09e12d44f4f6db31f138ae4ae53f0',
    clientSecret: 'fc5058120acc4b6798875b690ddb6fd5'
}); // TODO - enlever les credentials

const newTop50Track = async (inputData, serviceData) => {
    const token = (await spotifyApi.clientCredentialsGrant()).body.access_token; // serviceData.access_token

    spotifyApi.setAccessToken(token);
    const tracks = (
        await spotifyApi.getPlaylistTracks('37i9dQZEVXbMDoHDwVN2tF')
    ).body.items;

    return tracks.map(elem => {
        return {
            name: elem.track.name,
            id: elem.track.id,
            artist: elem.track.album.artists[0].name
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
    inputFields: [],
    outputFields: [
        { key: 'name', label: 'Track Name' },
        { key: 'artist', label: 'Artist' },
        { key: 'id', label: 'Track ID' }
    ],
    defaultResponse: {
        name: 'Boss Bitch',
        artist: 'Doja Cat',
        id: 'UCZ_oIYI9ZNpOfWbpZxWNuRQ'
    },
    perform: newTop50Track,
    diff: findDifference
};
