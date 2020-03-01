let axios = require("axios");

let newMessage = require("./actions/newMessage");
// let newReaction = require("./actions/newReaction");

let sendMessage = require("./reactions/sendMessage");
let setNameChannel = require("./reactions/setNameChannel");
let setParentChannel = require("./reactions/setParentChannel");
let setNSFWChannel = require("./reactions/setNSFWChannel");
let setPositionChannel = require("./reactions/setPositionChannel");
let setRateLimitChannel = require("./reactions/setRateLimitChannel");
let setTopicChannel = require("./reactions/setTopicChannel");
let addRole = require("./reactions/addRole");
let removeRole = require("./reactions/removeRole");

let utils = require("./discordUtils");

const getChannelList = async (guild_id, channelType) => {
    guild = await utils.getGuildById(guild_id);
    if (!guild) return [];

    return guild.channels
        .filter(channel => {
            return channel.type == channelType;
        })
        .map(channel => {
            return {
                key: channel.id,
                label: channel.name
            };
        });
};

const getUserList = async (inputData, serviceData) => {
    guild = await utils.getGuildById(serviceData.guild_id);
    if (!guild) return [];

    return guild.members.map(member => {
        return {
            key: member.id,
            label: member.user.username
        };
    });
};

const getRoleList = async (inputData, serviceData) => {
    guild = await utils.getGuildById(serviceData.guild_id);
    if (!guild) return [];

    return guild.roles.map(role => {
        return {
            key: role.id,
            label: role.name
        };
    });
};

const getMessageList = async (inputData, serviceData) => {
    channel = await utils.getChannelById(inputData.channel, serviceData.guild_id);
    if (!channel) return [];

    return channel.fetchMessages().then(messages => {
        return messages
            .filter(m => m.deleted == false)
            .map(m => {
                return {
                    key: m.id,
                    label: m.cleanContent
                };
            });
    });
};

const oauth = async (url, accessToken) => {
    query = url.split("?")[1];
    queryParams = query.split("&");

    body = {};
    queryParams.forEach(queryParam => {
        queryParamValues = queryParam.split("=");
        if (queryParamValues[0] == "guild_id") {
            body[queryParamValues[0]] = queryParamValues[1];
        }
    });

    apiUrl = "http://localhost:8080/users/services/discord";
    return await axios
        .post(apiUrl, body, {
            headers: { Authorization: "Bearer " + accessToken }
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
};

module.exports = {
    action: {
        newMessage: newMessage /* ,
        newReaction: newReaction */
    },
    reaction: {
        sendMessage: sendMessage,
        setNameChannel: setNameChannel,
        setParentChannel: setParentChannel,
        setNSFWChannel: setNSFWChannel,
        setPositionChannel: setPositionChannel,
        setRateLimitChannel: setRateLimitChannel,
        setTopicChannel: setTopicChannel,
        addRole: addRole,
        removeRole: removeRole
    },
    functions: {
        textChannelList: (_, serviceData) => {
            return getChannelList(serviceData.guild_id, "text");
        },
        categoryChannelList: (_, serviceData) => {
            return getChannelList(serviceData.guild_id, "category");
        },
        userList: getUserList,
        roleList: getRoleList,
        messageList: getMessageList
    },
    oauth: oauth
};
