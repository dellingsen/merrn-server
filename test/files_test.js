var should = require('chai').should()
  , expect = require('chai').expect
  , assert = require('chai').assert
  , server = require('../server');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var loginCreds = {email: "admin@test.com", password: "password"};
var testData = { "fileName": "EnvironmentSetup.txt", "description": "How to setup your dev environment", "category": "team", "userId": "admin@test.com", "url": "" }
var authToken = '';
var fileId;

/*
describe('Testing Login, create, retrieve files for user, delete file', function() {

    this.timeout(5000);

		it('should add file on /api/file POST', function(done) {

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
				  reject(err)
				})
		  })
		}

		var create = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.post('/api/files')
				.set('authorization', 'Bearer ' + authToken)
				.send(testData)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
          fileId = res.body.id;
					resolve(res.body)
				})
				.catch(function (err) {
					console.log(err)
				  reject(err)
				})
			})
		}
		
		var customFileNameSearch = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.get('/api/files/search/filename/searchtext/' + testData.fileName)
				.set('authorization', 'Bearer ' + authToken)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}

		var customFileCategorySearch = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.get('/api/files/search/category/searchtext/' + testData.category)
				.set('authorization', 'Bearer ' + authToken)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
					assert.equal(res.body[0].category, testData.category)
					resolve(res.body[0].id)
					return res.body[0].id;
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}

		var customFileDescSearch = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.get('/api/files/search/description/searchtext/' + testData.description)
				.set('authorization', 'Bearer ' + authToken)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}

		var getFavoriteFiles = function () {
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.get('/api/files/favorite')
				.set('authorization', 'Bearer ' + authToken)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}

		var getFileCategories = function () {
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.get('/api/files/categories')
				.set('authorization', 'Bearer ' + authToken)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}

		var downloadFile = function (fileId) {
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.get('/api/files/download/' + fileId + "/token/" + authToken)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}

		var removeFileCategory = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.delete('/api/files/categories/cat1')
				.set('authorization', 'Bearer ' + authToken)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}
		
		var deleteFile = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.delete('/api/files/' + testData.id)
				.set('authorization', 'Bearer ' + authToken)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
          assert.equal(res.body.success, true)
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}

		var favoriteFile = function (fileId) {
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.put('/api/files/favorite/'+fileId+'/value/' + true)
				.set('authorization', 'Bearer ' + authToken)
				.then(function(res){
				  res.should.have.status(200);
					res.should.be.json;
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}

		login()
		  .then(function() {
		    return getFavoriteFiles();
		  })
		  .then(function() {
		    return getFileCategories();
		  })
		  .then(function() {
		    return removeFileCategory();
		  })
		  .then(function() {
		    return customFileNameSearch();
		  })
		  .then(function() {
		    return customFileCategorySearch();
		  })
		  .then(function(fileId) {
		    return favoriteFile(fileId);
		  })
		  .then(function(){ done() });
  })		
		
})
*/