let utils = require("../discordUtils");

const setNameChannel = async (inputData, serviceData) => {
    channel = await utils.getChannelById(inputData.channel, serviceData.guild_id);
    if (!channel) return;

    channel.setName(inputData.name).catch(error => console.error(error.message));;
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
        { key: "name", label: "New name", required: true, type: "inputText" }
    ],
    perform: setNameChannel
};
