const chai = require('chai'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

describe('User removing', () => {
    it('should fail because user is not administrator', (done) => {
        const user = {
            'username': '0701username',
            'firstname': '0701firstname',
            'lastname': '0701lastname',
            'email': '0701@email.com',
            'password': '0701Password!',
            'passwordConfirmation': '0701Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((error1, response1) => {
                const userId = response1.body.data.id,
                    credentials = {
                        'username': '0701username',
                        'password': '0701Password!'
                    };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error2, response2) => {
                        const token = response2.body.data.token;
                        chai
                            .request(server)
                            .delete(`/user/${userId + 1}`)
                            .set('x-authentication-token', token)
                            .end((error3, response3) => {
                                if (error3) {
                                    throw error3;
                                }
                                response3.should.be.a('object');
                                response3.should.have.property('body');
                                response3.body.should.be.a('object');
                                response3.body.should.have.property('message');
                                response3.body.message.should.be.equal(messages.error.user.remove.not_administrator);
                                response3.should.have.status(status.ko.unauthorized);
                                done();
                            });
                    });
            });
    });

    it('should successfully remove user account', (done) => {
        const user = {
            'username': '0702username',
            'firstname': '0702firstname',
            'lastname': '0702lastname',
            'email': '0702@email.com',
            'password': '0702Password!',
            'passwordConfirmation': '0702Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((error1, response1) => {
                const userId = response1.body.data.id,
                    credentials = {
                        'username': '0702username',
                        'password': '0702Password!'
                    };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error2, response2) => {
                        const token = response2.body.data.token;
                        chai
                            .request(server)
                            .delete(`/user/${userId}`)
                            .set('x-authentication-token', token)
                            .end((error3, response3) => {
                                if (error3) {
                                    throw error3;
                                }
                                response3.should.be.a('object');
                                response3.should.have.property('body');
                                response3.body.should.be.a('object');
                                response3.body.should.have.property('message');
                                response3.body.message.should.be.equal(messages.success.user.remove);
                                response3.should.have.status(status.ok);
                                chai
                                    .request(server)
                                    .get('/me')
                                    .set('x-authentication-token', token)
                                    .end((error4, response4) => {
                                        if (error4) {
                                            throw error4;
                                        }
                                        response4.should.be.a('object');
                                        response4.should.have.property('body');
                                        response4.body.should.be.a('object');
                                        response4.body.should.have.property('message');
                                        response4.body.message.should.be.equal(messages.error.security.unauthorized);
                                        response4.should.have.status(status.ko.unauthorized);
                                        done();
                                    });
                            });
                    });
            });
    });
});
