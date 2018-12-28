var User = require('../models/user');
var userService = require('./users');
var cred = require('credential')({work: 0.3})
var async = require('async')
var secrets = require('../secrets')
var _ = require('lodash')
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.authenticate = function(body, callback) {
  login(body, callback)
}

login = function(body, callback) {
  let user;
  async.waterfall([

    function(next) {
      userService.getUserByName(body.email, function (err, r) {
        if (err) {
          console.log(err)
          callback(500, {error: 'Internal error'})
          next(err)
        } else if (_.isEmpty(r)) {
          callback(401, {error: 'Authentication failed'})
          next(new Error())
        } else {
          next(null, r)
        }
      })
    },
    function(u, next) {
      user = u[0];
      console.log('Success - found user by userName')
      cred.verify(user.password, body.password,
        function(err, valid) {
          if (err || !valid) {
            callback(401, {error: 'Login failed'})
            next(err || new Error())
          } else {
            console.log('Success - found user: ' + user.userName)
            console.log('User email endpoint: ' + user.email)
            next(null)
          }
        })
    }
  ], function(err) {
    sendToken(err, user, callback)
  })
}

// Create and send JWT (token) back to client for future authenticating
function sendToken(err, user, cb) {
  if (! err) {
    // User is fully authed at this point
    console.log('sendToken() - Return user web token')

    // JWT Payload has user information
    var jwt_payload = { user_id: user.id }
    user.password = "";

    cb(200, {
      token: sign(jwt_payload, secrets.user),
      auth_state: 'success',
      user: user
    }, 'Test')
  }
}

// JWT sign prepends header to token before it signs it
function sign(payload, conf) {
  return jwt.sign(payload, conf.secret, conf.options)
}

