const mysql = require('mysql'),
    parameters = require('../../config/parameters'),
    pool = mysql.createPool({
        'host': parameters.dbHost,
        'user': parameters.dbUsername,
        'password': parameters.dbPassword,
        'database': parameters.dbName
    });

function connect(request, response, next) {
    pool.getConnection((error, connection) => {
        if (error) {
            if (connection) {
                connection.release();
            }
            throw new Error('Database connection error');
        }
        next();
    });
}

function disconnect(request, response, next) {
    pool.end(() => {
        next();
    });
}

module.exports = {
    'connect': connect,
    'disconnect': disconnect,
    'connection': pool
};
