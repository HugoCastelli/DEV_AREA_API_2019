let axios = require('axios');

const capitalization = async (inputData, serviceData) => {
    let cryptocurrency = inputData.cryptocurrency;
    let currency = inputData.currency_conversion;
    let depassement_value = inputData.depassement_value;
    let url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";


    if (currency && cryptocurrency && depassement_value) {
        let config = {
            headers: {
                'X-CMC_PRO_API_KEY': "ef2693b0-9538-4c5b-97a1-1a5b4a2e43c5",
                'Accept': 'application/json'
            },
            params: {
                symbol: cryptocurrency,
                convert: currency
            }
        };

        let response = await axios.get(url, config);
        if (response.data) {
            let JSON = {
                cryptocurrency: cryptocurrency,
                currency_conversion: currency,
                capitalization: response.data.data[cryptocurrency].quote[currency].market_cap
            };
            return [JSON];
        }
        return [];
    }
};

const findDifference = (prevValues, newValues, inputData) => {

    let depassement_value = inputData.depassement_value;
    let res = [];

    // console.log("------------------------------\nnew value:");
    // console.log(newValues.value);
    // console.log("old value:");
    // console.log(prevValues.value);
    // console.log(inputData.depassement_value);

    if (inputData.up_or_down === 'UP') {
        if (newValues.capitalization >= depassement_value && prevValues.capitalization < depassement_value) {
            res.push(JSON.stringify([newValues]));
            return res;
        } else {
            return [];
        }
    } else {
        if (newValues.capitalization <= depassement_value && prevValues.capitalization > depassement_value) {
            res.push(JSON.stringify([newValues]));
            return res;
        } else {
            return [];
        }
    }

    return [];
};

module.exports = {
    inputFields: [
        {key: "cryptocurrency", label: "Cryptocurrency", required: true, type: "inputText"},
        {key: "currency_conversion", label: "Currency of conversion", required: true, type: "inputText"},
        {key: "depassement_value", label: "Value of cryptocurrency capitalization depassement", required: true, type: "inputNumber"},
        {key: "up_or_down", label: "Capitalization is depassing or trespassing", required: true, type: "select", values: ['UP', 'DOWN']}
    ],
    defaultResponse: {
        cryptocurrency: "BTC",
        currency_conversion: "EUR",
        capitalization: 10000000000
    },
    perform: capitalization,
    diff: findDifference
};
