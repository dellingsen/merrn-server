var cred = require('credential')({work: 0.3})
var uuid = require('node-uuid')
var Joi = require('joi')
var _ = require('lodash')
const filePath = './storage/files/';
var fileStore = require('json-fs-store')(filePath)
const fileCategoryPath = './storage/filecategories/';
var fileCategoryStore = require('json-fs-store')(fileCategoryPath)
var jsonUpdate = require('json-update');
var fs = require('fs')

exports.createFile = function(body, files, userId, callback) {

  var fileSchema = Joi.object({
    fileName: Joi.string(),
    description: Joi.string().allow(''),
    category: Joi.string().allow(''),
    userId: Joi.string(),
    url: Joi.string()
  }).unknown()
  Joi.validate(body, fileSchema, function(err, val) {
	  if (err) throw "create new file failed to validate"
	})
   
  var file = files.fileData;
  var fileName = files.fileData.name.substr(0, files.fileData.name.lastIndexOf('.')) || files.fileData.name;
  var fileType = files.fileData.name.split('.').pop();

  let filePath = './storage/fileuploads/' + files.fileData.name;
  //validate filename is unique; if not, fix it
  if (fs.existsSync(filePath)) 
  {
    var fileNumber = 1;
    var fileExist = true;
    while (fileExist) {
      fileNumber_str = fileNumber.toString(); 
      var current = fileName + '_' + fileNumber_str + '.' + fileType;
      filePath = './storage/fileuploads/' + current;
      if (fs.existsSync(filePath)) {
        fileNumber++;
      } 
      else {
        filePath = './storage/fileuploads/' + current;
        fileExist = false;
        break;
      }
    }
  } 
  //successfully figured out correct path, now we can save
  file.mv(filePath, function(err) {
    if (err) {
      err.status = 500;
      callback(err);
    } 
    else {
      var newFile = {
        id: uuid.v1(), 
        fileName: filePath.split('\\').pop().split('/').pop(), 
        description: body.description,
        category: body.category,
        userId: userId,
        url: filePath,
        favorite: "false",
        uploadDateTime: new Date()
      }

      fileStore.add(newFile, function(err) {
        //saved to storage/files/uuid.json
        if (err) {
          callback(err)
        } else {
          updateFileCategories(body.category)
          callback(newFile)
        }
      })        
    }
  })
}
  
function updateFileCategories(newCategory) {
  fileCategoryStore.load("fileCategories", function(err, fileCategories) {
    if (err) {
      //create category file
     fileCategories = { id: "fileCategories", "categories": [ newCategory ]}
    } else {
      //add another category
      fileCategories.categories.push(newCategory)
    }
    //save categories
    fileCategoryStore.add(fileCategories, function(err) {
      if (err) {
        //Todo
      } 
    })
  })
}

function compare(propName) {
  return function(a,b) {
    if (a[propName] < b[propName])
      return -1;
    if (a[propName] > b[propName])
      return 1;
    return 0;
  }
}

exports.getFilesBySearchText = function(type, searchtext) {
  return new Promise(function (resolve, reject) {
    fileStore.list(function(err, files) {
      if (err) {
        reject(err)
      } else {
        var filteredFiles;
        if (type === 'filename') {
          filteredFiles = files.filter(function (file) {
              if (file.fileName) {
                return(file.fileName.toLowerCase().includes(searchtext.toLowerCase()))
              }
              return false
          })
        }
        else if (type === 'category') {
         filteredFiles = files.filter(function (file) {
              if (file.category) {
                return (file.category.toLowerCase().includes(searchtext.toLowerCase()))
              }
              return false
          })
        }
        else if (type === 'description') {
         filteredFiles = files.filter(function (file) {
              if (file.description) {
                return (file.description.toLowerCase().includes(searchtext.toLowerCase()))
              }
              return false
          })
        }
        else {
          filteredFiles = [];
        }
        if (filteredFiles) {
          var sortedFiles = filteredFiles.sort(compare("fileName"));
          resolve(sortedFiles)
        } else {
          reject({error: "No files found for custom search"})
        }
      }
    })
  })
}

exports.getUserFavoriteFiles = function(userId) {
  return new Promise(function (resolve, reject) {
    fileStore.list(function(err, files) {
      if (err) {
        reject(err)
      } else {
        var userFiles = files.filter(function (file) {
          return (file.userId == userId);
        })
        var favoriteFiles = userFiles.filter(function (file) {
              if (file.favorite) {
                return(file.favorite.toLowerCase().includes("true"))
              }
              return false
          })
        if (favoriteFiles) {
          var sortedFiles = favoriteFiles.sort(compare("fileName"));
          resolve(sortedFiles)
        } else {
          reject({error: "No favorite files found"})
        }
      }
    })
  })
}

exports.updateFavorite = function(id, val) {
  return new Promise(function (resolve, reject) {
    jsonUpdate.update(filePath + id + '.json', {favorite: val})
      .then(function(json) { 
        resolve(json) 
    })
  })
}

exports.getFile = function(id) {
  return new Promise(function (resolve, reject) {
    fileStore.load(id, function(err, file) {
      if (err) {
        reject(err)
      }
      else {
        resolve(file)
      }
    })
  })
}

exports.getFileCategories = function() {
  return new Promise(function (resolve, reject) {
    fileCategoryStore.load("fileCategories", function(err, fileCategories) {
      if (err) {
        reject(err)
      }
      else {
        resolve(fileCategories.categories)
      }
    })
  })
}

exports.removeFileCategory = function(category) {
  return new Promise(function (resolve, reject) {
    fileCategoryStore.load("fileCategories", function(err, fileCategories) {
      if (err) {
        reject(err)
      }
      else {
        var index = fileCategories.categories.indexOf(category);
        if (index > -1) {
         fileCategories.categories.splice(index, 1);
        }
        fileCategoryStore.add(fileCategories, function(err) {
          if (err) {
            reject(err)
          } 
        })
        resolve(fileCategories.categories)
      }
    })
  })
}

exports.deleteFile = function(id) {
  return new Promise(function (resolve, reject) {
    fileStore.remove(id, function(err, file) {
      if (err) {
        reject(err)
      }
      else {
        resolve({success: true})
      }
    })
  })
}