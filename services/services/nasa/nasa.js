let imageOfTheDay = require("./actions/imageOfTheDay");
let nearAsteroids = require("./actions/nearAsteroids");
let interplanetaryShock = require("./actions/interplanetaryShock");

module.exports = {
    action: {
        imageOfTheDay: imageOfTheDay,
        nearAsteroids: nearAsteroids,
        interplanetaryShock: interplanetaryShock
    }
};
