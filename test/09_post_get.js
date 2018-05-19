const chai = require('chai'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

describe('Post get', () => {
    it('should fail because post does not exist', (done) => {
        const user = {
            'username': '0901username',
            'firstname': '0901firstname',
            'lastname': '0901lastname',
            'email': '0901@email.com',
            'password': '0901Password!',
            'passwordConfirmation': '0901Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '0901username',
                    'password': '0901Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            post = {
                                'title': '0901Title',
                                'description': '0901Description',
                                'content': '0901Content'
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
                                    .get(`/post/${postId + 1}`)
                                    .end((error3, response3) => {
                                        if (error3) {
                                            throw error3;
                                        }
                                        response3.should.be.a('object');
                                        response3.should.have.property('body');
                                        response3.body.should.be.a('object');
                                        response3.body.should.have.property('message');
                                        response3.body.message.should.be.equal(messages.error.post.get.not_found);
                                        response3.should.have.status(status.ko.badrequest);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should successfully get a post', (done) => {
        const user = {
            'username': '0902username',
            'firstname': '0902firstname',
            'lastname': '0902lastname',
            'email': '0902@email.com',
            'password': '0902Password!',
            'passwordConfirmation': '0902Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '0902username',
                    'password': '0902Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            post = {
                                'title': '0902Title',
                                'description': '0902Description',
                                'content': '0902Content'
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
                                    .get(`/post/${postId}`)
                                    .end((error3, response3) => {
                                        if (error3) {
                                            throw error3;
                                        }
                                        response3.should.be.a('object');
                                        response3.should.have.property('body');
                                        response3.body.should.be.a('object');
                                        response3.body.should.have.property('message');
                                        response3.body.message.should.be.equal(messages.success.post.get);
                                        response3.body.should.have.property('data');
                                        response3.body.data.should.be.a('object');
                                        response3.body.data.should.have.property('id');
                                        response3.body.data.id.should.be.equal(postId);
                                        response3.body.data.should.have.property('creator_id');
                                        response3.body.data.creator_id.should.be.a('number');
                                        response3.body.data.should.have.property('title');
                                        response3.body.data.title.should.be.equal(post.title);
                                        response3.body.data.should.have.property('description');
                                        response3.body.data.description.should.be.equal(post.description);
                                        response3.body.data.should.have.property('content');
                                        response3.body.data.content.should.be.equal(post.content);
                                        response3.body.data.should.have.property('created_at');
                                        response3.body.data.should.have.property('deleted_at');
                                        (response3.body.data.deleted_at === null).should.be.equal(true);
                                        response3.body.data.should.have.property('comments');
                                        response3.body.data.comments.should.be.equal(0);
                                        response3.should.have.status(status.ok);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should successfully get all posts', (done) => {
        chai
            .request(server)
            .get(`/posts`)
            .end((error, response) => {
                if (error) {
                    throw error;
                }
                response.should.be.a('object');
                response.should.have.property('body');
                response.body.should.be.a('object');
                response.body.should.have.property('message');
                response.body.message.should.be.equal(messages.success.post.get);
                response.body.should.have.property('data');
                response.body.data.should.be.a('array');
                response.should.have.status(status.ok);
                done();
            });
    });
});
