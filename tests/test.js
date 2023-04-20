const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../app');

chai.use(chaiHttp);
chai.should();

describe('People', () => {
  this.lastIndex = 0;
  after(() => {
    server.close();
  });
  describe('post /api/v1/people', () => {
    it('should not create a people entry without a name', (done) => {
      chai
        .request(app)
        .post('/api/v1/people')
        .send({ age: 10 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.eql({ error: 'Please enter a name.' });
          done();
        });
    });
    it('should create a people entry with valid input', (done) => {
      // your code goes here
      chai
        .request(app)
        .post('/api/v1/people')
        .send({ name: 'Anna', age: 22 })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.contain({ message: 'A person entry was added' });
          res.body.should.have.property('index').be.a('number');
          this.lastIndex = res.body.index;
          done();
        });
    });
  });
  describe('get /api/v1/people', () => {
    it(`should return an array of person entries of length ${
      this.lastIndex + 1
    }`, (done) => {
      // your code goes here
      chai
        .request(app)
        .get('/api/v1/people')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.should.have.length(this.lastIndex + 1);
          done();
        });
    });
  });
  describe('get /api/v1/people/:id', () => {
    it('should return the entry corresponding to the last person added.', (done) => {
      // your code goes here
      chai
        .request(app)
        .get(`/api/v1/people/${this.lastIndex}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.name.should.be.eql('Anna');
          res.body.age.should.be.eql(22);
          done();
        });
    });
    it('should return an error if the index is >= the length of the array', (done) => {
      // your code goes here
      chai
        .request(app)
        .get('/api/v1/people/${this.lastIndex + 1}')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.eql({ error: 'Person entry not found.' });
          done();
        });
    });
  });
});
