const chai = require('chai'),
    WebSocket = require('ws'),
    server = require('../src/server'),
    parameters = require('../config/parameters'),
    {status, messages} = require('../config/variables');

describe('Comment post', () => {
    it('should successfully create new comment on a post', (done) => {
        const user = {
            'username': '1201username',
            'firstname': '1201firstname',
            'lastname': '1201lastname',
            'email': '1201@email.com',
            'password': '1201Password!',
            'passwordConfirmation': '1201Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '1201username',
                    'password': '1201Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            post = {
                                'title': '1201Title',
                                'description': '1201Description',
                                'content': '1201Content'
                            };
                        chai
                            .request(server)
                            .post('/post')
                            .send(post)
                            .set('x-authentication-token', token)
                            .end((error2, response2) => {
                                const postId = response2.body.data.id,
                                    ws = new WebSocket(`ws://localhost:${parameters.port}`),
                                    request = {
                                        'x-method': 'post',
                                        'x-post-id': postId,
                                        'x-request-id': 1201,
                                        'x-authenticated-token': token,
                                        'body': '1201Content'
                                    };
                                ws.on('open', () => {
                                    ws.send(JSON.stringify(request));
                                });
                                ws.on('message', (response3) => {
                                    const response = JSON.parse(response3);
                                    if (response.status !== status.nc) {
                                        response.should.be.a('object');
                                        response.should.have.property('message');
                                        response.message.should.be.equal(messages.success.comment.post);
                                        response.should.have.property('status');
                                        response.status.should.be.equal(status.ok);
                                        ws.close();
                                        done();
                                    }
                                });
                            });
                    });
            });
    });

    it('should successfully send a message as authenticated user', (done) => {
        const user = {
            'username': '1202username',
            'firstname': '1202firstname',
            'lastname': '1202lastname',
            'email': '1202@email.com',
            'password': '1202Password!',
            'passwordConfirmation': '1202Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '1202username',
                    'password': '1202Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            ws = new WebSocket(`ws://localhost:${parameters.port}`),
                            request = {
                                'x-method': 'post',
                                'x-post-id': null,
                                'x-request-id': 1202,
                                'x-authenticated-token': token,
                                'body': '1202Content'
                            };
                        ws.on('open', () => {
                            ws.send(JSON.stringify(request));
                        });
                        ws.on('message', (response2) => {
                            const response = JSON.parse(response2);
                            if (response.status !== status.nc) {
                                response.should.be.a('object');
                                response.should.have.property('avatar');
                                (response.avatar === null).should.be.equal(true);
                                response.should.have.property('username');
                                response.username.should.be.equal(user.username);
                                response.should.have.property('content');
                                response.content.should.be.equal(request.body);
                                ws.close();
                                done();
                            }
                        });
                    });
            });
    });

    it('should successfully send a message without being authenticated', (done) => {
        const ws = new WebSocket(`ws://localhost:${parameters.port}`),
            request = {
                'x-method': 'post',
                'x-post-id': null,
                'x-request-id': 1203,
                'x-username': '1203Username',
                'body': '1203Content'
            };
        ws.on('open', () => {
            ws.send(JSON.stringify(request));
        });
        ws.on('message', (response2) => {
            const response = JSON.parse(response2);
            if (response.status !== status.nc) {
                response.should.be.a('object');
                response.should.have.property('avatar');
                (response.avatar === null).should.be.equal(true);
                response.should.have.property('username');
                response.username.should.be.equal(request["x-username"]);
                response.should.have.property('content');
                response.content.should.be.equal(request.body);
                ws.close();
                done();
            }
        });
    });
});
