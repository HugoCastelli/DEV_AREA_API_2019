let utils = require("../discordUtils");

const setRateLimitChannel = async (inputData, serviceData) => {
    channel = await utils.getChannelById(inputData.channel, serviceData.guild_id);
    if (!channel) return;

    channel.setRateLimitPerUser(inputData.rate).catch(error => console.error(error.message));;
};

module.exports = {
    inputFields: [
        {
            key: "channel",
            label: "Channel",
            required: true,
            type: "selectDynamic",
            function: "textChannelList"
        },
        { key: "rate", label: "Rate Limit", required: true, type: "inputNumber" }
    ],
    perform: setRateLimitChannel
};
