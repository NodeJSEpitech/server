process.env.NODE_ENV = 'test';

const database = require('../src/model/database');

database.remove('user');
