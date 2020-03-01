let newContaminatedInCountry = require("./actions/newContaminatedInCountry");
let newRecoveredInCountry = require("./actions/newRecoveredInCountry");
let axios = require('axios');


const getCountries = async (inputDatas, serviceData) => {
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

    let lists = [];
    for (let each of response.features) {
        if (each.attributes.Country_Region == 'Mainland China') {
            lists.push({
                label: "Fucking chinese people",
                key: each.attributes.Country_Region
            });
        } else if (each.attributes.Country_Region == 'Others') {
            lists.push({
                label: "Diamond Princess",
                key: each.attributes.Country_Region
            });
        } else {
            lists.push({
                label: each.attributes.Country_Region,
                key: each.attributes.Country_Region
            });
        }
    }

    return lists;
};


module.exports = {
    action: {
        newContaminatedInCountry: newContaminatedInCountry,
        newRecoveredInCountry: newRecoveredInCountry
    },
    functions: {
        getCountries: getCountries
    },
};
