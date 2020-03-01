let axios = require("axios");

const new_entries = async (inputData, serviceData) => {
    console.log(inputData);
    let apiUrl = "https://api.typeform.com/forms/" + inputData.formId;

    let config = {
        headers: {
            Authorization: "Bearer " + serviceData.access_token
        }
    };

    let formData = (await axios.get(apiUrl, config)).data;
    let apiQuery = inputData.completed != null ? "?completed=" + inputData.completed : "";
    let formResponseData = (await axios.get(apiUrl + "/responses" + apiQuery, config)).data;

    return formResponseData.items.map(item => {
        let response = {};
        response.submitted_at = item.submitted_at.replace("T", " ").slice(0, -1);
        if (item.answers) {
            formData.fields.map(field => {
                response[field.title.replace(/{{field:[\w\W]+}}/g, "...")] = field.ref;
            });
            item.answers.map(answer => {
                let field = Object.keys(response).find(key => response[key] === answer.field.ref);
                if (answer.type == "choice") response[field] = answer[answer.type].label;
                else if (answer.type == "choices") {
                    answer[answer.type].labels.sort();
                    response[field] = answer[answer.type].labels.join(", ");
                } else response[field] = answer[answer.type];
            });
        }
        return response;
    });
};

const findDifference = (prevValues, newValues) => {
    prevValuesStringyfied = prevValues.map(val => JSON.stringify(val));
    newValuesStringyfied = newValues.map(val => JSON.stringify(val));

    return newValuesStringyfied.filter(val => !prevValuesStringyfied.includes(val));
};

module.exports = {
    inputFields: [
        { key: "formId", label: "Form id", required: true, type: "inputText" },
        { key: "completed", label: "Is form must be send ?", required: false, type: "inputBoolean" }
    ],
    defaultResponse: {},
    perform: new_entries,
    diff: findDifference
};
