const {connection} = require('./src/middleware/database'),
    database = require('./src/service/database');

database
    .remove('post', null, false)
    .then(() => {
        database
            .remove('user', null, false)
            .then(() => {
                connection.end();
            });
    })
    .catch(() => {
        connection.end();
    });
