const chai = require('chai'),
    WebSocket = require('ws'),
    server = require('../src/server'),
    parameters = require('../config/parameters'),
    {status, messages} = require('../config/variables');

describe('Comment get', () => {
    it('should successfully retrieve all comments of a post', (done) => {
        const user = {
            'username': '1301username',
            'firstname': '1301firstname',
            'lastname': '1301lastname',
            'email': '1301@email.com',
            'password': '1301Password!',
            'passwordConfirmation': '1301Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end(() => {
                const credentials = {
                    'username': '1301username',
                    'password': '1301Password!'
                };
                chai
                    .request(server)
                    .post('/authenticate')
                    .send(credentials)
                    .end((error1, response1) => {
                        const token = response1.body.data.token,
                            post = {
                                'title': '1301Title',
                                'description': '1301Description',
                                'content': '1301Content'
                            };
                        chai
                            .request(server)
                            .post('/post')
                            .send(post)
                            .set('x-authentication-token', token)
                            .end((error2, response2) => {
                                const postId = response2.body.data.id,
                                    ws = new WebSocket(`ws://localhost:${parameters.wsPort}`),
                                    request = {
                                        'x-request-id': 1301,
                                        'x-method': 'get',
                                        'x-post-id': postId
                                    };

                                ws.on('open', () => {
                                    ws.send(JSON.stringify(request));
                                });
                                ws.on('message', (response3) => {
                                    const response = JSON.parse(response3);
                                    if (response.status !== status.nc) {
                                        response.should.be.a('object');
                                        response.should.have.property('data');
                                        response.data.should.be.a('array');
                                        response.should.have.property('message');
                                        response.message.should.be.equal(messages.success.comment.get);
                                        response.should.have.property('status');
                                        response.status.should.be.equal(status.ok);
                                        done();
                                    }
                                });
                            });
                    });
            });
    });
});
