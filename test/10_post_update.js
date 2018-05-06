const chai = require('chai'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

describe('Post updating', () => {
    it('should fail because of a bad parameter', (done) => {
        const user = {
            'username': '1001username',
            'firstname': '1001firstname',
            'lastname': '1001lastname',
            'email': '1001@email.com',
            'password': '1001Password!',
            'passwordConfirmation': '1001Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '1001username',
                    'password': '1001Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            post = {
                                'title': '1001Title',
                                'description': '1001Description',
                                'content': '1001Content'
                            };
                        chai
                            .request(server)
                            .post('/post')
                            .send(post)
                            .set('x-authentication-token', token)
                            .end((error2, response2) => {
                                const postId = response2.body.data.id,
                                    data = {'value': '1001Title2'};
                                chai
                                    .request(server)
                                    .patch(`/post/${postId}`)
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
                                        response3.body.message.should.be.equal(messages.error.post.update.bad_parameter);
                                        response3.should.have.status(status.ko.badrequest);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should fail because post does not exist (bad parameter message)', (done) => {
        const user = {
            'username': '1002username',
            'firstname': '1002firstname',
            'lastname': '1002lastname',
            'email': '1002@email.com',
            'password': '1002Password!',
            'passwordConfirmation': '1002Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '1002username',
                    'password': '1002Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            post = {
                                'title': '1002Title',
                                'description': '1002Description',
                                'content': '1002Content'
                            };
                        chai
                            .request(server)
                            .post('/post')
                            .send(post)
                            .set('x-authentication-token', token)
                            .end((error2, response2) => {
                                const postId = response2.body.data.id,
                                    data = {
                                        'field': 'title',
                                        'value': '1002Title2'
                                    };
                                chai
                                    .request(server)
                                    .patch(`/post/${postId + 1}`)
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
                                        response3.body.message.should.be.equal(messages.error.post.update.bad_parameter);
                                        response3.should.have.status(status.ko.badrequest);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should successfully update title post value', (done) => {
        const user = {
            'username': '1003username',
            'firstname': '1003firstname',
            'lastname': '1003lastname',
            'email': '1003@email.com',
            'password': '1003Password!',
            'passwordConfirmation': '1003Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '1003username',
                    'password': '1003Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            post = {
                                'title': '1003Title',
                                'description': '1003Description',
                                'content': '1003Content'
                            };
                        chai
                            .request(server)
                            .post('/post')
                            .send(post)
                            .set('x-authentication-token', token)
                            .end((error2, response2) => {
                                const postId = response2.body.data.id,
                                    data = {
                                        'field': 'title',
                                        'value': '1003Title2'
                                    };
                                chai
                                    .request(server)
                                    .patch(`/post/${postId}`)
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
                                        response3.body.message.should.be.equal(messages.success.post.update);
                                        response3.should.have.status(status.ok);
                                        chai
                                            .request(server)
                                            .get(`/post/${postId}`)
                                            .end((error4, response4) => {
                                                response4.should.be.a('object');
                                                response4.should.have.property('body');
                                                response4.body.should.be.a('object');
                                                response4.body.should.have.property('message');
                                                response4.body.message.should.be.equal(messages.success.post.get);
                                                response4.body.should.have.property('data');
                                                response4.body.data.should.be.a('object');
                                                response4.body.data.should.have.property('id');
                                                response4.body.data.id.should.be.equal(postId);
                                                response4.body.data.should.have.property('creator_id');
                                                response4.body.data.creator_id.should.be.a('number');
                                                response4.body.data.should.have.property('title');
                                                response4.body.data.title.should.be.equal(data.value);
                                                response4.body.data.should.have.property('description');
                                                response4.body.data.description.should.be.equal(post.description);
                                                response4.body.data.should.have.property('content');
                                                response4.body.data.content.should.be.equal(post.content);
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
});
