const mysql = require('mysql'),
    parameters = require('../../config/parameters'),
    pool = mysql.createPool({
        'host': parameters.db_host,
        'user': parameters.db_username,
        'password': parameters.db_password,
        'database': parameters.db_name
    });

function connect() {
    pool.getConnection((err, connection) => {
        if (err) {
            if (connection) {
                connection.release();
            }
            throw new Error('Database connection error');
        }
    });
}

function disconnect() {
    pool.end((error) => {
        console.log(error ? error : "No error");
    });
}

module.exports = {
    'connect': connect,
    'disconnect': disconnect,
    'connection': pool
};
