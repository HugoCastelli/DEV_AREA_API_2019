let utils = require("../discordUtils");

const setPositionChannel = async (inputData, serviceData) => {
    channel = await utils.getChannelById(inputData.channel, serviceData.guild_id);
    if (!channel) return;

    channel.setPosition(inputData.position).catch(error => console.error(error.message));;
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
        { key: "position", label: "Position", required: true, type: "inputNumber" }
    ],
    perform: setPositionChannel
};
