const mysql = require('mysql'),
    parameters = require('../config/parameters');

let connection = null;

function connect() {
    console.log(parameters);
    connection = mysql.createConnection({
        host: parameters.db_host,
        user: parameters.db_username,
        password: parameters.db_password,
        database: parameters.db_name
    });
}

function disconnect() {
    connection.end();
}

function findAll(table) {
    connection.query(`SELECT * FROM ${table}`, (error, results, fields) => {
        if (error) throw error;
        return results;
    });
    return [];
}

function findOneOrNull(table, id) {
    connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (error, results, fields) => {
        if (error) throw error;
        return results.length !== 1 ? null : results[0];
    });
}

function insert(table, values) {
    connection.query(`INSERT INTO ${table} SET ?`, values, (error, results, fields) => {
        if (error) {
            throw error;
        }
    });
}

module.exports = {
    "connect": connect,
    "disconnect": disconnect,
    "findAll": findAll,
    "findOneOrNull": findOneOrNull,
    "insert": insert
};
