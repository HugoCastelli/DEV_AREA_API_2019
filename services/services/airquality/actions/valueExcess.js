let axios = require('axios');

const valueExcess = async config => {
    const city = config.city;
    const url = 'https://api.waqi.info/feed';
    const token = '0f1c6c5f8c9f66a258a4b7de213fc06f15ed51ad';

    const data = (await axios.get(`${url}/${city}/?token=${token}`)).data;

    const airQuality = data.data.aqi;
    const cityName = data.data.city.name;
    const cityUrl = data.data.city.url;
    const pollutionLevel =
        airQuality <= 50
            ? 'Good'
            : airQuality <= 100
            ? 'Moderate'
            : airQuality <= 150
            ? 'Unhealthy for Sensitive Groups'
            : airQuality <= 200
            ? 'Unhealthy'
            : airQuality <= 300
            ? 'Very Unhealthy'
            : 'Hazardous';

    return [
        {
            airQuality,
            cityName,
            cityUrl,
            pollutionLevel
        }
    ];
};

const findDifference = (prevValues, newValues, inputData) => {
    const excessType = inputData.excessType;
    const excessValue = inputData.excessValue;
    let res = [];

    if (excessType === 'UP') {
        if (
            newValues[0].airQuality >= excessValue &&
            prevValues[0].airQuality < excessValue
        ) {
            res.push(JSON.stringify([newValues]));
            return res;
        } else {
            return [];
        }
    } else {
        if (
            newValues[0].airQuality <= excessValue &&
            prevValuesnewValues[0].airQuality > excessValue
        ) {
            res.push(JSON.stringify([newValues]));
            return res;
        } else {
            return [];
        }
    }
};

module.exports = {
    inputFields: [
        {
            key: 'city',
            label: 'City',
            required: true,
            type: 'inputText'
        },
        {
            key: 'excessValue',
            label: 'Excess Value',
            required: true,
            type: 'inputNumber'
        },
        {
            key: 'excessType',
            label: 'Excess Type',
            required: true,
            type: 'select',
            values: ['UP', 'DOWN']
        }
    ],
    defaultResponse: {
        airQuality: 21,
        cityName: 'Perpignan Centre, LangedocRoussillon, France',
        cityUrl:
            'https://aqicn.org/city/france/langedocroussillon/perpignan-centre',
        pollutionLevel: 'Good'
    },
    perform: valueExcess,
    diff: findDifference
};
