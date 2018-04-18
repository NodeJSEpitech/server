process.env.NODE_ENV = 'test';

const chai = require('chai'),
    should = chai.should(),
    chaitHttp = require('chai-http'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables'),
    globals = {
        'user': {
            'id': null,
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@email.com',
            'password': 'EpiBlog42!',
        },
        'token': null
    };

chai.use(chaitHttp);

describe('User creation :', function() {

    it('should fail because username is missing', function(done) {
        const user = {};
        chai
            .request(server)
            .post('/users')
            .set(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_parameter.replace('%parameter%', 'username'));
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because firstname is missing', function(done) {
        const user = {
            'username': 'Jodo'
        };
        chai
            .request(server)
            .post('/users')
            .send(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_parameter.replace('%parameter%', 'firstname'));
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because lastname is missing', function(done) {
        const user = {
            'username': 'Jodo',
            'firstname': 'John'
        };
        chai
            .request(server)
            .post('/users')
            .send(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_parameter.replace('%parameter%', 'lastname'));
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because email is missing', function(done) {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe'
        };
        chai
            .request(server)
            .post('/users')
            .send(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_parameter.replace('%parameter%', 'email'));
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because email is invalid', function(done) {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'bademail'
        };
        chai
            .request(server)
            .post('/users')
            .send(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.invalid_email);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because password is missing', function(done) {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@email.com'
        };
        chai
            .request(server)
            .post('/users')
            .send(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_parameter.replace('%parameter%', 'password'));
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because password is too weak', function(done) {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@email.com',
            'password': 'EpiBlog42'
        };
        chai
            .request(server)
            .post('/users')
            .send(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.invalid_password);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because confirmation password is missing', function(done) {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@email.com',
            'password': 'EpiBlog42!'
        };
        chai
            .request(server)
            .post('/users')
            .send(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_parameter.replace('%parameter%', 'passwordConfirmation'));
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because confirmation password does not match password', function(done) {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@email.com',
            'password': 'EpiBlog42!',
            'passwordConfirmation': 'EpiBlog21'
        };
        chai
            .request(server)
            .post('/users')
            .send(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.password_confirmation);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should be successful', function(done) {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@email.com',
            'password': 'EpiBlog42!',
            'passwordConfirmation': 'EpiBlog42!'
        };
        chai
            .request(server)
            .post('/users')
            .send(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.success.user.create);
                res.should.have.status(status.ok);
                done();
            });
    });

    it('should fail because username already exists', function(done) {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@email.com',
            'password': 'EpiBlog42!',
            'passwordConfirmation': 'EpiBlog42!'
        };
        chai
            .request(server)
            .post('/users')
            .send(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.username_exists);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because email already exists', function(done) {
        const user = {
            'username': 'Jodo2',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@email.com',
            'password': 'EpiBlog42!',
            'passwordConfirmation': 'EpiBlog42!'
        };
        chai
            .request(server)
            .post('/users')
            .send(user)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.email_exists);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });
});


describe('Authentication :', function() {

    it('should fail because username or password is missing, username does not exist, or wrong password', function(done) {
        const credentials = {
            'username': 'Jodo',
            'password': 'EpiBlog42'
        };
        chai
            .request(server)
            .post('/authenticate')
            .send(credentials)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.security.bad_credentials);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should be successfull and return a json web token', function(done) {
        const credentials = {
            'username': 'Jodo',
            'password': 'EpiBlog42!'
        };
        chai
            .request(server)
            .post('/authenticate')
            .send(credentials)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.success.security.authenticated);
                res.body.should.have.property('data');
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('token');
                res.should.have.status(status.ok);
                globals.token = res.body.data.token;
                done();
            });
    });

});

describe('Getting my information :', function() {

    it('should fail because token is missing', function(done) {
        chai
            .request(server)
            .post('/me')
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.security.missing_token);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because token is wrong', function(done) {
        const token = {
            'token': 'badtoken'
        };
        chai
            .request(server)
            .post('/me')
            .send(token)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.security.unauthorized);
                res.should.have.status(status.ko.unauthorized);
                done();
            });
    });

    it('should be successfull', function(done) {
        chai
            .request(server)
            .get('/me')
            .send({'token': globals.token})
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.success.welcome.auth);
                res.body.should.have.property('data');
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('username');
                res.body.data.username.should.be.equal(globals.user.username);
                res.body.data.should.have.property('firstname');
                res.body.data.firstname.should.be.equal(globals.user.firstname);
                res.body.data.should.have.property('lastname');
                res.body.data.lastname.should.be.equal(globals.user.lastname);
                res.body.data.should.have.property('email');
                res.body.data.email.should.be.equal(globals.user.email);
                res.body.data.should.have.property('password');
                res.body.data.password.should.be.equal('hidden');
                res.should.have.status(status.ok);
                done();
            });
    });
});

describe.skip('Updating user profile :', function() {

    it('should fail because field is missing', function(done) {
        chai
            .request(server)
            .patch('/users')
            .send(token)
            .end(function(err, res) {
                if (err) throw err;
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.security.unauthorized);
                res.should.have.status(status.ko.unauthorized);
                done();
            });
    });

});
