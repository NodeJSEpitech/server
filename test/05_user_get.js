const chai = require('chai'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

describe('User get', () => {
    it('should fail because user is not administrator', (done) => {
        const user = {
            'username': '0501username',
            'firstname': '0501firstname',
            'lastname': '0501lastname',
            'email': '0501@email.com',
            'password': '0501Password!',
            'passwordConfirmation': '0501Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((error1, response1) => {
                const userId = response1.body.data.id,
                    credentials = {
                        'username': '0501username',
                        'password': '0501Password!'
                    };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error2, response2) => {
                        const token = response2.body.data.token;
                        chai
                            .request(server)
                            .get(`/user/${userId + 1}`)
                            .set('x-authentication-token', token)
                            .end((error3, response3) => {
                                if (error3) {
                                    throw error3;
                                }
                                response3.should.be.a('object');
                                response3.should.have.property('body');
                                response3.body.should.be.a('object');
                                response3.body.should.have.property('message');
                                response3.body.message.should.be.equal(messages.error.user.get.unauthorized);
                                response3.should.have.status(status.ko.unauthorized);
                                done();
                            });
                    });
            });
    });

    it('should succeed and return the user information', (done) => {
        const user = {
            'username': '0502username',
            'firstname': '0502firstname',
            'lastname': '0502lastname',
            'email': '0502@email.com',
            'password': '0502Password!',
            'passwordConfirmation': '0502Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((error1, response1) => {
                const userId = response1.body.data.id,
                    credentials = {
                        'username': '0502username',
                        'password': '0502Password!'
                    };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error2, response2) => {
                        const token = response2.body.data.token;
                        chai
                            .request(server)
                            .get(`/user/${userId}`)
                            .set('x-authentication-token', token)
                            .end((error3, response3) => {
                                if (error3) {
                                    throw error3;
                                }
                                response3.should.be.a('object');
                                response3.should.have.property('body');
                                response3.body.should.be.a('object');
                                response3.body.should.have.property('message');
                                response3.body.message.should.be.equal(messages.success.user.get);
                                response3.body.should.have.property('data');
                                response3.body.data.should.be.a('object');
                                response3.body.data.should.have.property('id');
                                response3.body.data.username.should.be.equal(user.username);
                                response3.body.data.should.have.property('username');
                                response3.body.data.username.should.be.equal(user.username);
                                response3.body.data.should.have.property('firstname');
                                response3.body.data.firstname.should.be.equal(user.firstname);
                                response3.body.data.should.have.property('lastname');
                                response3.body.data.lastname.should.be.equal(user.lastname);
                                response3.body.data.should.have.property('email');
                                response3.body.data.email.should.be.equal(user.email);
                                response3.body.data.should.have.property('password');
                                response3.body.data.password.should.be.equal('hidden');
                                response3.body.data.should.have.property('avatar');
                                (response3.body.data.avatar === null).should.be.equal(true);
                                response3.body.data.should.have.property('is_administrator');
                                response3.body.data.is_administrator.should.be.equal(0);
                                response3.body.data.should.have.property('is_authenticated');
                                response3.body.data.is_authenticated.should.be.equal(1);
                                response3.body.data.should.have.property('created_at');
                                response3.body.data.should.have.property('deleted_at');
                                (response3.body.data.deleted_at === null).should.be.equal(true);
                                response3.should.have.status(status.ok);
                                done();
                            });
                    });
            });
    });
});
