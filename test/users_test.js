var should = require('chai').should()
  , expect = require('chai').expect
  , assert = require('chai').assert
  , server = require('../server');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
  
var loginCreds = {email: "admin@test.com", password: "password"};
var testUser = {"firstname": "Joe", "lastname": "Smith", "password": "password", "email": "jsmith@test.com"}
var authToken = '';

/*
describe('Testing Login, create User, fetch User, delete User', function() {

    this.timeout(5000);

		it('should add user on /api/users POST', function(done) {

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
				.post('/api/users')
				.set('authorization', 'Bearer ' + authToken)
				.send(testUser)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
          assert.equal(res.body.id, testUser.email)
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}		

		var fetchProfile = function () {
		  return new Promise(function (resolve, reject){
			chai.request(server)
			  .get('/api/profile')
				.set('authorization', 'Bearer ' + authToken)
				.then(function(res){
					res.should.have.status(200);
          assert.equal(res.body.id, loginCreds.email)
					assert.equal(res.body.password, "")
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}				
		
		var updateProfile = function () {
		  return new Promise(function (resolve, reject){
			chai.request(server)
			  .put('/api/profile')
				.set('authorization', 'Bearer ' + authToken)
				.send({'lastname': 'Tester', 'role': 'admin'})
				.then(function(res){
					res.should.have.status(200);
					assert.equal(res.body.lastname, "Tester")
					assert.equal(res.body.role, "admin")
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
		    return fetchProfile();
		  })
		  .then(function() {
		    return updateProfile();
		  })
		  .then(function(){ done() });
  })		
		
})
*/
