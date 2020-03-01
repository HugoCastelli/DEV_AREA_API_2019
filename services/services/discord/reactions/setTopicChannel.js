let utils = require("../discordUtils");

const setTopicChannel = async (inputData, serviceData) => {
    channel = await utils.getChannelById(inputData.channel, serviceData.guild_id);
    if (!channel) return;

    channel.setTopic(inputData.topic).catch(error => console.error(error.message));;
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
        { key: "topic", label: "Topic", required: true, type: "inputText" }
    ],
    perform: setTopicChannel
};
