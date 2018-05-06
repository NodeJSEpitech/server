const chai = require('chai'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

describe('Security checker', () => {
    it('should fail because token is missing', (done) => {
        chai
            .request(server)
            .get('/me')
            .end((error, response) => {
                if (error) {
                    throw error;
                }
                response.should.be.a('object');
                response.should.have.property('body');
                response.body.should.be.a('object');
                response.body.should.have.property('message');
                response.body.message.should.be.equal(messages.error.security.missing_token);
                response.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should fail because token is invalid', (done) => {
        const token = 'ThisIsABadToken';
        chai
            .request(server)
            .get('/me')
            .set('x-authentication-token', token)
            .end((error, response) => {
                if (error) {
                    throw error;
                }
                response.should.be.a('object');
                response.should.have.property('body');
                response.body.should.be.a('object');
                response.body.should.have.property('message');
                response.body.message.should.be.equal(messages.error.security.unauthorized);
                response.should.have.status(status.ko.unauthorized);
                done();
            });
    });

    it('should succeed and return a welcome message as authenticated user', (done) => {
        const user = {
            'username': '0301username',
            'firstname': '0301firstname',
            'lastname': '0301lastname',
            'email': '0301@email.com',
            'password': '0301Password!',
            'passwordConfirmation': '0301Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '0301username',
                    'password': '0301Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token;
                        chai
                            .request(server)
                            .get('/me')
                            .set('x-authentication-token', token)
                            .end((error2, response2) => {
                                if (error2) {
                                    throw error2;
                                }
                                response2.should.be.a('object');
                                response2.should.have.property('body');
                                response2.body.should.be.a('object');
                                response2.body.should.have.property('message');
                                response2.body.message.should.be.equal(messages.success.welcome.auth);
                                response2.body.should.have.property('data');
                                response2.body.data.should.be.a('object');
                                response2.body.data.should.have.property('id');
                                response2.body.data.id.should.be.a('number');
                                response2.body.data.should.have.property('username');
                                response2.body.data.username.should.be.equal(user.username);
                                response2.body.data.should.have.property('firstname');
                                response2.body.data.firstname.should.be.equal(user.firstname);
                                response2.body.data.should.have.property('lastname');
                                response2.body.data.lastname.should.be.equal(user.lastname);
                                response2.body.data.should.have.property('email');
                                response2.body.data.email.should.be.equal(user.email);
                                response2.body.data.should.have.property('password');
                                response2.body.data.password.should.be.equal('hidden');
                                response2.body.data.should.have.property('avatar');
                                (response2.body.data.avatar === null).should.equal(true);
                                response2.body.data.should.have.property('is_administrator');
                                response2.body.data.is_administrator.should.be.equal(0);
                                response2.body.data.should.have.property('is_authenticated');
                                response2.body.data.is_authenticated.should.be.equal(1);
                                response2.body.data.should.have.property('created_at');
                                response2.body.data.should.have.property('deleted_at');
                                (response2.body.data.deleted_at === null).should.equal(true);
                                response2.should.have.status(status.ok);
                                done();
                            });
                    });
            });
    });
});
