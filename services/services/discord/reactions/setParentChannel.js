let utils = require("../discordUtils");

const setParentChannel = async (inputData, serviceData) => {
    channel = await utils.getChannelById(inputData.channel, serviceData.guild_id);
    parentCategory = await utils.getChannelById(inputData.parent, serviceData.guild_id);
    if (!channel || !parentCategory) return;

    channel.setParent(parentCategory).catch(error => console.error(error.message));;
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
        {
            key: "parent",
            label: "Parent Channel",
            required: true,
            type: "selectDynamic",
            function: "categoryChannelList"
        }
    ],
    perform: setParentChannel
};
