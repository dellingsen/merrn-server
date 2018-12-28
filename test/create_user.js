var should = require('chai').should()
  , expect = require('chai').expect
  , assert = require('chai').assert
  , server = require('../server');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
  
var loginCreds = {email: "admin@test.com", password: "password"};
var testUser = {"firstname": "Dan", "lastname": "Ellingsen", "username": "dan", "role": "ADMINISTRATOR", "password": "password", "email": "drellingsen@gmail.com"}
var authToken = '';

describe('Testing Login, create User, fetch User, delete User', function() {

    this.timeout(5000);

		it('should add user on /api/users POST', function(done) {

		var create = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.post('/api/users')
				//.set('authorization', 'Bearer ' + authToken)
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
		
		create()
		  .then(function(){ done() });
  })		
		
})

