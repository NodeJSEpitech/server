const chai = require('chai'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

describe('Security authentication', () => {
    it('should fail because username or password is missing (bad credentials message)', (done) => {
        const credentials = {
            'password': '0201Password!'
        };
        chai
            .request(server)
            .post('/authenticate')
            .send(credentials)
            .end((error, response) => {
                if (error) {
                    throw error;
                }
                response.should.be.a('object');
                response.should.have.property('body');
                response.body.should.be.a('object');
                response.body.should.have.property('message');
                response.body.message.should.be.equal(messages.error.security.bad_credentials);
                response.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because username not found (bad credentials message)', (done) => {
        const credentials = {
            'username': '0201username',
            'password': '0201Password!'
        };
        chai
            .request(server)
            .post('/authenticate')
            .send(credentials)
            .end((error, response) => {
                if (error) {
                    throw error;
                }
                response.should.be.a('object');
                response.should.have.property('body');
                response.body.should.be.a('object');
                response.body.should.have.property('message');
                response.body.message.should.be.equal(messages.error.security.bad_credentials);
                response.should.have.status(status.ko.badrequest);
                done();
            });
    });


    it('should fail because passwords does not match (bad credentials message)', (done) => {
        const credentials = {
                'username': '0201username',
                'password': '0201Password!!'
            },
            user = {
                'username': '0201username',
                'firstname': '0201firstname',
                'lastname': '0201lastname',
                'email': '0201@email.com',
                'password': '0201Password!',
                'passwordConfirmation': '0201Password!'
            };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error, response) => {
                        if (error) {
                            throw error;
                        }
                        response.should.be.a('object');
                        response.should.have.property('body');
                        response.body.should.be.a('object');
                        response.body.should.have.property('message');
                        response.body.message.should.be.equal(messages.error.security.bad_credentials);
                        response.should.have.status(status.ko.badrequest);
                        done();
                    });
            });
    });

    it('should authenticate user and return a json web token', (done) => {
        const credentials = {
                'username': '0202username',
                'password': '0202Password!'
            },
            user = {
                'username': '0202username',
                'firstname': '0202firstname',
                'lastname': '0202lastname',
                'email': '0202@email.com',
                'password': '0202Password!',
                'passwordConfirmation': '0202Password!'
            };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error, response) => {
                        if (error) {
                            throw error;
                        }
                        response.should.be.a('object');
                        response.should.have.property('body');
                        response.body.should.be.a('object');
                        response.body.should.have.property('message');
                        response.body.message.should.be.equal(messages.success.security.authenticated);
                        response.body.should.have.property('data');
                        response.body.data.should.be.a('object');
                        response.body.data.should.have.property('token');
                        response.should.have.status(status.ok);
                        done();
                    });
            });
    });
});
