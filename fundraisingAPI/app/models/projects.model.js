const db = require('../../config/db.js');

exports.getAllProjects = function(id, done) {
    let sql = 'SELECT projectId AS id, title, subtitle, imageUri FROM Projects';
    
    db.get().query(sql, id, function (err, result) {
        if (err) return done(err);
        done(result);
    });
};

exports.insertProject = function(value, done) {
    let sql = 'INSERT INTO Projects (title, subtitle, description, imageUri, target, creatorId, creatorName, rewardId, rewardAmount, rewardDescription) VALUES ?';
    let values = [value];
    
    db.get().query(sql, values, function(err, result) {
        if (err) done(err);
        done(result);
    });
};

exports.getOneProject = function(projectId, done) {
    let sql = 'SELECT * FROM Projects WHERE projectId = ?'
    db.get().query(sql, projectId, function(err, rows) {
        if (err) return done(err);
        done(rows);
    });
};

exports.alterProject = function(value, done) {
    let sql = 'UPDATE Projects SET open = ? WHERE id = ?';
    db.get().query(sql, value, function (err, result) {
        if (err) return done(err);
        done(result);
    });
};

exports.getProjectImage = function(id, done) {
    let sql = 'SELECT imageUri FROM Projects WHERE projectId = ?';
    db.get().query(sql, id, function (err, result) {
        if (err) return done(err);
        done(result);
    });
};

exports.alterProjectImage = function() {
    return null;
};

exports.pledge = function(id, done) {
    let sql = 'SELECT * FROM Pledge WHERE id = ?';
    db.get().query(sql, id, function (err, result) {
        if (err) return done(err);
        done(result);
    });
};

exports.getRewards = function(projectId, done) {
    let sql = 'SELECT rewards FROM Projects WHERE projectId = ?';
    
    db.get().query(sql, projectId, function (err, result) {
        if (err) return done(err);
        done(result);
    });
};

exports.alterRewards = function(projectId, done) {
    /*let sql = 'SELECT rewards FROM Projects WHERE projectId = ?';
    
    db.get().query(sql, projectId, function (err, result) {
        if (result != '') {
            let sql = 'UPDATE Projects SET amount = ?, description = ?'
        }
    });*/
    return null;
};
