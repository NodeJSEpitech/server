const mysql = require('mysql'),
    parameters = require('../config/parameters');

let connection = null;

function connect() {
    connection = mysql.createConnection({
        host: parameters.db_host,
        username: parameters.db_username,
        password: parameters.db_password
    });
}

function disconnect() {
    connection.end();
}

function findAll(table) {
    let results = [];
    connection.query(`SELECT * FROM ${table}`, (error, rows, fields) => {
        if (error) {
            throw error;
        }
        results = rows;
    });
    return results;
}

function insert(table, values) {
    connection.query(`INSERT INTO '${table}' SET ?`, (error, results, fields) => {
        if (error) {
            throw error;
        }
    });
}

module.exports = {
    "connect": connect,
    "disconnect": disconnect,
    "findAll": findAll,
    "insert": insert
};
