let valueAction = require("./actions/value");
let capitalizationAction = require("./actions/capitalization");

module.exports = {
    action: {
        value: valueAction,
        capitalization: capitalizationAction
    }
};
