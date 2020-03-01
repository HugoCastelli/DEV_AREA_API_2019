let newMostPopularVideo = require('./actions/newMostPopularVideo');
let subscribersCount = require('./actions/subscribersCount');
let viewCount = require('./actions/viewCount');
let newVideo = require('./actions/newVideo');

module.exports = {
    action: {
        newMostPopularVideo,
        subscribersCount,
        viewCount,
        newVideo
    },
    reaction: {}
};
