const chai = require('chai'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

describe('User update', () => {
    it('should fail because of a bad parameter', (done) => {
        const user = {
            'username': '0601username',
            'firstname': '0601firstname',
            'lastname': '0601lastname',
            'email': '0601@email.com',
            'password': '0601Password!',
            'passwordConfirmation': '0601Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((error1, response1) => {
                const userId = response1.body.data.id,
                    credentials = {
                        'username': '0601username',
                        'password': '0601Password!'
                    };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error2, response2) => {
                        const token = response2.body.data.token,
                            data = {'value': '0601firstname2'};
                        chai
                            .request(server)
                            .patch(`/user/${userId}`)
                            .send(data)
                            .set('x-authentication-token', token)
                            .end((error3, response3) => {
                                if (error3) {
                                    throw error3;
                                }
                                response3.should.be.a('object');
                                response3.should.have.property('body');
                                response3.body.should.be.a('object');
                                response3.body.should.have.property('message');
                                response3.body.message.should.be.equal(messages.error.user.update.bad_parameter);
                                response3.should.have.status(status.ko.badrequest);
                                done();
                            });
                    });
            });
    });

    it('should fail because user is not administrator', (done) => {
        const user = {
            'username': '0602username',
            'firstname': '0602firstname',
            'lastname': '0602lastname',
            'email': '0602@email.com',
            'password': '0602Password!',
            'passwordConfirmation': '0602Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((error1, response1) => {
                const userId = response1.body.data.id,
                    credentials = {
                        'username': '0602username',
                        'password': '0602Password!'
                    };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error2, response2) => {
                        const token = response2.body.data.token,
                            data = {
                                'field': 'firstname',
                                'value': '0602firstname2'
                            };
                        chai
                            .request(server)
                            .patch(`/user/${userId + 1}`)
                            .send(data)
                            .set('x-authentication-token', token)
                            .end((error3, response3) => {
                                if (error3) {
                                    throw error3;
                                }
                                response3.should.be.a('object');
                                response3.should.have.property('body');
                                response3.body.should.be.a('object');
                                response3.body.should.have.property('message');
                                response3.body.message.should.be.equal(messages.error.user.update.not_administrator);
                                response3.should.have.status(status.ko.unauthorized);
                                done();
                            });
                    });
            });
    });

    it('should successfully change user firstname', (done) => {
        const user = {
            'username': '0603username',
            'firstname': '0603firstname',
            'lastname': '0603lastname',
            'email': '0603@email.com',
            'password': '0603Password!',
            'passwordConfirmation': '0603Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((error1, response1) => {
                const userId = response1.body.data.id,
                    credentials = {
                        'username': '0603username',
                        'password': '0603Password!'
                    };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error2, response2) => {
                        const token = response2.body.data.token,
                            data = {
                                'field': 'firstname',
                                'value': '0603firstname2'
                            };
                        chai
                            .request(server)
                            .patch(`/user/${userId}`)
                            .send(data)
                            .set('x-authentication-token', token)
                            .end((error3, response3) => {
                                if (error3) {
                                    throw error3;
                                }
                                response3.should.be.a('object');
                                response3.should.have.property('body');
                                response3.body.should.be.a('object');
                                response3.body.should.have.property('message');
                                response3.body.message.should.be.equal(messages.success.user.update);
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
                                        response4.body.message.should.be.equal(messages.success.welcome.auth);
                                        response4.body.should.have.property('data');
                                        response4.body.data.should.be.a('object');
                                        response4.body.data.should.have.property('id');
                                        response4.body.data.username.should.be.equal(user.username);
                                        response4.body.data.should.have.property('username');
                                        response4.body.data.username.should.be.equal(user.username);
                                        response4.body.data.should.have.property('firstname');
                                        response4.body.data.firstname.should.be.equal(data.value);
                                        response4.body.data.should.have.property('lastname');
                                        response4.body.data.lastname.should.be.equal(user.lastname);
                                        response4.body.data.should.have.property('email');
                                        response4.body.data.email.should.be.equal(user.email);
                                        response4.body.data.should.have.property('password');
                                        response4.body.data.password.should.be.equal('hidden');
                                        response4.body.data.should.have.property('avatar');
                                        (response4.body.data.avatar === null).should.be.equal(true);
                                        response4.body.data.should.have.property('is_administrator');
                                        response4.body.data.is_administrator.should.be.equal(0);
                                        response4.body.data.should.have.property('is_authenticated');
                                        response4.body.data.is_authenticated.should.be.equal(1);
                                        response4.body.data.should.have.property('created_at');
                                        response4.body.data.should.have.property('deleted_at');
                                        (response4.body.data.deleted_at === null).should.be.equal(true);
                                        response4.should.have.status(status.ok);
                                        done();
                                    });
                            });
                    });
            });
    });
});
