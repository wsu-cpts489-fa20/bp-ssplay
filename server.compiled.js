"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _passportGithub = _interopRequireDefault(require("passport-github"));

var _passportGoogleOauth = _interopRequireDefault(require("passport-google-oauth2"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require('dotenv').config();

var LOCAL_PORT = 8080; // const DEPLOY_URL = "http://localhost:8080";
// const DEPLOY_URL = "http://ssplay.us-west-2.elasticbeanstalk.com";

var DEPLOY_URL = "https://ssplay.bfapp.org";
var PORT = process.env.HTTP_PORT || LOCAL_PORT;
var GithubStrategy = _passportGithub["default"].Strategy;
var GoogleStrategy = _passportGoogleOauth["default"].Strategy;
var LocalStrategy = _passportLocal["default"].Strategy;
var app = (0, _express["default"])(); //////////////////////////////////////////////////////////////////////////
//MONGOOSE SET-UP
//The following code sets up the app to connect to a MongoDB database
//using the mongoose library.
//////////////////////////////////////////////////////////////////////////

var connectStr = 'mongodb+srv://por:cs489bpssplay@cluster0.xcdi4.mongodb.net/appdb?retryWrites=true&w=majority';

_mongoose["default"].connect(connectStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log("Connected to ".concat(connectStr, "."));
}, function (err) {
  console.error("Error connecting to ".concat(connectStr, ": ").concat(err));
});

var Schema = _mongoose["default"].Schema;
var roundSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    "enum": ['practice', 'tournament']
  },
  holes: {
    type: Number,
    required: true,
    min: 1,
    max: 18
  },
  strokes: {
    type: Number,
    required: true,
    min: 1,
    max: 300
  },
  minutes: {
    type: Number,
    required: true,
    min: 1,
    max: 240
  },
  seconds: {
    type: Number,
    required: true,
    min: 0,
    max: 60
  },
  notes: {
    type: String,
    required: true
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});
roundSchema.virtual('SGS').get(function () {
  return this.strokes * 60 + this.minutes * 60 + this.seconds;
});
var appointmentSchema = new Schema({
  userId: String,
  username: String,
  courseName: String,
  date: String,
  time: String,
  paid: String
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});
var courseSchema = new Schema({
  id: String,
  rating: String,
  review: String,
  picture: String,
  //link to course image
  location: String,
  yardage: String,
  runningDistance: String,
  timePar: String,
  bestScore: String,
  recordHolder: String,
  rateSenior: String,
  rateStandard: String,
  courseName: String,
  availability: {
    day1: [],
    day2: [],
    day3: [],
    day4: [],
    day5: [],
    day6: [],
    day7: []
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});
var cardSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  expDate: {
    type: String,
    required: true
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
}); //Define schema that maps to a document in the Users collection in the appdb
//database.

var userSchema = new Schema({
  type: {
    type: String,
    required: true,
    "enum": ['user', 'operator']
  },
  id: String,
  //unique identifier for user
  password: String,
  displayName: String,
  //Name to be displayed within app
  authStrategy: String,
  //strategy used to authenticate, e.g., github, local
  profilePicURL: String,
  //link to profile image
  securityQuestion: String,
  securityAnswer: {
    type: String,
    required: function required() {
      return this.securityQuestion ? true : false;
    }
  },
  rounds: [roundSchema],
  appointments: [appointmentSchema],
  card: [cardSchema]
});

var User = _mongoose["default"].model("User", userSchema);

var Course = _mongoose["default"].model("Course", courseSchema);

var Appointment = _mongoose["default"].model("Appointment", appointmentSchema); //////////////////////////////////////////////////////////////////////////
//PASSPORT SET-UP
//The following code sets up the app with OAuth authentication using
//the 'github' strategy in passport.js.
//////////////////////////////////////////////////////////////////////////


_passport["default"].use(new GithubStrategy({
  clientID: 'b52c7ff0ca7afdb783d1',
  clientSecret: 'de044810b3d6e85aa53cbcf84ae50070199a09fd',
  callbackURL: DEPLOY_URL + "/auth/github/callback"
},
/*#__PURE__*/
//The following function is called after user authenticates with github
function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee(accessToken, refreshToken, profile, done) {
    var userId, currentUser;
    return _regeneratorRuntime["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("User authenticated through GitHub! In passport callback."); //Our convention is to build userId from displayName and provider

            userId = "".concat(profile.username, "@").concat(profile.provider); //See if document with this unique userId exists in database 

            _context.next = 4;
            return User.findOne({
              id: userId
            });

          case 4:
            currentUser = _context.sent;

            if (currentUser) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return new User({
              type: "operator",
              id: userId,
              displayName: profile.displayName,
              authStrategy: profile.provider,
              profilePicURL: profile.photos[0].value,
              rounds: [],
              appointments: [],
              card: []
            }).save();

          case 8:
            currentUser = _context.sent;

          case 9:
            return _context.abrupt("return", done(null, currentUser));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}()));

_passport["default"].use(new GoogleStrategy({
  clientID: '909887696769-o31hn2i23rmajsov9oal8vftfu1e4n1r.apps.googleusercontent.com',
  clientSecret: 'JmKC0RIuBWh3Cr9n_lddKF93',
  callbackURL: DEPLOY_URL + "/auth/google/callback"
},
/*#__PURE__*/
//The following function is called after user authenticates with github
function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee2(accessToken, refreshToken, profile, done) {
    var userId, currentUser;
    return _regeneratorRuntime["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("User authenticated through Google! In passport callback."); //Our convention is to build userId from displayName and provider

            userId = "".concat(profile.sub, "@").concat(profile.provider); //See if document with this unique userId exists in database 

            _context2.next = 4;
            return User.findOne({
              id: userId
            });

          case 4:
            currentUser = _context2.sent;

            if (currentUser) {
              _context2.next = 9;
              break;
            }

            _context2.next = 8;
            return new User({
              type: "user",
              id: userId,
              displayName: profile.displayName,
              authStrategy: profile.provider,
              profilePicURL: profile.photos[0].value,
              rounds: [],
              appointments: [],
              card: []
            }).save();

          case 8:
            currentUser = _context2.sent;

          case 9:
            return _context2.abrupt("return", done(null, currentUser));

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x5, _x6, _x7, _x8) {
    return _ref2.apply(this, arguments);
  };
}()));

_passport["default"].use(new LocalStrategy({
  passReqToCallback: true
},
/*#__PURE__*/
//Called when user is attempting to log in with local username and password. 
//userId contains the email address entered into the form and password
//contains the password entered into the form.
function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee3(req, userId, password, done) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return User.findOne({
              id: userId
            });

          case 3:
            thisUser = _context3.sent;

            if (!thisUser) {
              _context3.next = 13;
              break;
            }

            if (!(thisUser.password === password)) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("return", done(null, thisUser));

          case 9:
            req.authError = "The password is incorrect. Please try again" + " or reset your password.";
            return _context3.abrupt("return", done(null, false));

          case 11:
            _context3.next = 15;
            break;

          case 13:
            //userId not found in DB
            req.authError = "There is no account with email " + userId + ". Please try again.";
            return _context3.abrupt("return", done(null, false));

          case 15:
            _context3.next = 20;
            break;

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", done(_context3.t0));

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 17]]);
  }));

  return function (_x9, _x10, _x11, _x12) {
    return _ref3.apply(this, arguments);
  };
}())); //Serialize the current user to the session


_passport["default"].serializeUser(function (user, done) {
  console.log("In serializeUser.");
  console.log("Contents of user param: " + JSON.stringify(user));
  done(null, user.id);
}); //Deserialize the current user from the session
//to persistent storage.


_passport["default"].deserializeUser( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee4(userId, done) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("In deserializeUser.");
            console.log("Contents of userId param: " + userId);
            _context4.prev = 2;
            _context4.next = 5;
            return User.findOne({
              id: userId
            });

          case 5:
            thisUser = _context4.sent;
            console.log("User with id " + userId + " found in DB. User object will be available in server routes as req.user.");
            done(null, thisUser);
            _context4.next = 13;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](2);
            done(_context4.t0);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 10]]);
  }));

  return function (_x13, _x14) {
    return _ref4.apply(this, arguments);
  };
}()); //////////////////////////////////////////////////////////////////////////
//INITIALIZE EXPRESS APP
// The following code uses express.static to serve the React app defined 
//in the client/ directory at PORT. It also writes an express session
//to a cookie, and initializes a passport object to support OAuth.
/////////////////////////////////////////////////////////////////////////


app.use((0, _expressSession["default"])({
  secret: "speedgolf",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60
  }
})).use(_express["default"]["static"](_path["default"].join(__dirname, "client/build"))).use(_passport["default"].initialize()).use(_passport["default"].session()).use(_express["default"].json({
  limit: '20mb'
})).listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
}); //////////////////////////////////////////////////////////////////////////
//DEFINE EXPRESS APP ROUTES
//////////////////////////////////////////////////////////////////////////
/////////////////////////
//AUTHENTICATION ROUTES
/////////////////////////
//AUTHENTICATE route: Uses passport to authenticate with GitHub.
//Should be accessed when user clicks on 'Login with GitHub' button on 
//Log In page.

app.get('/auth/github', _passport["default"].authenticate('github'));
app.get('/auth/google', _passport["default"].authenticate('google', {
  scope: ['profile']
})); //CALLBACK route:  GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.

app.get('/auth/github/callback', _passport["default"].authenticate('github', {
  failureRedirect: '/'
}), function (req, res) {
  console.log("auth/github/callback reached.");
  res.redirect('/'); //sends user back to login screen; 
  //req.isAuthenticated() indicates status
});
app.get('/auth/google/callback', _passport["default"].authenticate('google', {
  failureRedirect: '/'
}), function (req, res) {
  console.log("auth/google/callback reached.");
  res.redirect('/'); //sends user back to login screen; 
  //req.isAuthenticated() indicates status
}); //LOGOUT route: Use passport's req.logout() method to log the user out and
//redirect the user to the main app page. req.isAuthenticated() is toggled to false.

app.get('/auth/logout', function (req, res) {
  console.log('/auth/logout reached. Logging out');
  req.logout();
  res.redirect('/');
}); //TEST route: Tests whether user was successfully authenticated.
//Should be called from the React.js client to set up app state.

app.get('/auth/test', function (req, res) {
  console.log("auth/test reached.");
  var isAuth = req.isAuthenticated();

  if (isAuth) {
    console.log("User is authenticated");
    console.log("User record tied to session: " + JSON.stringify(req.user));
  } else {
    //User is not authenticated
    console.log("User is not authenticated");
  } //Return JSON object to client with results.


  res.json({
    isAuthenticated: isAuth,
    user: req.user
  });
}); //LOGIN route: Attempts to log in user using local strategy

app.post('/auth/login', _passport["default"].authenticate('local', {
  failWithError: true
}), function (req, res) {
  console.log("/login route reached: successful authentication."); //Redirect to app's main page; the /auth/test route should return true

  res.status(200).send("Login successful");
}, function (err, req, res, next) {
  console.log("/login route reached: unsuccessful authentication");

  if (req.authError) {
    console.log("req.authError: " + req.authError);
    res.status(401).send(req.authError);
  } else {
    res.status(401).send("Unexpected error occurred when attempting to authenticate. Please try again.");
  } //Note: Do NOT redirect! Client will take over.

}); /////////////////////////////////
//USER ACCOUNT MANAGEMENT ROUTES
////////////////////////////////
//READ user route: Retrieves the user with the specified userId from users collection (GET)

app.get('/users/:userId', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee5(req, res, next) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log("in /users route (GET) with userId = " + JSON.stringify(req.params.userId));
            _context5.prev = 1;
            _context5.next = 4;
            return User.findOne({
              id: req.params.userId
            });

          case 4:
            thisUser = _context5.sent;

            if (thisUser) {
              _context5.next = 9;
              break;
            }

            return _context5.abrupt("return", res.status(404).send("No user account with id " + req.params.userId + " was found in database."));

          case 9:
            return _context5.abrupt("return", res.status(200).json(JSON.stringify(thisUser)));

          case 10:
            _context5.next = 16;
            break;

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](1);
            console.log();
            return _context5.abrupt("return", res.status(400).send("Unexpected error occurred when looking up user with id " + req.params.userId + " in database: " + _context5.t0));

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 12]]);
  }));

  return function (_x15, _x16, _x17) {
    return _ref5.apply(this, arguments);
  };
}()); //CREATE user route: Adds a new user account to the users collection (POST)

app.post('/users/:userId', /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee6(req, res, next) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("in /users route (POST) with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (!(req.body === undefined || !req.body.hasOwnProperty("type") || !req.body.hasOwnProperty("password") || !req.body.hasOwnProperty("displayName") || !req.body.hasOwnProperty("profilePicURL") || !req.body.hasOwnProperty("securityQuestion") || !req.body.hasOwnProperty("securityAnswer"))) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt("return", res.status(400).send("/users POST request formulated incorrectly. " + "It must contain 'type', 'password','displayName','profilePicURL','securityQuestion' and 'securityAnswer fields in message body."));

          case 3:
            _context6.prev = 3;
            _context6.next = 6;
            return User.findOne({
              id: req.params.userId
            });

          case 6:
            thisUser = _context6.sent;

            if (!thisUser) {
              _context6.next = 11;
              break;
            }

            //account already exists
            res.status(400).send("There is already an account with email '" + req.params.userId + "'.");
            _context6.next = 15;
            break;

          case 11:
            _context6.next = 13;
            return new User({
              type: req.body.type,
              id: req.params.userId,
              password: req.body.password,
              displayName: req.body.displayName,
              authStrategy: 'local',
              profilePicURL: req.body.profilePicURL,
              securityQuestion: req.body.securityQuestion,
              securityAnswer: req.body.securityAnswer,
              rounds: [],
              appointments: [],
              card: []
            }).save();

          case 13:
            thisUser = _context6.sent;
            return _context6.abrupt("return", res.status(201).send("New account for '" + req.params.userId + "' successfully created."));

          case 15:
            _context6.next = 20;
            break;

          case 17:
            _context6.prev = 17;
            _context6.t0 = _context6["catch"](3);
            return _context6.abrupt("return", res.status(400).send("Unexpected error occurred when adding or looking up user in database. " + _context6.t0));

          case 20:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[3, 17]]);
  }));

  return function (_x18, _x19, _x20) {
    return _ref6.apply(this, arguments);
  };
}()); //UPDATE user route: Updates a new user account in the users collection (POST)

app.put('/users/:userId', /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee7(req, res, next) {
    var validProps, bodyProp, status;
    return _regeneratorRuntime["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.log("in /users update route (PUT) with userId = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (req.params.hasOwnProperty("userId")) {
              _context7.next = 3;
              break;
            }

            return _context7.abrupt("return", res.status(400).send("users/ PUT request formulated incorrectly." + "It must contain 'userId' as parameter."));

          case 3:
            validProps = ['password', 'displayName', 'profilePicURL', 'securityQuestion', 'securityAnswer'];
            _context7.t0 = _regeneratorRuntime["default"].keys(req.body);

          case 5:
            if ((_context7.t1 = _context7.t0()).done) {
              _context7.next = 11;
              break;
            }

            bodyProp = _context7.t1.value;

            if (validProps.includes(bodyProp)) {
              _context7.next = 9;
              break;
            }

            return _context7.abrupt("return", res.status(400).send("users/ PUT request formulated incorrectly." + "Only the following props are allowed in body: " + "'password', 'displayname', 'profilePicURL', 'securityQuestion', 'securityAnswer'"));

          case 9:
            _context7.next = 5;
            break;

          case 11:
            _context7.prev = 11;
            _context7.next = 14;
            return User.updateOne({
              id: req.params.userId
            }, {
              $set: req.body
            });

          case 14:
            status = _context7.sent;

            if (status.nModified != 1) {
              //account could not be found
              res.status(404).send("No user account " + req.params.userId + " exists. Account could not be updated.");
            } else {
              res.status(200).send("User account " + req.params.userId + " successfully updated.");
            }

            _context7.next = 21;
            break;

          case 18:
            _context7.prev = 18;
            _context7.t2 = _context7["catch"](11);
            res.status(400).send("Unexpected error occurred when updating user data in database: " + _context7.t2);

          case 21:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[11, 18]]);
  }));

  return function (_x21, _x22, _x23) {
    return _ref7.apply(this, arguments);
  };
}()); //DELETE user route: Deletes the document with the specified userId from users collection (DELETE)

app["delete"]('/users/:userId', /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee8(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            console.log("in /users route (DELETE) with userId = " + JSON.stringify(req.params.userId));
            _context8.prev = 1;
            _context8.next = 4;
            return User.deleteOne({
              id: req.params.userId
            });

          case 4:
            status = _context8.sent;

            if (!(status.deletedCount != 1)) {
              _context8.next = 9;
              break;
            }

            return _context8.abrupt("return", res.status(404).send("No user account " + req.params.userId + " was found. Account could not be deleted."));

          case 9:
            return _context8.abrupt("return", res.status(200).send("User account " + req.params.userId + " was successfully deleted."));

          case 10:
            _context8.next = 16;
            break;

          case 12:
            _context8.prev = 12;
            _context8.t0 = _context8["catch"](1);
            console.log();
            return _context8.abrupt("return", res.status(400).send("Unexpected error occurred when attempting to delete user account with id " + req.params.userId + ": " + _context8.t0));

          case 16:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[1, 12]]);
  }));

  return function (_x24, _x25, _x26) {
    return _ref8.apply(this, arguments);
  };
}()); /////////////////////////////////
//ROUNDS ROUTES
////////////////////////////////
//CREATE round route: Adds a new round as a subdocument to 
//a document in the users collection (POST)

app.post('/rounds/:userId', /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee9(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            console.log("in /rounds (POST) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (!(!req.body.hasOwnProperty("date") || !req.body.hasOwnProperty("course") || !req.body.hasOwnProperty("type") || !req.body.hasOwnProperty("holes") || !req.body.hasOwnProperty("strokes") || !req.body.hasOwnProperty("minutes") || !req.body.hasOwnProperty("seconds") || !req.body.hasOwnProperty("notes"))) {
              _context9.next = 3;
              break;
            }

            return _context9.abrupt("return", res.status(400).send("POST request on /rounds formulated incorrectly." + "Body must contain all 8 required fields: date, course, type, holes, strokes, " + "minutes, seconds, notes."));

          case 3:
            _context9.prev = 3;
            _context9.next = 6;
            return User.updateOne({
              id: req.params.userId
            }, {
              $push: {
                rounds: req.body
              }
            });

          case 6:
            status = _context9.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when adding round to" + " database. Round was not added.");
            } else {
              res.status(200).send("Round successfully added to database.");
            }

            _context9.next = 14;
            break;

          case 10:
            _context9.prev = 10;
            _context9.t0 = _context9["catch"](3);
            console.log(_context9.t0);
            return _context9.abrupt("return", res.status(400).send("Unexpected error occurred when adding round" + " to database: " + _context9.t0));

          case 14:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[3, 10]]);
  }));

  return function (_x27, _x28, _x29) {
    return _ref9.apply(this, arguments);
  };
}()); //READ round route: Returns all rounds associated 
//with a given user in the users collection (GET)

app.get('/rounds/:userId', /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee10(req, res) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            console.log("in /rounds route (GET) with userId = " + JSON.stringify(req.params.userId));
            _context10.prev = 1;
            _context10.next = 4;
            return User.findOne({
              id: req.params.userId
            });

          case 4:
            thisUser = _context10.sent;

            if (thisUser) {
              _context10.next = 9;
              break;
            }

            return _context10.abrupt("return", res.status(400).message("No user account with specified userId was found in database."));

          case 9:
            return _context10.abrupt("return", res.status(200).json(JSON.stringify(thisUser.rounds)));

          case 10:
            _context10.next = 16;
            break;

          case 12:
            _context10.prev = 12;
            _context10.t0 = _context10["catch"](1);
            console.log();
            return _context10.abrupt("return", res.status(400).message("Unexpected error occurred when looking up user in database: " + _context10.t0));

          case 16:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[1, 12]]);
  }));

  return function (_x30, _x31) {
    return _ref10.apply(this, arguments);
  };
}()); //UPDATE round route: Updates a specific round 
//for a given user in the users collection (PUT)

app.put('/rounds/:userId/:roundId', /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee11(req, res, next) {
    var validProps, bodyObj, bodyProp, status;
    return _regeneratorRuntime["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            console.log("in /rounds (PUT) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));
            validProps = ['date', 'course', 'type', 'holes', 'strokes', 'minutes', 'seconds', 'notes'];
            bodyObj = _objectSpread({}, req.body);
            delete bodyObj._id; //Not needed for update

            delete bodyObj.SGS; //We'll compute this below in seconds.

            _context11.t0 = _regeneratorRuntime["default"].keys(bodyObj);

          case 6:
            if ((_context11.t1 = _context11.t0()).done) {
              _context11.next = 16;
              break;
            }

            bodyProp = _context11.t1.value;

            if (validProps.includes(bodyProp)) {
              _context11.next = 12;
              break;
            }

            return _context11.abrupt("return", res.status(400).send("rounds/ PUT request formulated incorrectly." + "It includes " + bodyProp + ". However, only the following props are allowed: " + "'date', 'course', 'type', 'holes', 'strokes', " + "'minutes', 'seconds', 'notes'"));

          case 12:
            bodyObj["rounds.$." + bodyProp] = bodyObj[bodyProp];
            delete bodyObj[bodyProp];

          case 14:
            _context11.next = 6;
            break;

          case 16:
            _context11.prev = 16;
            _context11.next = 19;
            return User.updateOne({
              "id": req.params.userId,
              "rounds._id": _mongoose["default"].Types.ObjectId(req.params.roundId)
            }, {
              "$set": bodyObj
            });

          case 19:
            status = _context11.sent;

            if (status.nModified != 1) {
              res.status(400).send("Unexpected error occurred when updating round in database. Round was not updated.");
            } else {
              res.status(200).send("Round successfully updated in database.");
            }

            _context11.next = 27;
            break;

          case 23:
            _context11.prev = 23;
            _context11.t2 = _context11["catch"](16);
            console.log(_context11.t2);
            return _context11.abrupt("return", res.status(400).send("Unexpected error occurred when updating round in database: " + _context11.t2));

          case 27:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[16, 23]]);
  }));

  return function (_x32, _x33, _x34) {
    return _ref11.apply(this, arguments);
  };
}()); //DELETE round route: Deletes a specific round 
//for a given user in the users collection (DELETE)

app["delete"]('/rounds/:userId/:roundId', /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee12(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            console.log("in /rounds (DELETE) route with params = " + JSON.stringify(req.params));
            _context12.prev = 1;
            _context12.next = 4;
            return User.updateOne({
              id: req.params.userId
            }, {
              $pull: {
                rounds: {
                  _id: _mongoose["default"].Types.ObjectId(req.params.roundId)
                }
              }
            });

          case 4:
            status = _context12.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when deleting round from database. Round was not deleted.");
            } else {
              res.status(200).send("Round successfully deleted from database.");
            }

            _context12.next = 12;
            break;

          case 8:
            _context12.prev = 8;
            _context12.t0 = _context12["catch"](1);
            console.log(_context12.t0);
            return _context12.abrupt("return", res.status(400).send("Unexpected error occurred when deleting round from database: " + _context12.t0));

          case 12:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[1, 8]]);
  }));

  return function (_x35, _x36, _x37) {
    return _ref12.apply(this, arguments);
  };
}()); /////////////////////////////////
//COURSES ROUTES
////////////////////////////////
// GET ALL COURSES IN THE DATABASE

app.get('/allcourses/', /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee13(req, res, next) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            console.log("in /allcourses route (GET)");
            _context13.prev = 1;
            _context13.next = 4;
            return Course.find({});

          case 4:
            thisUser = _context13.sent;

            if (thisUser) {
              _context13.next = 9;
              break;
            }

            return _context13.abrupt("return", res.status(404).send("Get ALL Courses failed"));

          case 9:
            return _context13.abrupt("return", res.status(200).json(JSON.stringify(thisUser)));

          case 10:
            _context13.next = 16;
            break;

          case 12:
            _context13.prev = 12;
            _context13.t0 = _context13["catch"](1);
            console.log();
            return _context13.abrupt("return", res.status(400).send("Unexpected error occurred when getting all Courses"));

          case 16:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[1, 12]]);
  }));

  return function (_x38, _x39, _x40) {
    return _ref13.apply(this, arguments);
  };
}()); //READ course route: Retrieves the course with the specified courseId from courses collection (GET)

app.get('/courses/:courseId', /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee14(req, res, next) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            console.log("in /courses route (GET) with courseId = " + JSON.stringify(req.params.courseId));
            _context14.prev = 1;
            _context14.next = 4;
            return Course.findOne({
              id: req.params.courseId
            });

          case 4:
            thisUser = _context14.sent;

            if (thisUser) {
              _context14.next = 9;
              break;
            }

            return _context14.abrupt("return", res.status(404).send("No user account with id " + req.params.courseId + " was found in database."));

          case 9:
            return _context14.abrupt("return", res.status(200).json(JSON.stringify(thisUser)));

          case 10:
            _context14.next = 16;
            break;

          case 12:
            _context14.prev = 12;
            _context14.t0 = _context14["catch"](1);
            console.log();
            return _context14.abrupt("return", res.status(400).send("Unexpected error occurred when looking up user with id " + req.params.courseId + " in database: " + _context14.t0));

          case 16:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[1, 12]]);
  }));

  return function (_x41, _x42, _x43) {
    return _ref14.apply(this, arguments);
  };
}()); //CREATE course route: Adds a new course as a subdocument to 
//a document in the courses collection (POST)

app.post('/courses/:courseId', /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee15(req, res, next) {
    var thisCourse;
    return _regeneratorRuntime["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            console.log("in /courses (POST) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (!(!req.body.hasOwnProperty("courseName") || !req.body.hasOwnProperty("rating") || !req.body.hasOwnProperty("review") || !req.body.hasOwnProperty("picture") || !req.body.hasOwnProperty("location") || !req.body.hasOwnProperty("yardage") || !req.body.hasOwnProperty("runningDistance") || !req.body.hasOwnProperty("timePar") || !req.body.hasOwnProperty("bestScore") || !req.body.hasOwnProperty("recordHolder") || !req.body.hasOwnProperty("rateSenior") || !req.body.hasOwnProperty("rateStandard"))) {
              _context15.next = 3;
              break;
            }

            return _context15.abrupt("return", res.status(400).send("POST request on /course formulated incorrectly." + "Body must contain all 8 required fields: courseName, rating, review, picture, location, yardage, runningDistance, timePar, bestScore, recordHolder, rateSenior, rateStandard."));

          case 3:
            _context15.prev = 3;
            _context15.next = 6;
            return Course.findOne({
              id: req.params.courseId
            });

          case 6:
            thisCourse = _context15.sent;

            if (!thisCourse) {
              _context15.next = 11;
              break;
            }

            //course already exists
            res.status(400).send("There is already an course with this name '" + req.params.courseId + "'.");
            _context15.next = 15;
            break;

          case 11:
            _context15.next = 13;
            return new Course({
              courseName: req.body.courseName,
              id: req.params.courseId,
              rating: req.body.rating,
              review: req.body.review,
              picture: req.body.picture,
              location: req.body.location,
              yardage: req.body.yardage,
              runningDistance: req.body.runningDistance,
              timePar: req.body.timePar,
              bestScore: req.body.bestScore,
              recordHolder: req.body.recordHolder,
              rateSenior: req.body.rateSenior,
              rateStandard: req.body.rateStandard,
              availability: req.body.availability
            }).save();

          case 13:
            thisCourse = _context15.sent;
            return _context15.abrupt("return", res.status(200).send("New course for '" + req.params.courseId + "' successfully created."));

          case 15:
            _context15.next = 20;
            break;

          case 17:
            _context15.prev = 17;
            _context15.t0 = _context15["catch"](3);
            return _context15.abrupt("return", res.status(400).send("Unexpected error occurred when adding or looking up course in database. " + _context15.t0));

          case 20:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[3, 17]]);
  }));

  return function (_x44, _x45, _x46) {
    return _ref15.apply(this, arguments);
  };
}()); //UPDATE course route: Updates a new course information in the courses collection (POST)

app.put('/courses/:courseId', /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee16(req, res, next) {
    var validProps, bodyProp, status;
    return _regeneratorRuntime["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            console.log("in /courses update route (PUT) with courseId = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (req.params.hasOwnProperty("courseId")) {
              _context16.next = 3;
              break;
            }

            return _context16.abrupt("return", res.status(400).send("courses/ PUT request formulated incorrectly." + "It must contain 'courseId' as parameter."));

          case 3:
            validProps = ['availability', 'courseName', 'id', 'rating', 'review', 'picture', 'location', 'yardage', 'runningDistance', 'timePar', 'bestScore', 'recordHolder', 'rateSenior', 'rateStandard'];
            _context16.t0 = _regeneratorRuntime["default"].keys(req.body);

          case 5:
            if ((_context16.t1 = _context16.t0()).done) {
              _context16.next = 11;
              break;
            }

            bodyProp = _context16.t1.value;

            if (validProps.includes(bodyProp)) {
              _context16.next = 9;
              break;
            }

            return _context16.abrupt("return", res.status(400).send("courses/ PUT request formulated incorrectly." + "Only the following props are allowed in body: " + "'availability', 'courseName', 'id', 'rating', 'review', 'picture', 'location', 'yardage', 'runningDistance', 'timePar', 'bestScore', 'recordHolder', 'rateSenior', 'rateStandard'"));

          case 9:
            _context16.next = 5;
            break;

          case 11:
            _context16.prev = 11;
            _context16.next = 14;
            return Course.updateOne({
              id: req.params.courseId
            }, {
              $set: req.body
            });

          case 14:
            status = _context16.sent;
            res.status(200).send("Course " + req.params.courseId + " successfully updated.");
            _context16.next = 21;
            break;

          case 18:
            _context16.prev = 18;
            _context16.t2 = _context16["catch"](11);
            res.status(400).send("Unexpected error occurred when updating course data in database: " + _context16.t2);

          case 21:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[11, 18]]);
  }));

  return function (_x47, _x48, _x49) {
    return _ref16.apply(this, arguments);
  };
}()); //DELETE course route: Deletes a specific course 
//for a given id in the course collection (DELETE)

app["delete"]('/courses/:courseId', /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee17(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            console.log("in /courses route (DELETE) with courseId = " + JSON.stringify(req.params.courseId));
            _context17.prev = 1;
            _context17.next = 4;
            return Course.deleteOne({
              id: req.params.courseId
            });

          case 4:
            status = _context17.sent;

            if (!(status.deletedCount != 1)) {
              _context17.next = 9;
              break;
            }

            return _context17.abrupt("return", res.status(404).send("No course " + req.params.courseId + " was found. Course could not be deleted."));

          case 9:
            return _context17.abrupt("return", res.status(200).send("Course " + req.params.courseId + " was successfully deleted."));

          case 10:
            _context17.next = 16;
            break;

          case 12:
            _context17.prev = 12;
            _context17.t0 = _context17["catch"](1);
            console.log();
            return _context17.abrupt("return", res.status(400).send("Unexpected error occurred when attempting to delete course with id " + req.params.courseId + ": " + _context17.t0));

          case 16:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[1, 12]]);
  }));

  return function (_x50, _x51, _x52) {
    return _ref17.apply(this, arguments);
  };
}()); /////////////////////////////////
//APPOINTMENTS ROUTES
////////////////////////////////
//CREATE appointment route: Adds a new appointment as a subdocument to 
//a document in the users collection (POST)

app.post('/appointments/:userId', /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee18(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            console.log("in /appointments (POST) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (!(!req.body.hasOwnProperty("userId") || !req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("courseName") || !req.body.hasOwnProperty("date") || !req.body.hasOwnProperty("time") || !req.body.hasOwnProperty("paid"))) {
              _context18.next = 3;
              break;
            }

            return _context18.abrupt("return", res.status(400).send("POST request on /appointments formulated incorrectly." + "Body must contain all 6 required fields: userId, username, courseName, date, time, paid"));

          case 3:
            _context18.prev = 3;
            _context18.next = 6;
            return User.updateOne({
              id: req.params.userId
            }, {
              $push: {
                appointments: req.body
              }
            });

          case 6:
            status = _context18.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when adding appointment to" + " database. Appointment was not added.");
            } else {
              res.status(200).send("Appointment successfully added to database.");
            }

            _context18.next = 14;
            break;

          case 10:
            _context18.prev = 10;
            _context18.t0 = _context18["catch"](3);
            console.log(_context18.t0);
            return _context18.abrupt("return", res.status(400).send("Unexpected error occurred when adding appointment" + " to database: " + _context18.t0));

          case 14:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[3, 10]]);
  }));

  return function (_x53, _x54, _x55) {
    return _ref18.apply(this, arguments);
  };
}()); //READ appointment route: Returns all appointments associated 
//with a given user in the users collection (GET)

app.get('/appointments/:userId', /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee19(req, res) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            console.log("in /appointments route (GET) with userId = " + JSON.stringify(req.params.userId));
            _context19.prev = 1;
            _context19.next = 4;
            return User.findOne({
              id: req.params.userId
            });

          case 4:
            thisUser = _context19.sent;

            if (thisUser) {
              _context19.next = 9;
              break;
            }

            return _context19.abrupt("return", res.status(400).message("No user account with specified userId was found in database."));

          case 9:
            return _context19.abrupt("return", res.status(200).json(JSON.stringify(thisUser.appointments)));

          case 10:
            _context19.next = 16;
            break;

          case 12:
            _context19.prev = 12;
            _context19.t0 = _context19["catch"](1);
            console.log();
            return _context19.abrupt("return", res.status(400).message("Unexpected error occurred when looking up user in database: " + _context19.t0));

          case 16:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[1, 12]]);
  }));

  return function (_x56, _x57) {
    return _ref19.apply(this, arguments);
  };
}()); //UPDATE appointments route: Updates a specific appointment 
//for a given user in the users collection (PUT)

app.put('/appointments/:userId/:appointmentId', /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee20(req, res, next) {
    var validProps, bodyObj, bodyProp, status;
    return _regeneratorRuntime["default"].wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            console.log("in /appointments (PUT) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));
            validProps = ['userId', 'username', 'courseName', 'date', 'time', 'paid'];
            bodyObj = _objectSpread({}, req.body); // delete bodyObj._id; //Not needed for update
            // delete bodyObj.SGS; //We'll compute this below in seconds.

            _context20.t0 = _regeneratorRuntime["default"].keys(bodyObj);

          case 4:
            if ((_context20.t1 = _context20.t0()).done) {
              _context20.next = 14;
              break;
            }

            bodyProp = _context20.t1.value;

            if (validProps.includes(bodyProp)) {
              _context20.next = 10;
              break;
            }

            return _context20.abrupt("return", res.status(400).send("appointments/ PUT request formulated incorrectly." + "It includes " + bodyProp + ". However, only the following props are allowed: " + "'userId', 'username', 'courseName', 'date', 'time', 'paid'"));

          case 10:
            bodyObj["appointments.$." + bodyProp] = bodyObj[bodyProp];
            delete bodyObj[bodyProp];

          case 12:
            _context20.next = 4;
            break;

          case 14:
            _context20.prev = 14;
            _context20.next = 17;
            return User.updateOne({
              "id": req.params.userId,
              "appointments._id": _mongoose["default"].Types.ObjectId(req.params.appointmentId)
            }, {
              "$set": bodyObj
            });

          case 17:
            status = _context20.sent;

            if (status.nModified != 1) {
              res.status(400).send("Unexpected error occurred when updating appointment in database. Appointment was not updated.");
            } else {
              res.status(200).send("Appointment successfully updated in database.");
            }

            _context20.next = 25;
            break;

          case 21:
            _context20.prev = 21;
            _context20.t2 = _context20["catch"](14);
            console.log(_context20.t2);
            return _context20.abrupt("return", res.status(400).send("Unexpected error occurred when updating appointment in database: " + _context20.t2));

          case 25:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, null, [[14, 21]]);
  }));

  return function (_x58, _x59, _x60) {
    return _ref20.apply(this, arguments);
  };
}()); //DELETE round route: Deletes a specific round 
//for a given user in the users collection (DELETE)

app["delete"]('/appointments/:username/:courseName/:date/:time/:userId', /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee21(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            console.log("in /appointments (DELETE) route with params = " + JSON.stringify(req.params));
            _context21.prev = 1;
            _context21.next = 4;
            return User.updateOne({
              id: req.params.userId
            }, {
              $pull: {
                appointments: {
                  username: req.params.username,
                  courseName: req.params.courseName,
                  date: req.params.date,
                  time: req.params.time
                }
              }
            });

          case 4:
            status = _context21.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when deleting appointment from database. Appointment was not deleted.");
            } else {
              res.status(200).send("Appointment successfully deleted from database.");
            }

            _context21.next = 12;
            break;

          case 8:
            _context21.prev = 8;
            _context21.t0 = _context21["catch"](1);
            console.log(_context21.t0);
            return _context21.abrupt("return", res.status(400).send("Unexpected error occurred when deleting appointment from database: " + _context21.t0));

          case 12:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, null, [[1, 8]]);
  }));

  return function (_x61, _x62, _x63) {
    return _ref21.apply(this, arguments);
  };
}()); /////////////////////////////////
//APPOINTMENTS_OP ROUTES
////////////////////////////////
//CREATE appointment route: Adds a new appoint as a subdocument to 
//a document in the apoointments collection (POST)

app.post('/appointments_op/', /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee22(req, res, next) {
    var thisAppointment;
    return _regeneratorRuntime["default"].wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            console.log("in /appointment_op (POST) route with body = " + JSON.stringify(req.body));

            if (!(!req.body.hasOwnProperty("userId") || !req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("courseName") || !req.body.hasOwnProperty("date") || !req.body.hasOwnProperty("time") || !req.body.hasOwnProperty("paid"))) {
              _context22.next = 3;
              break;
            }

            return _context22.abrupt("return", res.status(400).send("POST request on /appointment_op formulated incorrectly." + "Body must contain all 6 required fields: userId, username, courseName, date, time, paid."));

          case 3:
            _context22.prev = 3;
            _context22.next = 6;
            return new Appointment({
              userId: req.body.userId,
              username: req.body.username,
              courseName: req.body.courseName,
              date: req.body.date,
              time: req.body.time,
              paid: req.body.paid
            }).save();

          case 6:
            thisAppointment = _context22.sent;
            return _context22.abrupt("return", res.status(200).send("New appointment for '" + req.body.userId + "' successfully created."));

          case 10:
            _context22.prev = 10;
            _context22.t0 = _context22["catch"](3);
            return _context22.abrupt("return", res.status(400).send("Unexpected error occurred when adding or looking up appointment in database. " + _context22.t0));

          case 13:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22, null, [[3, 10]]);
  }));

  return function (_x64, _x65, _x66) {
    return _ref22.apply(this, arguments);
  };
}()); //READ appointment route: Returns all appointments

app.get('/allappointments_op/', /*#__PURE__*/function () {
  var _ref23 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee23(req, res) {
    var allAppointment;
    return _regeneratorRuntime["default"].wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            console.log("in /allappointments_op route (GET)");
            _context23.prev = 1;
            _context23.next = 4;
            return Appointment.find({});

          case 4:
            allAppointment = _context23.sent;
            return _context23.abrupt("return", res.status(200).json(JSON.stringify(allAppointment)));

          case 8:
            _context23.prev = 8;
            _context23.t0 = _context23["catch"](1);
            console.log();
            return _context23.abrupt("return", res.status(400).message("Unexpected error occurred when getting all appointments from database: " + _context23.t0));

          case 12:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23, null, [[1, 8]]);
  }));

  return function (_x67, _x68) {
    return _ref23.apply(this, arguments);
  };
}()); //DELETE course route: Deletes a specific course 
//for a given id in the course collection (DELETE)

app["delete"]('/appointments_op/:username/:courseName/:date/:time', /*#__PURE__*/function () {
  var _ref24 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee24(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            console.log("in /appointments_op (DELETE) route with params = " + JSON.stringify(req.params));
            _context24.prev = 1;
            _context24.next = 4;
            return Appointment.deleteOne({
              username: req.params.username,
              courseName: req.params.courseName,
              date: req.params.date,
              time: req.params.time
            });

          case 4:
            status = _context24.sent;
            res.status(200).send("appointments successfully deleted from database.");
            _context24.next = 12;
            break;

          case 8:
            _context24.prev = 8;
            _context24.t0 = _context24["catch"](1);
            console.log(_context24.t0);
            return _context24.abrupt("return", res.status(400).send("Unexpected error occurred when deleting appointments from database: " + _context24.t0));

          case 12:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24, null, [[1, 8]]);
  }));

  return function (_x69, _x70, _x71) {
    return _ref24.apply(this, arguments);
  };
}()); //UPDATE appointment route: Updates a new appointment information in the appointments collection (POST)

app.put('/appointments_op/:username/:courseName/:date/:time', /*#__PURE__*/function () {
  var _ref25 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee25(req, res, next) {
    var validProps, bodyProp, status;
    return _regeneratorRuntime["default"].wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            console.log("in /appointments_op update route (PUT) with body = " + JSON.stringify(req.body));
            validProps = ['userId', 'username', 'courseName', 'date', 'time', 'paid'];
            _context25.t0 = _regeneratorRuntime["default"].keys(req.body);

          case 3:
            if ((_context25.t1 = _context25.t0()).done) {
              _context25.next = 9;
              break;
            }

            bodyProp = _context25.t1.value;

            if (validProps.includes(bodyProp)) {
              _context25.next = 7;
              break;
            }

            return _context25.abrupt("return", res.status(400).send("appointments/ PUT request formulated incorrectly." + "It includes " + bodyProp + ". However, only the following props are allowed: " + "'userId', 'username', 'courseName', 'date', 'time', 'paid'"));

          case 7:
            _context25.next = 3;
            break;

          case 9:
            _context25.prev = 9;
            _context25.next = 12;
            return Appointment.updateOne({
              username: req.params.username,
              courseName: req.params.courseName,
              date: req.params.date,
              time: req.params.time
            }, {
              $set: req.body
            });

          case 12:
            status = _context25.sent;
            res.status(200).send("Appointment successfully paid.");
            _context25.next = 19;
            break;

          case 16:
            _context25.prev = 16;
            _context25.t2 = _context25["catch"](9);
            res.status(400).send("Unexpected error occurred when updating appointment data in database: " + _context25.t2);

          case 19:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25, null, [[9, 16]]);
  }));

  return function (_x72, _x73, _x74) {
    return _ref25.apply(this, arguments);
  };
}()); /////////////////////////////////
//CARD ROUTES
////////////////////////////////
//CREATE card route: Adds a new card as a subdocument to 
//a document in the cards collection (POST)

app.post('/cards/:userId', /*#__PURE__*/function () {
  var _ref26 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee26(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            console.log("in /cards (POST) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (!(!req.body.hasOwnProperty("name") || !req.body.hasOwnProperty("number") || !req.body.hasOwnProperty("expDate"))) {
              _context26.next = 3;
              break;
            }

            return _context26.abrupt("return", res.status(400).send("POST request on /cards formulated incorrectly." + "Body must contain all 3 required fields: name, numner, expDate."));

          case 3:
            _context26.prev = 3;
            _context26.next = 6;
            return User.updateOne({
              id: req.params.userId
            }, {
              $push: {
                card: req.body
              }
            });

          case 6:
            status = _context26.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when adding card to database. Card was not added.");
            } else {
              res.status(200).send("Card successfully added to database.");
            }

            _context26.next = 14;
            break;

          case 10:
            _context26.prev = 10;
            _context26.t0 = _context26["catch"](3);
            console.log(_context26.t0);
            return _context26.abrupt("return", res.status(400).send("Unexpected error occurred when adding card to database: " + _context26.t0));

          case 14:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26, null, [[3, 10]]);
  }));

  return function (_x75, _x76, _x77) {
    return _ref26.apply(this, arguments);
  };
}()); //READ card route: Returns cards associated 
//with a given user in the users collection (GET)

app.get('/cards/:userId', /*#__PURE__*/function () {
  var _ref27 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee27(req, res) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            console.log("in /cards route (GET) with userId = " + JSON.stringify(req.params.userId));
            _context27.prev = 1;
            _context27.next = 4;
            return User.findOne({
              id: req.params.userId
            });

          case 4:
            thisUser = _context27.sent;

            if (thisUser) {
              _context27.next = 9;
              break;
            }

            return _context27.abrupt("return", res.status(400).message("No user account with specified userId was found in database."));

          case 9:
            return _context27.abrupt("return", res.status(200).json(JSON.stringify(thisUser.card)));

          case 10:
            _context27.next = 16;
            break;

          case 12:
            _context27.prev = 12;
            _context27.t0 = _context27["catch"](1);
            console.log();
            return _context27.abrupt("return", res.status(400).message("Unexpected error occurred when looking up user in database: " + _context27.t0));

          case 16:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27, null, [[1, 12]]);
  }));

  return function (_x78, _x79) {
    return _ref27.apply(this, arguments);
  };
}()); //UPDATE card route: Updates a specific card 
//for a given user in the users collection (PUT)

app.put('/cards/:userId/:cardId', /*#__PURE__*/function () {
  var _ref28 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee28(req, res, next) {
    var validProps, bodyObj, bodyProp, status;
    return _regeneratorRuntime["default"].wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            console.log("in /cards (PUT) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));
            validProps = ['name', 'number', 'expDate'];
            bodyObj = _objectSpread({}, req.body); // delete bodyObj._id; //Not needed for update
            // delete bodyObj.SGS; //We'll compute this below in seconds.

            _context28.t0 = _regeneratorRuntime["default"].keys(bodyObj);

          case 4:
            if ((_context28.t1 = _context28.t0()).done) {
              _context28.next = 14;
              break;
            }

            bodyProp = _context28.t1.value;

            if (validProps.includes(bodyProp)) {
              _context28.next = 10;
              break;
            }

            return _context28.abrupt("return", res.status(400).send("cards/ PUT request formulated incorrectly." + "It includes " + bodyProp + ". However, only the following props are allowed: " + "'name', 'number', 'expDate'"));

          case 10:
            bodyObj["card.$." + bodyProp] = bodyObj[bodyProp];
            delete bodyObj[bodyProp];

          case 12:
            _context28.next = 4;
            break;

          case 14:
            _context28.prev = 14;
            _context28.next = 17;
            return User.updateOne({
              "id": req.params.userId,
              "card._id": _mongoose["default"].Types.ObjectId(req.params.cardId)
            }, {
              "$set": bodyObj
            });

          case 17:
            status = _context28.sent;

            if (status.nModified != 1) {
              res.status(400).send("Unexpected error occurred when updating card in database. Card was not updated.");
            } else {
              res.status(200).send("Card successfully updated in database.");
            }

            _context28.next = 25;
            break;

          case 21:
            _context28.prev = 21;
            _context28.t2 = _context28["catch"](14);
            console.log(_context28.t2);
            return _context28.abrupt("return", res.status(400).send("Unexpected error occurred when updating card in database: " + _context28.t2));

          case 25:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28, null, [[14, 21]]);
  }));

  return function (_x80, _x81, _x82) {
    return _ref28.apply(this, arguments);
  };
}()); //DELETE card route: Deletes a specific card 
//for a given user in the users collection (DELETE)

app["delete"]('/cards/:userId/:cardId', /*#__PURE__*/function () {
  var _ref29 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee29(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            console.log("in /cards (DELETE) route with params = " + JSON.stringify(req.params));
            _context29.prev = 1;
            _context29.next = 4;
            return User.updateOne({
              id: req.params.userId
            }, {
              $pull: {
                card: {
                  _id: _mongoose["default"].Types.ObjectId(req.params.cardId)
                }
              }
            });

          case 4:
            status = _context29.sent;
            res.status(200).send("Card successfully deleted from database.");
            _context29.next = 12;
            break;

          case 8:
            _context29.prev = 8;
            _context29.t0 = _context29["catch"](1);
            console.log(_context29.t0);
            return _context29.abrupt("return", res.status(400).send("Unexpected error occurred when deleting card from database: " + _context29.t0));

          case 12:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29, null, [[1, 8]]);
  }));

  return function (_x83, _x84, _x85) {
    return _ref29.apply(this, arguments);
  };
}());
