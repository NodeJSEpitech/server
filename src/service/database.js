const {connection} = require('../middleware/database'),
    env = process.env.NODE_ENV; // eslint-disable-line no-undef

function getFinalTable(table) {
    return env === 'test' ? `${table}_test` : table;
}

function findBy(table, where = null, limit = null, orderBy = null) {
    const criteria = [],
        finalTable = getFinalTable(table);
    let criterion = null,
        finalWhere = finalOrderBy = finalLimit = '';

    if (where !== null) {
        if (isObject(where) === true) {
            for (criterion in where) {
                criteria.push(`${criterion}='${where[criterion]}'`);
            }
            finalWhere = `WHERE ${criteria.join(' AND ')}`;
        } else if (typeof where === 'string') {
            finalWhere = `WHERE ${where}`;
        }
    }

    if (limit !== null) {
        finalLimit = `LIMIT ${parseInt(limit, 10)}`;
    }

    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${finalTable} ${finalWhere} ${finalLimit} ${finalOrderBy}`, (error, rows) => {
            if (error) {
                return reject(error);
            }
            return resolve(rows);
        });
    });
}

function insert(table, values) {
    const finalTable = getFinalTable(table);

    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${finalTable} SET ?`, values, (error, rows) => {
            if (error) {
                return reject(error);
            }
            return resolve(rows);
        });
    });
}

function update(table, values, where = null) {
    const criteria = [],
        finalTable = getFinalTable(table);
    let criterion = null,
        finalWhere = '';

    if (where !== null) {
        if (isObject(where) === true) {
            for (criterion in where) {
                criteria.push(`${criterion}='${where[criterion]}'`);
            }
            finalWhere = `WHERE ${criteria.join(' AND ')}`;
        } else if (typeof where === 'string') {
            finalWhere = `WHERE ${where}`;
        }
    }

    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${finalTable} SET ? ${finalWhere}`, values, (error, rows) => {
            if (error) {
                return reject(error);
            }
            return resolve(rows);
        });
    });
}

function remove(table, where = null) {
    const criteria = [],
        finalTable = getFinalTable(table);
    let value = null,
        finalWhere = '';

    if (where !== null) {
        if (isObject(where) === true) {
            for (criterion in where) {
                criteria.push(`${criterion}='${where[criterion]}'`);
            }
            finalWhere = `WHERE ${criteria.join(' AND ')}`;
        } else if (typeof where === 'string') {
            finalWhere = `WHERE ${where}`;
        }
    }

    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${finalTable} ${finalWhere}`, (error, rows) => {
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
