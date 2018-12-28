var cred = require('credential')({work: 0.3})
var uuid = require('node-uuid')
var Joi = require('joi')
var standupStore = require('json-fs-store')('./storage/standups');
var userService = require('./user');

exports.createStandup = function(body, callback) {

  var standupSchema = Joi.object({
    userId: Joi.string(),
    yesterday: Joi.string(),
    today: Joi.string(),
    blockers: Joi.string().allow('')
  }).unknown()
  Joi.validate(body, standupSchema, function(err, val) {
	  if (err) throw "standup item failed to validate"
	})
   
  var standup = {
    id: body.userId, 
    yesterday: body.yesterday,
    today: body.today,
    blockers: body.blockers,
    updateDateTime: new Date()
  }

  userService.getUser(body.userId)
    .then(function (user) {
      standup.name = user.firstname+" "+user.lastname;
      // Save the standup and check for errors - return object result in callback
      standupStore.add(standup, function(err) {
        //saved to storage/standups/userId.json
        if (err) {
          console.log('standup save error')
          console.log(err)
          callback(err)
        }
        else {
          console.log('standup save success')
          exports.getStandupItems(body.userId)
            .then(function (standups) {
              callback(standups);
            })
            .catch(function (err) {
              callback(err);
            })
        }
      })
    })
    .catch(function (err) {
      callback(err)
    })
}

exports.getStandupItemsAll = function() {
  return new Promise(function (resolve, reject) {
    standupStore.list(function(err, standups) {
      if (err) {
        reject(err)
      } else {
        resolve(standups)
      }
    })
  })
}

exports.getStandupItems = function(userId) {
  return new Promise(function (resolve, reject) {
    standupStore.list(function(err, standups) {
      if (err) {
        reject(err)
      } else {
        var userStandups = standups.filter(function (userStandup) {
          return (userStandup.id == userId);
        })
        resolve(userStandups)
      }
    })
  })
}
