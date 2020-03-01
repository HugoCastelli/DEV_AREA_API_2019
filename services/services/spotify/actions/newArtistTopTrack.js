let axios = require('axios');
let SpotifyWebApi = require('spotify-web-api-node');
let spotifyApi = new SpotifyWebApi({
    clientId: 'ffb09e12d44f4f6db31f138ae4ae53f0',
    clientSecret: 'fc5058120acc4b6798875b690ddb6fd5'
}); // TODO - enlever les credentials

const newArtistTopTrack = async (inputData, serviceData) => {
    const token = (await spotifyApi.clientCredentialsGrant()).body.access_token; // serviceData.access_token

    spotifyApi.setAccessToken(token);
    const artists = await spotifyApi.searchArtists(inputData.name);
    const id = artists.body.artists.items[0].id;

    const topTrack = (await spotifyApi.getArtistTopTracks(id, 'FR')).body
        .tracks[0];

    return [
        {
            name: topTrack.name,
            release_date: topTrack.album.release_date,
            id: topTrack.id,
            popularity: topTrack.popularity
        }
    ];
};

const findDifference = (prevValues, newValues) => {
    if (prevValues[0].id !== newValues[0].id)
        return [JSON.stringify(newValues[0])];
    return [];
};

module.exports = {
    inputFields: [
        {
            key: 'name',
            label: 'Artist Name',
            required: true,
            type: "inputText"
        }
    ],
    outputFields: [
        { key: 'name', label: 'Track Name' },
        { key: 'release_date', label: 'Release Date' },
        { key: 'popularity', label: 'Track Popularity' },
        { key: 'id', label: 'Track ID' }
    ],
    defaultResponse: {
        name: 'Boss Bitch',
        release_date: '2010-09-08T09:18:31.000Z',
        popularity: 89,
        id: 'UCZ_oIYI9ZNpOfWbpZxWNuRQ'
    },
    perform: newArtistTopTrack,
    diff: findDifference
};
