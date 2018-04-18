process.env.NODE_ENV = 'test';

const chai = require('chai'),
    should = chai.should(),
    chaitHttp = require('chai-http'),
    server = require('../../src/server'),
    {status, messages} = require('../../config/variables');

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
                res.should.have.status(status.ko.badrequest);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_field.replace('%field%', 'username'));
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
                res.should.have.status(status.ko.badrequest);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_field.replace('%field%', 'firstname'));
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
                res.should.have.status(status.ko.badrequest);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_field.replace('%field%', 'lastname'));
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
                res.should.have.status(status.ko.badrequest);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_field.replace('%field%', 'email'));
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
                res.should.have.status(status.ko.badrequest);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.invalid_email);
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
                res.should.have.status(status.ko.badrequest);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_field.replace('%field%', 'password'));
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
                res.should.have.status(status.ko.badrequest);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.invalid_password);
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
                res.should.have.status(status.ko.badrequest);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.missing_field.replace('%field%', 'passwordConfirmation'));
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
                res.should.have.status(status.ko.badrequest);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.password_confirmation);
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
                res.should.have.status(status.ok);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.success.user.create);
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
                res.should.have.status(status.ko.badrequest);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.username_exists);
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
                res.should.have.status(status.ko.badrequest);
                res.should.be.a('object');
                res.should.have.property('body');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.equal(messages.error.user.create.email_exists);
                done();
            });
    });
});


describe('Getting my information :', function() {

    it('should be successful', function(done) {
        done();
    });
});
