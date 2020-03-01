let axios = require('axios');
let SpotifyWebApi = require('spotify-web-api-node');
let spotifyApi = new SpotifyWebApi({
    clientId: 'ffb09e12d44f4f6db31f138ae4ae53f0',
    clientSecret: 'fc5058120acc4b6798875b690ddb6fd5'
}); // TODO - enlever les credentials

const newArtistAlbum = async (inputData, serviceData) => {
    const token = (await spotifyApi.clientCredentialsGrant()).body.access_token; // serviceData.access_token

    spotifyApi.setAccessToken(token);
    const artists = await spotifyApi.searchArtists(inputData.name);
    const id = artists.body.artists.items[0].id;

    const albums = (await spotifyApi.getArtistAlbums(id)).body.items;

    return albums.map(value => {
        return {
            name: value.name,
            release_date: value.release_date,
            type: value.album_type,
            id: value.id
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
            key: 'name',
            label: 'Artist Name',
            required: true,
            type: "inputText"
        }
    ],
    outputFields: [
        { key: 'name', label: 'Album Name' },
        { key: 'release_date', label: 'Release Date' },
        { key: 'type', label: 'Album Type' },
        { key: 'id', label: 'Album ID' }
    ],
    defaultResponse: {
        name: 'Hot Pink',
        release_date: '2010-09-08T09:18:31.000Z',
        type: 'album',
        id: 'UCZ_oIYI9ZNpOfWbpZxWNuRQ'
    },
    perform: newArtistAlbum,
    diff: findDifference
};
