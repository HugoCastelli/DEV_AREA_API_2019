var firebase = require("firebase");

firebase.initializeApp({
    apiKey: "AIzaSyCNezdRtOg1xjLLsEbaxtEfbP0IQC3ZdiU",
    authDomain: "area-51-264515.firebaseapp.com",
    databaseURL: "https://area-51-264515.firebaseio.com",
    projectId: "area-51-264515",
    storageBucket: "area-51-264515.appspot.com",
    messagingSenderId: "507436531113"
});

let database = firebase.database();

const get = value => {
    return new Promise(resolve => {
        database
            .ref(value)
            .once("value")
            .then(snapshot => {
                resolve(snapshot.val());
            });
    });
};

const set = (ref, value) => {
    database.ref(ref).set(value);
};

const push = (ref, value) => {
    database
        .ref(ref)
        .push()
        .set(value);
};

const pushId = (ref, id, value) => {
    database
        .ref(ref)
        .child(id)
        .set(value);
};

const update = (ref, value) => {
    database.ref(ref).update(value);
};

const remove = ref => {
    database.ref(ref).remove();
};

const removeUser = userId => {
    database.ref('users/').child(userId).remove();
};

const getUserById = userId => {
    return new Promise(resolve => {
        database
            .ref("users/" + userId)
            .once("value")
            .then(snapshot => {
                resolve(snapshot.val());
            });
    });
};

const getUserByValue = async (value, valueName) => {
    let users = await get("users");

    for ([userId, user] of Object.entries(users)) {
        if (user[valueName] === value) {
            user.id = userId;
            return user;
        }
    }
    return null;
};

const getUserByEmail = value => {
    return getUserByValue(value, "email");
};
const getUserByToken = value => {
    return getUserByValue(value, "access_token");
};
const getUserByFBId = value => {
    return getUserByValue(value, "facebook_id");
};

module.exports = {
    db: database,
    get: get,
    set: set,
    push: push,
    pushId: pushId,
    update: update,
    remove: remove,
    removeUser: removeUser,
    getUserById: getUserById,
    getUserByEmail: getUserByEmail,
    getUserByToken: getUserByToken,
    getUserByFacebookId: getUserByFBId,
};
