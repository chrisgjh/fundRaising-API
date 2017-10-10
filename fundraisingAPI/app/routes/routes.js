const users = require('../controllers/users.controller.js');
const projects = require('../controllers/projects.controller.js');
const express = require('express');
const jwt = require('jsonwebtoken');


let projectSecureRoutes = express.Router();
let userSecureRoutes = express.Router();
process.env.SECRET_KEY = 'mybadassproject';

userSecureRoutes.use(function(req, res, next) {
    let token = req.header('X-Authorization');
    
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
            if (err) {
                res.status(401).send('Unauthorized - not logged in');
            } else {
                next();
            }
        });
    } else {
        res.status(403).send('Forbidden - account not owned');
    }
});

projectSecureRoutes.use(function(req, res, next) {
    let token = req.header('X-Authorization');
    
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
            if (err) {
                res.status(401).send('Forbidden - unable to update a project you do not own');
            } else {
                next();
            }
        });
    } else {
        res.status(403).send('Unauthorized - create account to update project');
    }
});

module.exports = function(app) {
    
    // projects
    app.route('/projects').get(projects.readAllProjects);
    app.route('/projects/:id').get(projects.readProjectId);
    app.route('/projects/:id/image').get(projects.viewImage);
    // rewards
    app.route('/projects/:id/rewards').get(projects.readRewards);
    
    app.use('/projects', projectSecureRoutes);
    projectSecureRoutes.route('/projects').post(projects.createProject);
    projectSecureRoutes.route('/projects/:id').put(projects.updateProjectId);
    projectSecureRoutes.route('/projects/:id/image').put(projects.updateImage);
    projectSecureRoutes.route('/projects/:id/pledge').post(projects.pledge);

    // rewards
    projectSecureRoutes.route('/projects/:id/rewards').put(projects.updateRewards);




    // users
    app.route('/users').post(users.create);
    app.route('/users/:id').get(users.readUserId);
    app.route('/users/login').post(users.login);
    app.use('/', userSecureRoutes);
    userSecureRoutes.route('/users/:id').put(users.updateUserId)
                                    .delete(users.deleteUserId);
    userSecureRoutes.route('/users/logout').post(users.logout);
};
