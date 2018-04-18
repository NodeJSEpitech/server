const mysql = require('mysql'),
    parameters = require('../../config/parameters'),
    env = process.env.NODE_ENV; // eslint-disable-line no-undef
let connection = null;

function getFinalTable(table) {
    return env === 'test' ? `${table}_test` : table;
}

function connect() {
    connection = mysql.createConnection({
        'host': parameters.db_host,
        'user': parameters.db_username,
        'password': parameters.db_password,
        'database': parameters.db_name
    });
}

function disconnect() {
    connection.end();
}

function findBy(table, wheres = null, limit = null) {
    const criteria = [],
        finalTable = getFinalTable(table);
    let criterion = null,
        where = '',
        finalLimit = '';

    if (wheres !== null) {
        for (criterion in wheres) {
            criteria.push(`${criterion}='${wheres[criterion]}'`);
        }
        where = `WHERE ${criteria.join(' AND ')}`;
    }

    if (limit !== null) {
        finalLimit = `LIMIT ${parseInt(limit, 10)}`;
    }

    connect();
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${finalTable} ${where} ${finalLimit}`, (error, rows) => {
            disconnect();
            if (error) {
                return reject(error);
            }
            return resolve(rows);
        });
    });
}

function insert(table, wheres) {
    const finalTable = getFinalTable(table);

    connect();
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${finalTable} SET ?`, wheres, (error, rows) => {
            disconnect();
            if (error) {
                return reject(error);
            }
            return resolve(rows);
        });
    });
}

function update(table, values, wheres = null) {
    const criteria = [],
        finalTable = getFinalTable(table);
    let criterion = null,
        where = '';

    if (wheres !== null) {
        for (criterion in wheres) {
            criteria.push(`${criterion}='${wheres[criterion]}'`);
        }
        where = `WHERE ${criteria.join(' AND ')}`;
    }

    connection.query(`UPDATE ${finalTable} SET ? ${where}`, values);
}

function remove(table, wheres = null) {
    const criteria = [],
        finalTable = getFinalTable(table);
    let value = null,
        where = '';

    if (wheres !== null) {
        for (value in wheres) {
            criteria.push(`${value}='${wheres[value]}'`);
        }
        where = `WHERE ${criteria.join(' AND ')}`;
    }

    connect();
    connection.query(`DELETE FROM ${finalTable} ${where}`, (error) => {
        if (error) {
            throw error;
        }
    });
    disconnect();
}

module.exports = {
    "connect": connect,
    "disconnect": disconnect,
    "findBy": findBy,
    "insert": insert,
    "update": update,
    "remove": remove
};
