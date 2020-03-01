let axios = require("axios");
let utils = require("../nasaUtils");

const nearAsteroids = async (inputData, serviceData) => {
    apiUrl = "https://api.nasa.gov/neo/rest/v1/feed?api_key=" + utils.apiKey;

    apiUrl += "&start_date=" + inputData.startDate;
    if (inputData.endDate) apiUrl += "&end_date=" + inputData.endDate;

    let data = (await axios.get(apiUrl)).data;
    if (!data) return [];

    response = [];
    Object.entries(data.near_earth_objects).forEach(([date, dayAsteroids]) => {
        dayAsteroids.forEach(asteroid => {
            newAsteroid = {
                totalAsteroids: data.element_count,
                dateAsteroids: dayAsteroids.length,
                date: date
            };
            utils.flattenObject("", asteroid, newAsteroid);
            response.push(newAsteroid);
        });
    });
    return response;
};

const findDifference = (prevValues, newValues) => {
    prevValuesStringyfied = prevValues.map(val => JSON.stringify(val));
    newValuesStringyfied = newValues.map(val => JSON.stringify(val));

    return newValuesStringyfied.filter(val => !prevValuesStringyfied.includes(val));
};

module.exports = {
    inputFields: [
        { key: "startDate", label: "Start Date (YYYY-MM-DD)", required: true, type: "inputText" },
        { key: "endDate", label: "End Date (YYYY-MM-DD)", required: false, type: "inputText" }
    ],
    defaultResponse: {
        totalAsteroids: 42,
        dateAsteroids: 9,
        date: "2020-02-24",
        links_self:
            "http://www.neowsapp.com/rest/v1/neo/3893719?api_key=5fVcU6vOKdb24JvYmHkWPVFdRdC8kNssJ0e934pg",
        id: "3893719",
        neo_reference_id: "3893719",
        name: "(2019 WO4)",
        nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3893719",
        absolute_magnitude_h: 23.5,
        estimated_diameter_kilometers_estimated_diameter_min: 0.0530340723,
        estimated_diameter_kilometers_estimated_diameter_max: 0.1185877909,
        estimated_diameter_meters_estimated_diameter_min: 53.0340723319,
        estimated_diameter_meters_estimated_diameter_max: 118.5877908577,
        estimated_diameter_miles_estimated_diameter_min: 0.0329538346,
        estimated_diameter_miles_estimated_diameter_max: 0.0736870142,
        estimated_diameter_feet_estimated_diameter_min: 173.9963058693,
        estimated_diameter_feet_estimated_diameter_max: 389.0675677576,
        is_potentially_hazardous_asteroid: false,
        close_approach_data_0_close_approach_date: "2020-02-24",
        close_approach_data_0_close_approach_date_full: "2020-Feb-24 06:55",
        close_approach_data_0_epoch_date_close_approach: 1582527300000,
        close_approach_data_0_relative_velocity_kilometers_per_second: "6.8708667796",
        close_approach_data_0_relative_velocity_kilometers_per_hour: "24735.1204066449",
        close_approach_data_0_relative_velocity_miles_per_hour: "15369.44189934",
        close_approach_data_0_miss_distance_astronomical: "0.1347248647",
        close_approach_data_0_miss_distance_lunar: "52.4079723683",
        close_approach_data_0_miss_distance_kilometers: "20154552.795158189",
        close_approach_data_0_miss_distance_miles: "12523458.3864294482",
        close_approach_data_0_orbiting_body: "Earth",
        is_sentry_object: false
    },
    perform: nearAsteroids,
    diff: findDifference
};
