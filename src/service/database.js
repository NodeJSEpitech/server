const {connection} = require('../middleware/database'),
    env = process.env.NODE_ENV; // eslint-disable-line no-undef

function getFinalTable(table) {
    return env === 'test' ? `${table}_test` : table;
}

function findBy(table, where = null, limit = null, orderBy = null, softdeletable = true) {
    const finalTable = getFinalTable(table);
    let criteria = [],
        criterion = null,
        finalWhere = '',
        finalLimit = '',
        finalOrderBy = '';

    if (softdeletable === true) {
        finalWhere = where === null ? 'WHERE deleted_at IS NULL' : 'deleted_at IS NULL AND ';
    }
    if (where !== null) {
        if (typeof where === 'object') {
            for (criterion in where) {
                criteria.push(`${criterion}='${where[criterion]}'`);
            }
            finalWhere = `WHERE ${finalWhere} (${criteria.join(' AND ')})`;
        } else if (typeof where === 'string') {
            finalWhere = `WHERE ${finalWhere} (${where})`;
        }
    }
    if (limit !== null) {
        finalLimit = `LIMIT ${parseInt(limit, 10)}`;
    }
    if (orderBy !== null && typeof orderBy === 'object') {
        criteria = [];
        for (criterion in orderBy) {
            criteria.push(`${criterion} ${orderBy[criterion]}`);
        }
        if (criteria.length > 0) {
            finalOrderBy = `ORDER BY ${criteria.join(', ')}`;
        }
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

function update(table, values, where = null, softdeletable = true) {
    const criteria = [],
        finalTable = getFinalTable(table);
    let criterion = null,
        finalWhere = '';

    if (softdeletable === true) {
        finalWhere = where === null ? 'WHERE deleted_at IS NULL' : 'deleted_at IS NULL AND ';
    }
    if (where !== null) {
        if (typeof where === 'object') {
            for (criterion in where) {
                criteria.push(`${criterion}='${where[criterion]}'`);
            }
            finalWhere = `WHERE ${finalWhere} (${criteria.join(' AND ')})`;
        } else if (typeof where === 'string') {
            finalWhere = `WHERE ${finalWhere} (${where})`;
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

function remove(table, where = null, softdeletable = true) {
    const criteria = [],
        finalTable = getFinalTable(table);
    let criterion = null,
        finalWhere = '',
        sql = '';

    if (where !== null) {
        if (typeof where === 'object') {
            for (criterion in where) {
                criteria.push(`${criterion}='${where[criterion]}'`);
            }
            finalWhere = `WHERE ${criteria.join(' AND ')}`;
        } else if (typeof where === 'string') {
            finalWhere = `WHERE ${where}`;
        }
    }
    if (softdeletable === true) {
        sql = `UPDATE ${finalTable} SET deleted_at = CURRENT_TIMESTAMP() ${finalWhere}`;
    } else {
        sql = `DELETE FROM ${finalTable} ${finalWhere}`;
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, (error, rows) => {
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
