let axios = require('axios');

const newContaminatedInCountry = async (inputData, serviceData) => {
    let url = "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query";

    let config = {
        params: {
            f: 'json',
            where: 'Confirmed > 0',
            outFields: '*',
            orderByFields: 'Confirmed desc'
        }
    };
    let response = await axios
        .get(url, config)
        .then(response => {return response.data})
        .catch(error => {return error.data});

    let responseArray = [];
    for (let each of response.features) {
        if (each.attributes.Country_Region == inputData.country) {
            responseArray.push({
                contaminated_number: each.attributes.Confirmed
            });
        }
    }

    return responseArray;
};

const findDifference = (prevValues, newValues, inputData) => {
    prevValuesStringyfied = prevValues.map(val => JSON.stringify(val));
    newValuesStringyfied = newValues.map(val => JSON.stringify(val));

    return newValuesStringyfied.filter(val => !prevValuesStringyfied.includes(val));
};

module.exports = {
    inputFields: [
        {key: "country", label: "Country", required: true, type: 'selectDynamic', function: "getCountries"}
    ],
    defaultResponse: {
        contaminated_number: ""
    },
    perform: newContaminatedInCountry,
    diff: findDifference
};
