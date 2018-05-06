const chai = require('chai'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

describe('Post removing', () => {
    it('should fail because post does not exist (or user not the creator)', (done) => {
        const user = {
            'username': '1101username',
            'firstname': '1101firstname',
            'lastname': '1101lastname',
            'email': '1101@email.com',
            'password': '1101Password!',
            'passwordConfirmation': '1101Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '1101username',
                    'password': '1101Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            post = {
                                'title': '1101Title',
                                'description': '1101Description',
                                'content': '1101Content'
                            };
                        chai
                            .request(server)
                            .post('/post')
                            .send(post)
                            .set('x-authentication-token', token)
                            .end((error2, response2) => {
                                const postId = response2.body.data.id;
                                chai
                                    .request(server)
                                    .delete(`/post/${postId + 1}`)
                                    .set('x-authentication-token', token)
                                    .end((error3, response3) => {
                                        if (error3) {
                                            throw error3;
                                        }
                                        response3.should.be.a('object');
                                        response3.should.have.property('body');
                                        response3.body.should.be.a('object');
                                        response3.body.should.have.property('message');
                                        response3.body.message.should.be.equal(messages.error.post.remove.bad_parameter);
                                        response3.should.have.status(status.ko.badrequest);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should successfully remove post', (done) => {
        const user = {
            'username': '1102username',
            'firstname': '1102firstname',
            'lastname': '1102lastname',
            'email': '1102@email.com',
            'password': '1102Password!',
            'passwordConfirmation': '1102Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '1102username',
                    'password': '1102Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            post = {
                                'title': '1102Title',
                                'description': '1102Description',
                                'content': '1102Content'
                            };
                        chai
                            .request(server)
                            .post('/post')
                            .send(post)
                            .set('x-authentication-token', token)
                            .end((error2, response2) => {
                                const postId = response2.body.data.id;
                                chai
                                    .request(server)
                                    .delete(`/post/${postId}`)
                                    .set('x-authentication-token', token)
                                    .end((error3, response3) => {
                                        if (error3) {
                                            throw error3;
                                        }
                                        response3.should.be.a('object');
                                        response3.should.have.property('body');
                                        response3.body.should.be.a('object');
                                        response3.body.should.have.property('message');
                                        response3.body.message.should.be.equal(messages.success.post.remove);
                                        response3.should.have.status(status.ok);
                                        chai
                                            .request(server)
                                            .get(`/post/${postId}`)
                                            .end((error4, response4) => {
                                                response4.should.be.a('object');
                                                response4.should.have.property('body');
                                                response4.body.should.be.a('object');
                                                response4.body.should.have.property('message');
                                                response4.body.message.should.be.equal(messages.error.post.get.not_found);
                                                response4.should.have.status(status.ko.badrequest);
                                                done();
                                            });
                                    });
                            });
                    });
            });
    });
});
