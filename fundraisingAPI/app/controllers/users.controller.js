const user = require('../models/users.model.js');
const Regex = require('regex');
const jwt = require('jsonwebtoken');
const jwtBlacklist = require('jwt-blacklist')(jwt);

process.env.SECRET_KEY = 'mybadassproject';

exports.create = function(req, res) {
    if (req.body.user != {} & req.body.password != ''){
    
        let user_data = {
            "user": req.body.user,
            "password": req.body.password
        };
        
        let username = user_data['user']['username'].toString();
        let location = user_data['user']['location'].toString();
        let email = user_data['user']['email'].toString();
        let password = user_data['password'].toString();
    

        let r_usr = /\w+/;
        let r_psw = /\w+/;
        let r_eml = /\w+@[a-z]+\./;
    
        if (r_usr.test(username) && r_psw.test(password) && r_eml.test(email)) {    
            let value = [
                [username, location, email, password]
            ];

            user.insertUser(value, function(result) {
                if (result != '') {
                    res.status(201).json(result['insertId']);
                } else {
                    res.status(400).send('Malformed request');
                }
            });
        } else {
            res.status(400).send('Malformed request');
        }
    } else {
        res.status(400).send('Malformed request');
    }
    
    
};

exports.readUserId = function(req, res) {
    let id = req.params.id;
    user.getOneUser(id, function(result) {
        if (result != '') {
            res.status(200).json(result[0]);
        } else {
            res.status(404).send('User not found');
        }
    });
};

exports.updateUserId = function(req, res) {
    let user_data = {
        "user": req.body.user,
        "password": req.body.password
    };
    
    let token = req.header('X-Authorization');
    let decoded = jwt.decode(token);
    let id = req.params.id;
    let c_username = user_data['user']['username'].toString();
    let location = user_data['user']['location'].toString();
    let email = user_data['user']['email'].toString();
    let c_password = user_data['password'].toString();

    let r_usr = /\w+/;
    let r_psw = /\w+/;
    let r_eml = /\w+@[a-z]+\./;
    
    if (r_usr.test(c_username) && r_psw.test(c_password) && r_eml.test(email)) {    
        let value = [
            c_username, location, email, c_password, id,
            decoded['username'], decoded['password']
        ];
        
        user.alterUser(value, function(result) {
            if (result['affectedRows'] == 1) {
                res.status(201).send('OK');
            } else if (result == 'no user') {
                res.status(404).send('User not found');
            } else {
                res.status(403).send('Forbidden - account not owned');
            }
        });
    } else {
        res.status(400).send('Malformed request');
    }
};

exports.deleteUserId = function(req, res) {
    let id = req.params.id;
    let token = req.header('X-Authorization');
    let decoded = jwt.decode(token);
    let value = [decoded['username'], decoded['password'], id];

    user.removeUser(value, function(result) {
        if (result == 'User not found') {
            res.status(404).send('User not found');
        } else if (result['affectedRows'] != 0) {
            res.status(200).send('User deleted');
        } else {
            res.status(403).send('Forbidden - account not owned');
        }
    });
};

exports.login = function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    
    let value = [
            username,
            password
        ];

    user.userLogin(value, function(result) {
        
        if (result != null) {
            let token = jwt.sign({username: username,
                                  password: password},
                                  process.env.SECRET_KEY, {expiresIn:600});
            res.json({id: result, token: token});
        } else  {
            res.status(400).send("Invalid username/password supplied");
        }
    });
};

exports.logout = function(req, res) {
    let token = req.header('X-Authorization');
    let decoded = jwt.decode(token);

    user.userLogout(decoded, function(result) {
        if (result['affectedRows'] != 0) {
            res.status(200).send('OK');
        } else {
            res.status(401).send('Unauthorized - already logged out');
        }
    });
    jwtBlacklist.blacklist(token);
    
};
