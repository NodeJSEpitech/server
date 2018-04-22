const {connection} = require('./src/middleware/database'),
    database = require('./src/service/database');

database
    .remove('user')
    .then(() => connection.end())
    .catch(() => connection.end());
