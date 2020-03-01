let express = require('express');
let router = express.Router();
let AREA51 = require('../../config/firebase');
var randtoken = require('rand-token');
var nodeMailer = require('nodemailer');
const qs = require('querystring');
let axios = require('axios');

var mailServer = nodeMailer.createTransport({
    host: 'mail.mailo.com',
    port: 465,
    secure: true,
    auth: {
        user: 'area51.project@mailo.com',
        pass: 'AREA51project'
    }
});

router.post('/register', async function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;

    if (email && password && name) {
        let JSON = {
            email: email,
            password: password,
            name: name,
            account_type: 'normal',
            access_token: randtoken.generate(64),
            role: 'normal'
        };

        var mailOptions = {
            from: `'Inscription - AREA_51' <area51.project@mailo.com>`,
            to: email,
            subject: 'Bienvenue dans la Zone51',
            text:
                'Bonjour ' +
                name +
                '\nBienvenue sur AREA51\n\nVotre email: ' +
                email
        };

        let users = await AREA51.get('/users/');

        for (const user in users) {
            if (users[user].email === email) {
                return res.status(400).send({
                    message: 'already_exist'
                });
                return res.end();
            }
        }
        var id = AREA51.db
            .ref()
            .child('users')
            .push(JSON);
        mailServer.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log("E-mail d'inscription envoyé: " + info.response);
        });
        delete JSON['password'];
        return res.status(200).send(JSON);
    }
});

router.post('/login', async function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (email && password) {
        let users = await AREA51.get('/users/');

        for ([userId, user] of Object.entries(users)) {
            if (user.email === email && user.password === password) {
                let JSON = {
                    access_token: user.access_token,
                    email: user.email,
                    name: user.name,
                    account_type: user.account_type,
                    role: user.role
                };

                var mailOptions = {
                    from: `'Notification de connexion - AREA_51' <area51.project@mailo.com>`,
                    to: email,
                    subject: 'Connexion a votre compte AREA51',
                    text:
                        'Bonjour ' +
                        user.name +
                        ",\nquelqu'un s'est connecté a votre compte: \n" +
                        ip.toString()
                };

                mailServer.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log(
                        'E-mail de notification de connexion envoyé: ' +
                        info.response
                    );
                });

                return res
                    .status(200)
                    .send(JSON)
                    .end();
            }
        }
        return res
            .status(400)
            .send({message: 'connection_failed'})
            .end();
    }
});

router.post('/authfacebook', async function (req, res, next) {
    let access_token = req.body.facebook_code;

    if (access_token) {
        let config = {
            params: {
                fields: 'name,email,id',
                access_token: access_token
            }
        };
        let response = await axios.get(
            'https://graph.facebook.com/v5.0/me',
            config
        );

        let name = response.data.name;
        let facebook_id = response.data.id;

        if (name && access_token && facebook_id) {
            if ((await AREA51.getUserByFacebookId(facebook_id)) !== null)
                return res
                    .status(200)
                    .json(await AREA51.getUserByFacebookId(facebook_id))
                    .end();

            let JSON = {
                facebook_id: facebook_id,
                account_type: 'facebook',
                access_token: randtoken.generate(64),
                name: name,
                services_auth: {
                    facebook: {
                        name: name,
                        facebook_id: facebook_id,
                        access_token: access_token
                    }
                },
                role: 'normal'
            };

            let id = AREA51.db
                .ref()
                .child('users')
                .push(JSON);
            res.status(200)
                .json(JSON)
                .end();
            return;
        }
    }
});

router.post('/authgoogle', async function (req, res) {
    let code = req.body.google_code;

    if (code) {
        config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        body = {
            code: decodeURI(code),
            client_id:
                '529627282098-q4dand07pqpk3s8013vtup7jal8858kb.apps.googleusercontent.com',
            client_secret: 'JNVgasXW7aVJjG2S3oI2FD-P',
            redirect_uri: 'http://localhost:8081/login?from=google',
            grant_type: 'authorization_code'
        };
        let response = await axios.post(
            'https://oauth2.googleapis.com/token',
            qs.stringify(body),
            config
        );
        let getProfileConfig = {
            headers: {
                Authorization: 'Bearer ' + response.data.access_token
            }
        };

        let proile_response = await axios.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            getProfileConfig
        );
        let email = proile_response.data.email;
        let name = proile_response.data.name;
        let google_id = proile_response.data.id;
        let photo_url = proile_response.data.picture;
        let access_token = response.data.access_token;

        if (email && name && access_token && google_id && photo_url) {
            if ((await AREA51.getUserByEmail(email)) !== null) {
                return res
                    .status(200)
                    .json(await AREA51.getUserByEmail(email))
                    .end();
            }

            let JSON = {
                email: email,
                account_type: 'google',
                access_token: access_token,
                name: name,
                services_auth: {
                    google: {
                        email: email,
                        name: name,
                        google_id: google_id,
                        photo_url: photo_url,
                        access_token: access_token
                    }
                },
                role: 'normal'
            };

            let id = AREA51.db
                .ref()
                .child('users')
                .push(JSON);
            res.status(200)
                .json(JSON)
                .end();
            return;
        }
    } else {
        res.status(400).send();
    }
    res.status(400).send();
});

router.post('/changePassword', async function (req, res) {
    var access_token = req.token;
    var oldpassword = req.body.old_password;
    var newpassword = req.body.new_password;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (access_token && oldpassword && newpassword) {
        let user = await AREA51.getUserByToken(req.token);
        if (user.account_type != 'normal' && user.password != oldpassword) {
            return res.status(400).send('User not found');
        }

        user.password = newpassword;
        const id = user.id;
        delete user.id;

        AREA51.db
            .ref()
            .child('users')
            .child(id)
            .set(user);

        var mailOptions = {
            from: `'Changement de mot de passe - AREA_51' <area51.project@mailo.com>`,
            to: user.email,
            subject: 'Votre mot de passe a été modifié',
            text:
                'Bonjour ' +
                user.name +
                ",\nVotre mot de passe a été modifié.\n IP de l'éméteur du changement de mot de passe: \n" +
                ip.toString()
        };

        mailServer.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log(
                'E-mail de notification de changement de mot de passe envoyé: ' +
                info.response
            );
        });

        delete user.password;
        delete user.id;

        return res.status(200).send(user).end();
    }
    return res.status(400).send('Missing informations');
});

module.exports = router;
