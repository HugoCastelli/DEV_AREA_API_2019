const axios = require("axios");

const newRepository = async (inputData, serviceData) => {
    url = "https://api.github.com/user/repos";
    config = {
        headers: {
            Authorization: "Bearer " + serviceData.access_token
        }
    };
    repositories = (await axios.get(url, config)).data;

    return repositories.map(repository => {
        return {
            id: repository.id,
            name: repository.name,
            full_name: repository.full_name,
            description: repository.description,
            created_at: repository.created_at,
            owner_id: repository.owner.id,
            owner_login: repository.owner.login,
            owner_url: repository.owner.html_url,
            url: repository.html_url,
            ssh_url: repository.ssh_url,
            size: repository.size,
            language: repository.language,
            private: repository.private,
            archived: repository.archived,
            disabled: repository.disabled,
            default_branch: repository.default_branch,
            open_issues: repository.open_issues_count,
            stargazers: repository.stargazers_count,
            watchers: repository.watchers_count,
            forks: repository.forks_count
        };
    });
};

const findDifference = (prevValues, newValues) => {
    prevValuesStringyfied = prevValues.map(val => JSON.stringify(val));
    newValuesStringyfied = newValues.map(val => JSON.stringify(val));

    return newValuesStringyfied.filter(val => !prevValuesStringyfied.includes(val));
};

module.exports = {
    inputFields: [],
    defaultResponse: {},
    perform: newRepository,
    diff: findDifference
};