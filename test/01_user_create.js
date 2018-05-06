const chai = require('chai'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

describe('User creation', () => {
    it('should fail because of a bad parameter', (done) => {
        const user = {
            'username': '0101username',
            'firstname': '0101firstname',
            'lastname': '0101lastname',
            'password': '0101Password!',
            'passwordConfirmation': '0101Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((error, response) => {
                if (error) {
                    throw error;
                }
                response.should.be.a('object');
                response.should.have.property('body');
                response.body.should.be.a('object');
                response.body.should.have.property('message');
                response.body.message.should.be.equal(messages.error.user.create.bad_parameter);
                response.should.have.status(status.ko.badrequest);
                done();
            });
    });

    it('should create new user', (done) => {
        const user = {
            'username': '0102username',
            'firstname': '0102firstname',
            'lastname': '0102lastname',
            'email': '0102@email.com',
            'password': '0102Password!',
            'passwordConfirmation': '0102Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user)
            .end((error, response) => {
                if (error) {
                    throw error;
                }
                response.should.be.a('object');
                response.should.have.property('body');
                response.body.should.be.a('object');
                response.body.should.have.property('message');
                response.body.message.should.be.equal(messages.success.user.create);
                response.body.should.have.property('data');
                response.body.data.should.be.a('object');
                response.body.data.should.have.property('id');
                response.body.data.id.should.be.a('number');
                response.should.have.status(status.ok);
                done();
            });
    });

    it('should fail because email or username already exists', (done) => {
        const user1 = {
            'username': '0103username',
            'firstname': '0103firstname',
            'lastname': '0103lastname',
            'email': '0103@email.com',
            'password': '0103Password!',
            'passwordConfirmation': '0103Password!'
        };
        chai
            .request(server)
            .post('/user')
            .send(user1)
            .end(() => {
                const user2 = {
                    'username': '0103username',
                    'firstname': '0104firstname',
                    'lastname': '0104lastname',
                    'email': '0103@email.com',
                    'password': '0104Password!',
                    'passwordConfirmation': '0104Password!'
                };
                chai
                    .request(server)
                    .post('/user')
                    .send(user2)
                    .end((error2, response2) => {
                        if (error2) {
                            throw error2;
                        }
                        response2.should.be.a('object');
                        response2.should.have.property('body');
                        response2.body.should.be.a('object');
                        response2.body.should.have.property('message');
                        response2.body.message.should.be.equal(messages.error.user.create.account_exists);
                        response2.should.have.status(status.ko.badrequest);
                        done();
                    });
            });
    });
});
