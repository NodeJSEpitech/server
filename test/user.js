const chai = require('chai'),
    should = chai.should(), // eslint-disable-line no-unused-vars
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
            'password': 'EpiBlog42!'
        },
        'token': null
    };

chai.use(chaitHttp);

describe('User creation :', () => {
    it('should fail because username is missing', (done) => {
        const user = {};
        chai
            .request(server)
            .post('/user')
            .set(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.bad_parameter);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because firstname is missing', (done) => {
        const user = {
            'username': 'Jodo'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.bad_parameter);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because lastname is missing', (done) => {
        const user = {
            'username': 'Jodo',
            'firstname': 'John'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.bad_parameter);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because email is missing', (done) => {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.bad_parameter);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because email is invalid', (done) => {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'bademail'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.bad_parameter);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because password is missing', (done) => {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@email.com'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.bad_parameter);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because password is too weak', (done) => {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@email.com',
            'password': 'EpiBlog42'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.bad_parameter);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because confirmation password is missing', (done) => {
        const user = {
            'username': 'Jodo',
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@email.com',
            'password': 'EpiBlog42!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.bad_parameter);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because confirmation password does not match password', (done) => {
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
            .post('/user')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.bad_parameter);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should be successful', (done) => {
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
            .post('/user')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.success.user.create);
                res.should.have.status(status.ok);
                done();
            });
    });

    it('should fail because username already exists', (done) => {
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
            .post('/user')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.username_exists);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because email already exists', (done) => {
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
            .post('/user')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
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


describe('Authentication :', () => {
    it('should fail because username or password is missing, username does not exist, or wrong password', (done) => {
        const credentials = {
            'username': 'Jodo',
            'password': 'EpiBlog42'
        };
        chai
            .request(server)
            .post('/authenticate')
            .send(credentials)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.security.bad_credentials);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should be successfull and return a json web token', (done) => {
        const credentials = {
            'username': 'Jodo',
            'password': 'EpiBlog42!'
        };
        chai
            .request(server)
            .post('/authenticate')
            .send(credentials)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
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

describe('Getting my information :', () => {
    it('should fail because token is missing', (done) => {
        chai
            .request(server)
            .get('/me')
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.security.missing_token);
                res.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because token is wrong', (done) => {
        const token = 'badtoken';
        chai
            .request(server)
            .get('/me')
            .set('x-authentication-token', token)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.security.unauthorized);
                res.should.have.status(status.ko.unauthorized);
                done();
            });
    });

    it('should be successfull', (done) => {
        chai
            .request(server)
            .get('/me')
            .set('x-authentication-token', globals.token)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
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

describe.skip('Updating user profile :', () => {
    it('should fail because field is missing', (done) => {
        chai
            .request(server)
            .patch('/user')
            .send(globals.token)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
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
