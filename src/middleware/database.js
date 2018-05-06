const mysql = require('mysql'),
    parameters = require('../../config/parameters'),
    pool = mysql.createPool({
        'host': parameters.db_host,
        'user': parameters.db_username,
        'password': parameters.db_password,
        'database': parameters.db_name
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
    pool.end((error) => {
        console.log(error ? error : "No error");
        next();
    });
}

module.exports = {
    'connect': connect,
    'disconnect': disconnect,
    'connection': pool
};
