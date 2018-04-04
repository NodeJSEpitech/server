const mysql = require('mysql'),
    parameters = require('../../config/parameters'),
    env = process.env.NODE_ENV;
let connection = null;

function connect()
{
    connection = mysql.createConnection({
        host: parameters.db_host,
        user: parameters.db_username,
        password: parameters.db_password,
        database: parameters.db_name
    });
}

function disconnect()
{
    connection.end();
}

function findBy(table, wheres = null, limit = null)
{
    let criterion,
        where = '',
        criteria = [];

    if (env === 'test') {
        table = `${table}_test`;
    }

    if (wheres !== null) {
        for (criterion in wheres) {
            criteria.push(`${criterion}='${wheres[criterion]}'`);
        }
        where = `WHERE ${criteria.join(' AND ')}`;
    }

    limit = (limit === null) ? '' : `LIMIT ${parseInt(limit)}`;

    connect();
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} ${where} ${limit}`, (error, rows) => {
            disconnect();
            if (error) {
                return reject(error);
            }
            resolve(rows);
        });
    });
}

function insert(table, wheres)
{
    if (env === 'test') {
        table = `${table}_test`;
    }

    connect();
    connection.query(`INSERT INTO ${table} SET ?`, wheres);
    disconnect();
}

function update(table, values, wheres = null)
{
    let criterion,
        where = '',
        criteria = [];

    if (env === 'test') {
        table = `${table}_test`;
    }

    if (wheres !== null) {
        for (criterion in wheres) {
            criteria.push(`${criterion}='${wheres[criterion]}'`);
        }
        where = `WHERE ${criteria.join(' AND ')}`;
    }

    connection.query(`UPDATE ${table} SET ? ${where}`, values);
}

function remove(table, values = null)
{
    let value,
        where = '',
        criteria = [];

    if (env === 'test') {
        table = `${table}_test`;
    }

    if (values !== null) {
        for (value in values) {
            criteria.push(`${value}='${values[value]}'`);
        }
        where = `WHERE ${criteria.join(' AND ')}`;
    }

    connect();
    connection.query(`DELETE FROM ${table} ${where}`, (error) => {
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
