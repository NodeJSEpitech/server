const chai = require('chai'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

describe('Security logging out', () => {
    it('should successfully log out user and fail when trying to get user information', (done) => {
        const user = {
            'username': '0401username',
            'firstname': '0401firstname',
            'lastname': '0401lastname',
            'email': '0401@email.com',
            'password': '0401Password!',
            'passwordConfirmation': '0401Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '0401username',
                    'password': '0401Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token;
                        chai
                            .request(server)
                            .get('/logout')
                            .set('x-authentication-token', token)
                            .end((error2, response2) => {
                                if (error2) {
                                    throw error2;
                                }
                                response2.should.be.a('object');
                                response2.should.have.property('body');
                                response2.body.should.be.a('object');
                                response2.body.should.have.property('message');
                                response2.body.message.should.be.equal(messages.success.security.logout);
                                response2.should.have.status(status.ok);
                                chai
                                    .request(server)
                                    .get('/me')
                                    .set('x-authentication-token', token)
                                    .end((error3, response3) => {
                                        response3.should.be.a('object');
                                        response3.should.have.property('body');
                                        response3.body.should.be.a('object');
                                        response3.body.should.have.property('message');
                                        response3.body.message.should.be.equal(messages.error.security.unauthorized);
                                        response3.should.have.status(status.ko.unauthorized);
                                        done();
                                    });
                            });
                    });
            });
    });
});
