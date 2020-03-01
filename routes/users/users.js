var express = require("express");
let firebase = require("../../config/firebase");
let error = require("../../config/errorMessages");

var router = express.Router();

/* Get all users as a list */
router.get("/users/list/", async function (req, res) {
    let user = await firebase.getUserByToken(req.token);
    let responseArray = [];

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);

    if (user.role === "kingAdmin") {
        const userList = await firebase.get('users');
        for (const [userId, user] of Object.entries(userList)) {
            responseArray.push({
                id: userId,
                account_type: user.account_type ? user.account_type : "normal",
                areas_number: user.areas ? ((user.areas).length ? (user.areas).length : 0) : 0,
                name: user.name ? user.name : "no name",
                service_number: user.services ? ((user.services).length ? (user.services).length : 0) : 0,
                role: user.role
            });
        }
        return res.json(responseArray).end();
    } else {
        return res.status(400).end();
    }
});

router.delete('/users/delete/:userId', async function (req, res) {
    let user = await firebase.getUserByToken(req.token);
    let deleteUser = await firebase.getUserById(req.params.userId);

    if (!user) return res.status(400).send(error.USER_NOT_FOUND);
    if (req.params.userId === 'me') {
        firebase.removeUser(user.id);
        return res.status(200).end();
    }

    if (!deleteUser) return res.status(400).send(error.USER_NOT_FOUND);
    if ((user.role === "kingAdmin" && deleteUser.role !== "kingAdmin")) {
        firebase.removeUser(req.params.userId);
        return res.status(200).end();
    }
    return res.status(400).send(error.CANNOT_DELETE);
});

router.post('/users/changeRole/:userId', async function (req, res) {
    let user = await firebase.getUserByToken(req.token);
    let selectedUser = await firebase.getUserById(req.params.userId);
    let role = req.body.role;

    if (!user || !selectedUser) return res.status(400).send(error.USER_NOT_FOUND);
    if (user.role !== 'kingAdmin' && selectedUser.role !== 'kingAdmin') return res.status(400).send(error.DONT_HAVE_RIGHTS);
    firebase.set('users/' + req.params.userId + '/role', role);
    return res.status(200).end();
});

module.exports = router;