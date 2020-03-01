let utils = require("../discordUtils");

const sendMessage = async (inputData, serviceData) => {
    channel = await utils.getChannelById(inputData.channel, serviceData.guild_id);
    if (!channel) return;

    channel.send(inputData.message).catch(error => console.error(error.message));
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
        { key: "message", label: "Message", required: true, type: "inputText" }
    ],
    perform: sendMessage
};
