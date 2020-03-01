const apiKey = "5fVcU6vOKdb24JvYmHkWPVFdRdC8kNssJ0e934pg";

const flattenObject = (currentKey, into, target) => {
    for (var i in into) {
        if (into.hasOwnProperty(i)) {
            var newKey = i;
            var newVal = into[i];

            if (currentKey.length > 0) {
                newKey = currentKey + "_" + i;
            }

            if (typeof newVal === "object") {
                flattenObject(newKey, newVal, target);
            } else {
                target[newKey] = newVal;
            }
        }
    }
}

module.exports = {
    apiKey: apiKey,
    flattenObject: flattenObject
};
