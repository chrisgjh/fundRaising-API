const db = require('../../config/db.js');


exports.getOneUser = function(id, done) {
    let sql = 'SELECT id, username, location, email FROM Users WHERE id = ?';
    
    db.get().query(sql, id, function (err, rows) {
        
        if (err) return done(err);
        done(rows);
    });
};

exports.alterUser = function(value ,done) {
    
    let sql1 = "SELECT * from Users WHERE id = ?"
    db.get().query(sql1, value.slice(4,7), function(err, rows) {
        if (rows != '') {
            let sql = "UPDATE Users SET username = ?, location = ?, email = ?, password = ? WHERE id = ? and username = ? and password = ?";
            db.get().query(sql, value, function(err, rows) {
                if (err) return done(err);
                done(rows);
            });
        } else {
            done('no user');
        }
    })
};

exports.removeUser = function(value, done) {
    db.get().query('SELECT * FROM Users WHERE id = ?', value[2], function(err, rows) {
        if (rows == '') return done('User not found');
        db.get().query('DELETE FROM Users WHERE username = ? and password = ? and id = ?', value, function (err, rows) {
            if (err) return done(err);
            done(rows);
        });
    });
};

exports.insertUser = function(value, done) {
    let sql = 'INSERT INTO Users (username, location, email, password) VALUES ?';
    let values = [value];
    
    db.get().query(sql, values, function(err, result) {
        if (err) done(err);
        done(result);
    });
};

exports.userLogin = function(value, done) {
    db.get().query('SELECT id FROM Users WHERE username = ? and password = ?', value, function(err, result) {
        if (err) {
            return done(err);
        } else {
            if (result != '') {
                done(result[0]['id']);
            } else {
                done(err);
            }
        }
    });
};

exports.userLogout = function(decoded, done) {
    let value = [decoded['username'], decoded['password']];
    db.get().query('UPDATE Users SET login = 0 WHERE username = ? and password = ?', value, function(err, result) {
        if (err) {
            return done(err);
        } else {
            done(result);
        }
    });
};
