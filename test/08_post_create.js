const chai = require('chai'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

describe('Post creation', () => {
    it('should fail because of a bad parameter', (done) => {
        const user = {
            'username': '0801username',
            'firstname': '0801firstname',
            'lastname': '0801lastname',
            'email': '0801@email.com',
            'password': '0801Password!',
            'passwordConfirmation': '0801Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '0801username',
                    'password': '0801Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            post = {
                                'description': '0801Description',
                                'content': '0801Content'
                            };
                        chai
                            .request(server)
                            .post('/post')
                            .send(post)
                            .set('x-authentication-token', token)
                            .end((error2, response2) => {
                                if (error2) {
                                    throw error2;
                                }
                                response2.should.be.a('object');
                                response2.should.have.property('body');
                                response2.body.should.be.a('object');
                                response2.body.should.have.property('message');
                                response2.body.message.should.be.equal(messages.error.post.create.bad_parameter);
                                response2.should.have.status(status.ko.badrequest);
                                done();
                            });
                    });
            });
    });

    it('should successfully create a new post', (done) => {
        const user = {
            'username': '0802username',
            'firstname': '0802firstname',
            'lastname': '0802lastname',
            'email': '0802@email.com',
            'password': '0802Password!',
            'passwordConfirmation': '0802Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '0802username',
                    'password': '0802Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            post = {
                                'title': '0802Title',
                                'description': '0802Description',
                                'content': '0802Content'
                            };
                        chai
                            .request(server)
                            .post('/post')
                            .send(post)
                            .set('x-authentication-token', token)
                            .end((error2, response2) => {
                                if (error2) {
                                    throw error2;
                                }
                                response2.should.be.a('object');
                                response2.should.have.property('body');
                                response2.body.should.be.a('object');
                                response2.body.should.have.property('message');
                                response2.body.message.should.be.equal(messages.success.post.create);
                                response2.body.should.have.property('data');
                                response2.body.data.should.be.a('object');
                                response2.body.data.should.have.property('id');
                                response2.body.data.id.should.be.a('number');
                                response2.should.have.status(status.ok);
                                done();
                            });
                    });
            });
    });
});
