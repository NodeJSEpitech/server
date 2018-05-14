const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../src/server'),
    {status, messages} = require('../config/variables');

chai.should();
chai.use(chaiHttp);

describe('Base route', () => {
    it('should return welcome message', (done) => {
        chai
            .request(server)
            .get('/')
            .end((error, response) => {
                if (error) {
                    throw error;
                }
                response.should.be.a('object');
                response.should.have.property('body');
                response.body.should.be.a('object');
                response.body.should.have.property('message');
                response.body.message.should.be.equal(messages.success.welcome.unauth);
                response.should.have.property('headers');
                response.headers.should.be.a('object');
                response.headers.should.have.property('access-control-allow-origin');
                response.headers['access-control-allow-origin'].should.be.equal('*');
                response.should.have.status(status.ok);
                done();
            });
    });
});
