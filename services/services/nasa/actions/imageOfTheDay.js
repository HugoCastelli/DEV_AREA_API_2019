let axios = require("axios");
let utils = require("../nasaUtils");

const imageOfTheDay = async (inputData, serviceData) => {
    apiUrl = "https://api.nasa.gov/planetary/apod?api_key=" + utils.apiKey;

    let data = (await axios.get(apiUrl)).data;
    if (!data) return [];
    return [{
        author: data.copyright,
        date: data.date,
        desc: data.explanation,
        hdurl: data.hdurl,
        url: data.url,
        media_type: data.media_type,
        title: data.title
    }];
};

const findDifference = (prevValues, newValues) => {
    prevValuesStringyfied = prevValues.map(val => JSON.stringify(val));
    newValuesStringyfied = newValues.map(val => JSON.stringify(val));

    return newValuesStringyfied.filter(val => !prevValuesStringyfied.includes(val));
};

module.exports = {
    inputFields: [],
    defaultResponse: {
        author: "Moi",
        date: "1970-01-01",
        desc: "C'est une jolie image quoi.",
        hdurl: "https://google.com",
        url: "https://google.com",
        media_type: "picture",
        title: "Image"
    },
    perform: imageOfTheDay,
    diff: findDifference
};
