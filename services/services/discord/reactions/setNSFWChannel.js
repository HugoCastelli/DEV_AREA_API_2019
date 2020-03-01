let utils = require("../discordUtils");

const setNSFWChannel = async (inputData, serviceData) => {
    channel = await utils.getChannelById(inputData.channel, serviceData.guild_id);
    if (!channel) return;

    channel.setNSFW(inputData.nsfw).catch(error => console.error(error.message));;
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
        { key: "nsfw", label: "NSFW", required: true, type: "inputBoolean" }
    ],
    perform: setNSFWChannel
};
