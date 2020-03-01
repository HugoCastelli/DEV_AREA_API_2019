let utils = require("../discordUtils");

const addRole = async (inputData, serviceData) => {
    member = await utils.getUserById(inputData.user, serviceData.guild_id);
    if (!member) return;

    member.addRole(inputData.role).catch(error => console.error(error.message));
};

module.exports = {
    inputFields: [
        {
            key: "user",
            label: "User",
            required: true,
            type: "selectDynamic",
            function: "userList"
        },
        {
            key: "role",
            label: "Role",
            required: true,
            type: "selectDynamic",
            function: "roleList"
        }
    ],
    perform: addRole
};
