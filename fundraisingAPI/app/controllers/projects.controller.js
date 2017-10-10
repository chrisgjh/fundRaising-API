const project = require('../models/projects.model.js');
const url = require('url');

exports.readAllProjects = function(req, res) {
    let id = req.params.id;
    project.getAllProjects(id, function(result) {
        res.status(200).json(result);
    });
};

exports.createProject = function(req, res) {
    let project_data = {
        "title": req.body.title,
        "subtitle": req.body.subtitle,
        "description": req.body.description,
        "imageUri": req.body.imageUri,
        "target": req.body.target,
        "creators": req.body.creators,
        "rewards": req.body.rewards
    };
    
    let title = project_data['title'].toString();
    let subtitle = project_data['subtitle'].toString();
    let description = project_data['description'].toString();
    let imageUri = project_data['imageUri'].toString();
    let target = parseInt(project_data['target']);
    let creatorId = parseInt(project_data['creators'][0]['id']);
    let creatorName = project_data['creators'][0]['name'].toString();
    let rewardId = parseInt(project_data['rewards'][0]['id']);
    let rewardAmount = parseInt(project_data['rewards'][0]['amount']);
    let rewardDescription = project_data['rewards'][0]['description'].toString();
    
    let value = [
        [title, subtitle, description, imageUri, target, creatorId, creatorName, rewardId, rewardAmount, rewardDescription]
    ];
    
    project.insertProject(value, function(result) {
        res.status(201).json(result['insertId']);
    });
};

exports.readProjectId = function(req, res) {
    let id = req.params.id;
    project.getOneProject(id, function(result) {
        if (result != '') {
            let project_data = 
            {
              "project": {
                "id": result[0]['projectId'],
                "creationDate": result[0]['creationDate'],
                "data": {
                  "title": result[0]['title'],
                  "subtitle": result[0]['subtitle'],
                  "description": result[0]['description'],
                  "imageUri": result[0]['imageUri'],
                  "target": result[0]['target'],
                  "creators": [
                    {
                      "id": result[0]['creatorId'],
                      "name": result[0]['creatorName']
                    }
                  ],
                  "rewards": [
                    {
                      "id": result[0]['rewardId'],
                      "amount": result[0]['rewardAmount'],
                      "description": result[0]['rewardDescription']
                    }
                  ]
                }
              },
              "progress": {
                "target": 0,
                "currentPledged": 0,
                "numberOfBackers": 0
              },
              "backers": [
                {
                  "name": 0,
                  "amount": 0
                }
              ]
            }
            res.status(200).json(project_data);
        } else {
            res.status(404).send('Not found');
        }
    });
};

exports.updateProjectId = function(req, res) {
    let id = req.params.id;
    let open = req.body.open;
    let value = [open, id];
    project.alterProject(value, function(result) {
        if (result['affectedRows'] == 1) {
            res.status(201).send('OK');
        } else {
            res.status(404).send('Not found');
        }
    });
};

exports.viewImage = function(req, res) {
    let id = req.params.id;
    project.getProjectImage(id, function(result) {
        if (result != '') {
            let imageUri = url.parse(result);
            if (imageUri.hostname === req.hostname) {
                fs.readFile("." + imageUri.pathname, function(err, data) {
                    if (err) return done(err);
                    done(result);
                });
            }
        }
    });
};

exports.updateImage = function(req, res) {
    return null;
};

exports.pledge = function(req, res) {
    let id = req.params.id;
    project.pledge(id, function(result) {
        if (result != '') {
            let pledge_data = {
                "id": result[0]['id'],
                "amount": result[0]['amount'],
                "anonymous": result[0]['anonymous'],
                "card": {
                    "authToken": result[0]['authToken']
                }
            }
        }
    });
};

exports.readRewards = function(req, res) {
    let id = req.params.id;
    project.getRewards(id, function(result) {
        if (result != '') {
            res.status(200).json(result);
        } else {
            res.status(404).send('Not found');
        }
    });
};

exports.updateRewards = function(req, res) {
    /*let id = req.params.id;
    project.alterRewards(id, function(result) {
        if (result) {
            
        } else {
            
        }
    });*/
    return null;
};
