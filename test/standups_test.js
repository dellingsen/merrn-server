var should = require('chai').should()
  , expect = require('chai').expect
  , assert = require('chai').assert
  , server = require('../server');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
  
var loginCreds = {email: "admin@test.com", password: "password"};
var testData = { "name": "Tommy", "userId": "admin@test.com", "yesterday": "Finished standup task", "today": "Starting auto task", "blockers": "Vacation" }
var authToken = '';

/*
describe('Testing Login, retrieve Standup Items', function() {

    this.timeout(5000);

		it('should add standup on /api/standups POST', function(done) {

		var login = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.post('/login')
				.send(loginCreds)
				.then(function(res){
					expect(res).to.have.status(200);
					authToken = res.body.token;
					resolve(authToken)
					return authToken;
				})
				.catch(function (err) {
					console.log(err.message)
				  reject(err)
				})
		  })
		}

		var create = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.post('/api/standups')
				.set('authorization', 'Bearer ' + authToken)
				.send(testData)
				.then(function(res){
				  res.should.have.status(200);
				  res.should.be.json;
					assert.equal(res.body[0].id, loginCreds.email)
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}

		var retrieve = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.get('/api/standups')
				.set('authorization', 'Bearer ' + authToken)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
					assert.equal(res.body[0].id, loginCreds.email)
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}
		
		login()
		  .then(function() {
		    return create();
		  })
		  .then(function() {
		    return retrieve();
		  })
		  .then(function(){ done() });
  })		
		
})
*/