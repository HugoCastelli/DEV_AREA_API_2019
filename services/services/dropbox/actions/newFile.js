const axios = require("axios");

const newFile = async (inputData, serviceData) => {
    url = "https://api.dropboxapi.com/2/files/list_folder";
    config = {
        headers: {
            Authorization: "Bearer " + serviceData.access_token
        }
    };
    body = {
        path: inputData.path,
        recursive: false,
        include_deleted: false,
        include_has_explicit_shared_members: true,
        include_mounted_folders: true,
        include_non_downloadable_files: true
    };
    files = (await axios.post(url, body, config)).data;
    return files.entries.map(file => {
        return {
            tag: file[".tag"],
            name: file.name,
            id: file.id,
            modified: file.client_modified,
            size: file.size,
            is_downloadable: file.is_downloadable
        };
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
            key: "path",
            label: "Directory (path/to/file)",
            required: true,
            type: "inputText"
        }
    ],
    defaultResponse: {
        tag: "file",
        name: "TESt aREA.gdoc",
        id: "id:YCMbxnFBuOAAAAAAAAAT5g",
        modified: "2020-02-25T09:15:59Z",
        size: 75,
        is_downloadable: false
    },
    perform: newFile,
    diff: findDifference
};
