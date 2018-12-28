let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let assert = require('assert')
let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
let secrets = require('./secrets')

const users = require('./services/users');
const login = require('./services/login');

// Connect to the MongoDB
mongoose.connect('mongodb://localhost:27017/merrn');

// Use Express web app framework for routing
let app = express();

app.use(logger('dev'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let router = express.Router();

// route middleware that will happen on every request
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "OPTIONS,HEAD,GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type,Accept,Origin,Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200);

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  } 
  
  // Add token to request object
  const token = getToken(req)
  req.token = token

  if (req.url == '/api/login') {
    next();
    return;
  }

  // Not used in Production - just to setup test users
  if (req.url == '/api/adminCreate') {
    next();
    return;
  }

  if (!token) {
    res.set({ 'WWW-Authenticate': 'Bearer realm="home"' });
    res.status(401).json({error:'Authentication required'});
    return;
  }

  console.log('router middleware - token found, verifying')
  const root = jwt.decode(token).root

  const secret = root
    ? secrets.root.secret
    : secrets.user.secret

  jwt.verify(token, secret, function(err, d) {
    if (err) {
      res.set({
        'WWW-Authenticate': 'Bearer realm="home"'
        + ',error="invalid_token"'
      })
      res.status(401).json({error: 'Invalid token'})
      return
    }
    next()
  })
})

function getToken(req) {
  if (req.headers.authorization) {
    const auth = req.headers.authorization.split(' ')
    if (auth[0] == 'Bearer')
      return auth[1]
  }
  return null;
}

function getCurrentUser(req) {
  const token = getToken(req)
  const userId = jwt.decode(token).user_id;
  return userId;
}

function defaultHandler(res) {
  return function(status, result, headers) {
    assert.equal(typeof status, 'number')
    assert.equal(typeof result, 'object')
    res.status(status).json(result)
  }
}

// Define application routes
app.post('/api/login', function(req, res) {
  login.authenticate(req.body, defaultHandler(res))
});


//Users REST API

// Admin use only - create /users for POST
app.post('/api/adminCreate', function(req, res) {
  users.createUser(req.body, function (out) {
    res.json(out)
  })
})

// Create endpoint /users for POST
app.post('/api/users', function(req, res) {
  users.createUser(req.body, function (out) {
    res.json(out)
  })
})

// Create endpoint /profile for POST
app.post('/api/profile', function(req, res) {
  users.createUser(req.body, function (out) {
    res.json(out)
  })
})

// Create endpoint /users for GET
app.get('/api/users', function(req, res) {
  users.getUsers(function (out) {
    res.json(out)
  })
})

// Create endpoint /users/:user_id for PUT
app.put('/api/users/:userid', function(req, res) {
  users.putUser(req.params.userid, function (out) {
    res.json(out)
  })
})

app.get('/api/profile', function(req, res) {
  users.getUserWithPromise(getCurrentUser(req))
    .then(function (profile) {
      profile.password = "";
      res.json(profile);
    })
    .catch(function (err) {
      console.log(err)
      res.sendStatus(500);
    })
})

// Create endpoint /users/:user_id for GET
app.get('/api/users/:userid', function(req, res) {
  users.getUser(req.params.userid, function (out) {
    res.json(out)
  })
})

// Create endpoint /users/:user_id for DELETE
app.delete('/api/users/:userid', function(req, res) {
  users.deleteUser(req.params.userid, function (out) {
    res.json(out)
  })
})

app.delete('/api/users', function(req, res) {
  users.deleteAll(function (out) {
    res.json(out)
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  //res.sendFile(__dirname + '/public/error.html')
})

//Create Http Server to listen for requests to routes
const server = app.listen(3001, function () {
  console.log('Listening on port', server.address().port)
})

server.on('error', onError);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

app.use('/api/', router);

module.exports = app;
