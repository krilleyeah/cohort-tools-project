const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); 
const chai = require('chai');


describe('Cohorts API', function() {
  it('POST /cohorts should create a new cohort', function(done) {
    request(app)
      .post('/cohorts')
      .send({
        inProgress: true,
        cohortSlug: 'cohort-1',
        cohortName: 'Cohort 1',
        program: 'Full-Stack',
        campus: 'NY',
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        programManager: 'Jane Smith',
        leadTeacher: 'John Doe',
        totalHours: 1000
      })
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('cohortName', 'Cohort 1');
        done();
      });
  });

  it('GET /cohorts should retrieve all cohorts', function(done) {
    request(app)
      .get('/cohorts')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
  });

});
