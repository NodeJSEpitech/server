const {connection} = require('../middleware/database'),
    env = process.env.NODE_ENV; // eslint-disable-line no-undef

function getFinalTable(table) {
    return env === 'test' ? `${table}_test` : table;
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

    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${finalTable} ${where} ${finalLimit}`, (error, rows) => {
            if (error) {
                return reject(error);
            }
            return resolve(rows);
        });
    });
}

function insert(table, wheres) {
    const finalTable = getFinalTable(table);

    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${finalTable} SET ?`, wheres, (error, rows) => {
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

    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${finalTable} SET ? ${where}`, values, (error, rows) => {
            if (error) {
                return reject(error);
            }
            return resolve(rows);
        });
    });
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

    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${finalTable} ${where}`, (error, rows) => {
            if (error) {
                return reject(error);
            }
            return resolve(rows);
        });
    });
}

module.exports = {
    "findBy": findBy,
    "insert": insert,
    "update": update,
    "remove": remove
};
