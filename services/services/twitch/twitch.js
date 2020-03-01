let newFollower = require('./actions/newFollower');
let userWentLive = require('./actions/userWentLive');
let newGameStream = require('./actions/newGameStream');

module.exports = {
    action: {
        newFollower,
        userWentLive,
        newGameStream
    },
    reaction: {}
};
