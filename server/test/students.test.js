const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); 
const chai = require('chai');


describe('Students API', function() {
  it('POST /students should create a new student', function(done) {
    request(app)
      .post('/students')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        languages: ['English', 'Spanish'],
        program: 'Full-Stack',
        background: 'Computer Science',
        image: 'http://example.com/image.jpg',
        projects: [],
        cohort: '60d5f83c2f8fb814c8d6e041' // przykładowy ID Cohort
      })
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('firstName', 'John');
        done();
      });
  });

  it('GET /students should retrieve all students', function(done) {
    request(app)
      .get('/students')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
  });

});
