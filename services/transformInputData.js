const getValueAfterDollar = string => {
    const reg = /\${([\w\W][^$]{0,1000})}/g;
    const res = reg.exec(string);

    if (res === null || res[0] === "" || res[1] === "") return undefined;
    return res[1];
};

const transformInputData = (reactionInputData, diffToProcess) => {
    transformedInputData = {}
    Object.entries(reactionInputData).forEach(([key, value]) => {
        transformedInputData[key] = value;
        while ((variable = getValueAfterDollar(value))) {
            value = value.replace("${" + variable + "}", diffToProcess[variable]);
            transformedInputData[key] = value;
        }
    });
    return transformedInputData;
};

module.exports = transformInputData;
