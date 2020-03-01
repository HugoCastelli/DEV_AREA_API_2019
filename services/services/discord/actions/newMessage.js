let utils = require("../discordUtils");
let Moment = require("moment");

const newMessage = async (inputData, serviceData) => {
    channel = await utils.getChannelById(inputData.channel, serviceData.guild_id);
    if (!channel) return [];

    return channel.fetchMessages().then(messages => {
        return messages
            .filter(message => message.deleted == false)
            .map(message => {
                return {
                    author: message.author.username,
                    channel: message.channel.name,
                    content: message.cleanContent,
                    createdAt: Moment(message.createdTimestamp).format("YYYY-MM-DD HH:mm"),
                    id: message.id,
                    type: message.type,
                    url: message.url
                };
            });
    });
};

const findDifference = (prevValues, newValues) => {
    prevValuesStringyfied = prevValues.map(val => JSON.stringify(val));
    newValuesStringyfied = newValues.map(val => JSON.stringify(val));

    return newValuesStringyfied.filter(val => !prevValuesStringyfied.includes(val));
};

module.exports = {
    inputFields: [
        {
            key: "channel",
            label: "Channel",
            required: true,
            type: "selectDynamic",
            function: "textChannelList"
        }
    ],
    defaultResponse: {
        author: "AREABot",
        channel: "general",
        content: "I am a message",
        createdAt: "1970-01-01 00:00",
        id: "1234567",
        type: "DEFAULT",
        url: "https://youporn.com"
    },
    perform: newMessage,
    diff: findDifference
};
