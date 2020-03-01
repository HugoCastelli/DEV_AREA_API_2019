let newArtistAlbum = require('./actions/newArtistAlbum');
let newArtistTopTrack = require('./actions/newArtistTopTrack');
let newTop50Track = require('./actions/newTop50Track');

module.exports = {
    action: {
        newArtistAlbum,
        newTop50Track,
        newArtistTopTrack
    },
    reaction: {}
};
