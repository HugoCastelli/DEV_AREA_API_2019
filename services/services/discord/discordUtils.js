let Discord = require("discord.js");

let botToken = "Njc0NTU0MjkyMDg1OTgxMTg1.XlTyHw.K6lC7pWirlARkkg_0RlOEPc32iY";
let client = null;
let isClientReady = false;

const connectClient = () => {
    client = new Discord.Client();
    client.login(botToken);
    client.on("ready", () => {
        isClientReady = true;
    });
};

const getClient = () => {
    if (!isClientReady) return null;
    return client;
};

const getGuildById = async id => {
    if (!client) return null;

    return client.guilds.find(guild => {
        return guild.id == id;
    });
};

const getChannelById = async (id, guild_id) => {
    guild = await getGuildById(guild_id);
    if (!guild) return null;

    return guild.channels.find(channel => {
        return channel.id == id;
    });
};

const getUserById = async (id, guild_id) => {
    guild = await getGuildById(guild_id);
    if (!guild) return null;

    return guild.members.find(member => {
        return member.id == id;
    });
};

const getMessageById = async (id, channelId, guild_id) => {
    channel = await getChannelById(channelId, guild_id);
    if (!channel) return null;

    return channel.fetchMessage(id).then(message => {
        return message;
    });
};

module.exports = {
    getClient: getClient,
    getGuildById: getGuildById,
    getChannelById: getChannelById,
    getUserById: getUserById,
    getMessageById: getMessageById
};

connectClient();
