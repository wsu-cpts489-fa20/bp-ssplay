//////////////////////////////////////////////////////////////////////////
//IMPORTS AND VARIABLE INITIALIZATIONS
//The following code imports necessary dependencies and initializes
//variables used in the server middleware.
//////////////////////////////////////////////////////////////////////////
import passport from 'passport';
import passportGithub from 'passport-github'; 
import passportGoogle from 'passport-google-oauth2'; 
import passportLocal from 'passport-local';
import session from 'express-session';
import regeneratorRuntime from "regenerator-runtime";
import path from 'path';
import express from 'express';
require('dotenv').config();

const LOCAL_PORT = 8080;
// const DEPLOY_URL = "http://localhost:8080";
// const DEPLOY_URL = "http://ssplay.us-west-2.elasticbeanstalk.com";
const DEPLOY_URL = "https://ssplay.bfapp.org";
const PORT = process.env.HTTP_PORT || LOCAL_PORT;
const GithubStrategy = passportGithub.Strategy;
const GoogleStrategy = passportGoogle.Strategy;
const LocalStrategy = passportLocal.Strategy;
const app = express();

//////////////////////////////////////////////////////////////////////////
//MONGOOSE SET-UP
//The following code sets up the app to connect to a MongoDB database
//using the mongoose library.
//////////////////////////////////////////////////////////////////////////
import mongoose from 'mongoose';

const connectStr = process.env.MONGO_STR;
mongoose.connect(connectStr, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(
    () =>  {console.log(`Connected to ${connectStr}.`)},
    err => {console.error(`Error connecting to ${connectStr}: ${err}`)}
  );

const Schema = mongoose.Schema;
const roundSchema = new Schema({
  date: {type: Date, required: true},
  course: {type: String, required: true},
  type: {type: String, required: true, enum: ['practice','tournament']},
  holes: {type: Number, required: true, min: 1, max: 18},
  strokes: {type: Number, required: true, min: 1, max: 300},
  minutes: {type: Number, required: true, min: 1, max: 240},
  seconds: {type: Number, required: true, min: 0, max: 60},
  notes: {type: String, required: true}
},
{
  toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true 
  }
});

roundSchema.virtual('SGS').get(function() {
  return (this.strokes * 60) + (this.minutes * 60) + this.seconds;
});

const appointmentSchema = new Schema({
  userId: String,
  username: String,
  courseName: String,
  date: String,
  time: String,
  paid: String
},
{
  toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true 
  }
});

const courseSchema = new Schema({
  id: String,
  rating: String,
  review: String,
  picture: String, //link to course image
  location: String,
  yardage: String,
  runningDistance: String,
  timePar: String,
  bestScore: String,
  recordHolder: String,
  rateSenior: String,
  rateStandard: String,
  courseName: String
},
{
  toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true 
  }
});

const cardSchema = new Schema({
  name: {type: String, required: true},
  number: {type: Number, required: true},
  expDate: {type: String, required: true}
},
{
  toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true 
  }
});

//Define schema that maps to a document in the Users collection in the appdb
//database.
const userSchema = new Schema({
  type: {type: String, required: true, enum: ['user','operator']},
  id: String, //unique identifier for user
  password: String,
  displayName: String, //Name to be displayed within app
  authStrategy: String, //strategy used to authenticate, e.g., github, local
  profilePicURL: String, //link to profile image
  securityQuestion: String,
  securityAnswer: {type: String, required: function() 
    {return this.securityQuestion ? true: false}},
  rounds: [roundSchema],
  appointments: [appointmentSchema],
  card: [cardSchema]
});
const User = mongoose.model("User",userSchema); 
const Course = mongoose.model("Course",courseSchema); 
const Appointment = mongoose.model("Appointment",appointmentSchema); 

//////////////////////////////////////////////////////////////////////////
//PASSPORT SET-UP
//The following code sets up the app with OAuth authentication using
//the 'github' strategy in passport.js.
//////////////////////////////////////////////////////////////////////////
passport.use(new GithubStrategy({
    clientID: 'b52c7ff0ca7afdb783d1',
    clientSecret: 'de044810b3d6e85aa53cbcf84ae50070199a09fd',
    callbackURL: DEPLOY_URL + "/auth/github/callback"
  },
  //The following function is called after user authenticates with github
  async (accessToken, refreshToken, profile, done) => {
    console.log("User authenticated through GitHub! In passport callback.");
    //Our convention is to build userId from displayName and provider
    const userId = `${profile.username}@${profile.provider}`;
    //See if document with this unique userId exists in database 
    let currentUser = await User.findOne({id: userId});
    if (!currentUser) { //Add this user to the database
        currentUser = await new User({
        type: "operator",
        id: userId,
        displayName: profile.displayName,
        authStrategy: profile.provider,
        profilePicURL: profile.photos[0].value,
        rounds: [],
        appointments: [],
        card: []
      }).save();
  }
  return done(null,currentUser);
}));

passport.use(new GoogleStrategy({
  clientID: '909887696769-o31hn2i23rmajsov9oal8vftfu1e4n1r.apps.googleusercontent.com',
  clientSecret: 'JmKC0RIuBWh3Cr9n_lddKF93',
  callbackURL: DEPLOY_URL + "/auth/google/callback",
},
  //The following function is called after user authenticates with github
  async (accessToken, refreshToken, profile, done) => {
    console.log("User authenticated through Google! In passport callback.");
    //Our convention is to build userId from displayName and provider
    const userId = `${profile.sub}@${profile.provider}`;
    //See if document with this unique userId exists in database 
    let currentUser = await User.findOne({id: userId});
    if (!currentUser) { //Add this user to the database
        currentUser = await new User({
        type: "user",
        id: userId,
        displayName: profile.displayName,
        authStrategy: profile.provider,
        profilePicURL: profile.photos[0].value,
        rounds: [],
        appointments: [],
        card: []
      }).save();
  }
  return done(null,currentUser);
}));

passport.use(new LocalStrategy({passReqToCallback: true},
  //Called when user is attempting to log in with local username and password. 
  //userId contains the email address entered into the form and password
  //contains the password entered into the form.
  async (req, userId, password, done) => {
    let thisUser;
    try {
      thisUser = await User.findOne({id: userId});
      if (thisUser) {
        if (thisUser.password === password) {
          return done(null, thisUser);
        } else {
          req.authError = "The password is incorrect. Please try again" + 
                           " or reset your password.";
          return done(null, false)
        }
      } else { //userId not found in DB
        req.authError = "There is no account with email " + userId + 
                        ". Please try again.";
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  }
));

//Serialize the current user to the session
passport.serializeUser((user, done) => {
    console.log("In serializeUser.");
    console.log("Contents of user param: " + JSON.stringify(user));
    done(null,user.id);
});
  
//Deserialize the current user from the session
//to persistent storage.
passport.deserializeUser(async (userId, done) => {
  console.log("In deserializeUser.");
  console.log("Contents of userId param: " + userId);
  let thisUser;
  try {
    thisUser = await User.findOne({id: userId});
    console.log("User with id " + userId + 
      " found in DB. User object will be available in server routes as req.user.")
    done(null,thisUser);
  } catch (err) {
    done(err);
  }
});

//////////////////////////////////////////////////////////////////////////
//INITIALIZE EXPRESS APP
// The following code uses express.static to serve the React app defined 
//in the client/ directory at PORT. It also writes an express session
//to a cookie, and initializes a passport object to support OAuth.
/////////////////////////////////////////////////////////////////////////
app
  .use(session({secret: "speedgolf", 
                resave: false,
                saveUninitialized: false,
                cookie: {maxAge: 1000 * 60}}))
  .use(express.static(path.join(__dirname,"client/build")))
  .use(passport.initialize())
  .use(passport.session())
  .use(express.json({limit: '20mb'}))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

//////////////////////////////////////////////////////////////////////////
//DEFINE EXPRESS APP ROUTES
//////////////////////////////////////////////////////////////////////////

/////////////////////////
//AUTHENTICATION ROUTES
/////////////////////////

//AUTHENTICATE route: Uses passport to authenticate with GitHub.
//Should be accessed when user clicks on 'Login with GitHub' button on 
//Log In page.
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}));

//CALLBACK route:  GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    console.log("auth/github/callback reached.")
    res.redirect('/'); //sends user back to login screen; 
                       //req.isAuthenticated() indicates status
  }
);

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log("auth/google/callback reached.")
    res.redirect('/'); //sends user back to login screen; 
                       //req.isAuthenticated() indicates status
  }
);

//LOGOUT route: Use passport's req.logout() method to log the user out and
//redirect the user to the main app page. req.isAuthenticated() is toggled to false.
app.get('/auth/logout', (req, res) => {
    console.log('/auth/logout reached. Logging out');
    req.logout();
    res.redirect('/');
});

//TEST route: Tests whether user was successfully authenticated.
//Should be called from the React.js client to set up app state.
app.get('/auth/test', (req, res) => {
    console.log("auth/test reached.");
    const isAuth = req.isAuthenticated();
    if (isAuth) {
        console.log("User is authenticated");
        console.log("User record tied to session: " + JSON.stringify(req.user));
    } else {
        //User is not authenticated
        console.log("User is not authenticated");
    }
    //Return JSON object to client with results.
    res.json({isAuthenticated: isAuth, user: req.user});
});

//LOGIN route: Attempts to log in user using local strategy
app.post('/auth/login', 
  passport.authenticate('local', { failWithError: true }),
  (req, res) => {
    console.log("/login route reached: successful authentication.");
    //Redirect to app's main page; the /auth/test route should return true
    res.status(200).send("Login successful");
  },
  (err, req, res, next) => {
    console.log("/login route reached: unsuccessful authentication");
    if (req.authError) {
      console.log("req.authError: " + req.authError);
      res.status(401).send(req.authError);
    } else {
      res.status(401).send("Unexpected error occurred when attempting to authenticate. Please try again.");
    }
    //Note: Do NOT redirect! Client will take over.
  });

/////////////////////////////////
//USER ACCOUNT MANAGEMENT ROUTES
////////////////////////////////


//READ user route: Retrieves the user with the specified userId from users collection (GET)
app.get('/users/:userId', async(req, res, next) => {
  console.log("in /users route (GET) with userId = " + 
    JSON.stringify(req.params.userId));
  try {
    let thisUser = await User.findOne({id: req.params.userId});
    if (!thisUser) {
      return res.status(404).send("No user account with id " +
        req.params.userId + " was found in database.");
    } else {
      return res.status(200).json(JSON.stringify(thisUser));
    }
  } catch (err) {
    console.log()
    return res.status(400).send("Unexpected error occurred when looking up user with id " +
      req.params.userId + " in database: " + err);
  }
});

//CREATE user route: Adds a new user account to the users collection (POST)
app.post('/users/:userId',  async (req, res, next) => {
  console.log("in /users route (POST) with params = " + JSON.stringify(req.params) +
    " and body = " + JSON.stringify(req.body));  
  if (req.body === undefined ||
      !req.body.hasOwnProperty("type") || 
      !req.body.hasOwnProperty("password") || 
      !req.body.hasOwnProperty("displayName") ||
      !req.body.hasOwnProperty("profilePicURL") ||
      !req.body.hasOwnProperty("securityQuestion") ||
      !req.body.hasOwnProperty("securityAnswer")) {
    //Body does not contain correct properties
    return res.status(400).send("/users POST request formulated incorrectly. " + 
      "It must contain 'type', 'password','displayName','profilePicURL','securityQuestion' and 'securityAnswer fields in message body.")
  }
  try {
    let thisUser = await User.findOne({id: req.params.userId});
    if (thisUser) { //account already exists
      res.status(400).send("There is already an account with email '" + 
        req.params.userId + "'.");
    } else { //account available -- add to database
      thisUser = await new User({
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
      return res.status(201).send("New account for '" + 
        req.params.userId + "' successfully created.");
    }
  } catch (err) {
    return res.status(400).send("Unexpected error occurred when adding or looking up user in database. " + err);
  }
});

//UPDATE user route: Updates a new user account in the users collection (POST)
app.put('/users/:userId',  async (req, res, next) => {
  console.log("in /users update route (PUT) with userId = " + JSON.stringify(req.params) + 
    " and body = " + JSON.stringify(req.body));
  if (!req.params.hasOwnProperty("userId"))  {
    return res.status(400).send("users/ PUT request formulated incorrectly." +
        "It must contain 'userId' as parameter.");
  }
  const validProps = ['password', 'displayName', 'profilePicURL', 
    'securityQuestion', 'securityAnswer'];
  for (const bodyProp in req.body) {
    if (!validProps.includes(bodyProp)) {
      return res.status(400).send("users/ PUT request formulated incorrectly." +
        "Only the following props are allowed in body: " +
        "'password', 'displayname', 'profilePicURL', 'securityQuestion', 'securityAnswer'");
    } 
  }
  try {
        let status = await User.updateOne({id: req.params.userId}, 
          {$set: req.body});
        if (status.nModified != 1) { //account could not be found
          res.status(404).send("No user account " + req.params.userId + " exists. Account could not be updated.");
        } else {
          res.status(200).send("User account " + req.params.userId + " successfully updated.")
        }
      } catch (err) {
        res.status(400).send("Unexpected error occurred when updating user data in database: " + err);
      }
});

//DELETE user route: Deletes the document with the specified userId from users collection (DELETE)
app.delete('/users/:userId', async(req, res, next) => {
  console.log("in /users route (DELETE) with userId = " + 
    JSON.stringify(req.params.userId));
  try {
    let status = await User.deleteOne({id: req.params.userId});
    if (status.deletedCount != 1) {
      return res.status(404).send("No user account " +
        req.params.userId + " was found. Account could not be deleted.");
    } else {
      return res.status(200).send("User account " +
      req.params.userId + " was successfully deleted.");
    }
  } catch (err) {
    console.log()
    return res.status(400).send("Unexpected error occurred when attempting to delete user account with id " +
      req.params.userId + ": " + err);
  }
});

/////////////////////////////////
//ROUNDS ROUTES
////////////////////////////////

//CREATE round route: Adds a new round as a subdocument to 
//a document in the users collection (POST)
app.post('/rounds/:userId', async (req, res, next) => {
  console.log("in /rounds (POST) route with params = " + 
              JSON.stringify(req.params) + " and body = " + 
              JSON.stringify(req.body));
  if (!req.body.hasOwnProperty("date") || 
      !req.body.hasOwnProperty("course") || 
      !req.body.hasOwnProperty("type") ||
      !req.body.hasOwnProperty("holes") || 
      !req.body.hasOwnProperty("strokes") ||
      !req.body.hasOwnProperty("minutes") ||
      !req.body.hasOwnProperty("seconds") || 
      !req.body.hasOwnProperty("notes")) {
    //Body does not contain correct properties
    return res.status(400).send("POST request on /rounds formulated incorrectly." +
      "Body must contain all 8 required fields: date, course, type, holes, strokes, "       +  "minutes, seconds, notes.");
  }
  try {
    let status = await User.updateOne(
    {id: req.params.userId},
    {$push: {rounds: req.body}});
    if (status.nModified != 1) { //Should never happen!
      res.status(400).send("Unexpected error occurred when adding round to"+
        " database. Round was not added.");
    } else {
      res.status(200).send("Round successfully added to database.");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unexpected error occurred when adding round" +
     " to database: " + err);
  } 
});

//READ round route: Returns all rounds associated 
//with a given user in the users collection (GET)
app.get('/rounds/:userId', async(req, res) => {
  console.log("in /rounds route (GET) with userId = " + 
    JSON.stringify(req.params.userId));
  try {
    let thisUser = await User.findOne({id: req.params.userId});
    if (!thisUser) {
      return res.status(400).message("No user account with specified userId was found in database.");
    } else {
      return res.status(200).json(JSON.stringify(thisUser.rounds));
    }
  } catch (err) {
    console.log()
    return res.status(400).message("Unexpected error occurred when looking up user in database: " + err);
  }
});

//UPDATE round route: Updates a specific round 
//for a given user in the users collection (PUT)
app.put('/rounds/:userId/:roundId', async (req, res, next) => {
  console.log("in /rounds (PUT) route with params = " + 
              JSON.stringify(req.params) + " and body = " + 
              JSON.stringify(req.body));
  const validProps = ['date', 'course', 'type', 'holes', 'strokes',
    'minutes', 'seconds', 'notes'];
  let bodyObj = {...req.body};
  delete bodyObj._id; //Not needed for update
  delete bodyObj.SGS; //We'll compute this below in seconds.
  for (const bodyProp in bodyObj) {
    if (!validProps.includes(bodyProp)) {
      return res.status(400).send("rounds/ PUT request formulated incorrectly." +
        "It includes " + bodyProp + ". However, only the following props are allowed: " +
        "'date', 'course', 'type', 'holes', 'strokes', " +
        "'minutes', 'seconds', 'notes'");
    } else {
      bodyObj["rounds.$." + bodyProp] = bodyObj[bodyProp];
      delete bodyObj[bodyProp];
    }
  }
  try {
    let status = await User.updateOne(
      {"id": req.params.userId,
       "rounds._id": mongoose.Types.ObjectId(req.params.roundId)}
      ,{"$set" : bodyObj}
    );
    if (status.nModified != 1) {
      res.status(400).send("Unexpected error occurred when updating round in database. Round was not updated.");
    } else {
      res.status(200).send("Round successfully updated in database.");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unexpected error occurred when updating round in database: " + err);
  } 
});

//DELETE round route: Deletes a specific round 
//for a given user in the users collection (DELETE)
app.delete('/rounds/:userId/:roundId', async (req, res, next) => {
  console.log("in /rounds (DELETE) route with params = " + 
              JSON.stringify(req.params)); 
  try {
    let status = await User.updateOne(
      {id: req.params.userId},
      {$pull: {rounds: {_id: mongoose.Types.ObjectId(req.params.roundId)}}});
    if (status.nModified != 1) { //Should never happen!
      res.status(400).send("Unexpected error occurred when deleting round from database. Round was not deleted.");
    } else {
      res.status(200).send("Round successfully deleted from database.");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unexpected error occurred when deleting round from database: " + err);
  } 
});

/////////////////////////////////
//COURSES ROUTES
////////////////////////////////

// GET ALL COURSES IN THE DATABASE
app.get('/allcourses/', async(req, res, next) => {
  console.log("in /allcourses route (GET)");
  try {
    // let thisUser = await Course.findOne({id: req.params.courseId});
    let thisUser = await Course.find({});

    if (!thisUser) {
      return res.status(404).send("Get ALL Courses failed");
    } else {
      return res.status(200).json(JSON.stringify(thisUser));
    }
  } catch (err) {
    console.log()
    return res.status(400).send("Unexpected error occurred when getting all Courses");
  }
});

//READ course route: Retrieves the course with the specified courseId from courses collection (GET)
app.get('/courses/:courseId', async(req, res, next) => {
  console.log("in /courses route (GET) with courseId = " + 
    JSON.stringify(req.params.courseId));
  try {
    let thisUser = await Course.findOne({id: req.params.courseId});
    if (!thisUser) {
      return res.status(404).send("No user account with id " +
        req.params.courseId + " was found in database.");
    } else {
      return res.status(200).json(JSON.stringify(thisUser));
    }
  } catch (err) {
    console.log()
    return res.status(400).send("Unexpected error occurred when looking up user with id " +
      req.params.courseId + " in database: " + err);
  }
});

//CREATE course route: Adds a new course as a subdocument to 
//a document in the courses collection (POST)
app.post('/courses/:courseId', async (req, res, next) => {
  console.log("in /courses (POST) route with params = " + 
              JSON.stringify(req.params) + " and body = " + 
              JSON.stringify(req.body));
  if (!req.body.hasOwnProperty("courseName") ||
      !req.body.hasOwnProperty("rating") || 
      !req.body.hasOwnProperty("review") || 
      !req.body.hasOwnProperty("picture") ||
      !req.body.hasOwnProperty("location") || 
      !req.body.hasOwnProperty("yardage") ||
      !req.body.hasOwnProperty("runningDistance") ||
      !req.body.hasOwnProperty("timePar") || 
      !req.body.hasOwnProperty("bestScore") || 
      !req.body.hasOwnProperty("recordHolder") ||
      !req.body.hasOwnProperty("rateSenior") ||
      !req.body.hasOwnProperty("rateStandard")) {
    //Body does not contain correct properties
    return res.status(400).send("POST request on /course formulated incorrectly." +
      "Body must contain all 8 required fields: courseName, rating, review, picture, location, yardage, runningDistance, timePar, bestScore, recordHolder, rateSenior, rateStandard.");
  }
  try {
    let thisCourse = await Course.findOne({id: req.params.courseId});
    if (thisCourse) { //course already exists
      res.status(400).send("There is already an course with this name '" + 
        req.params.courseId + "'.");
    } else { //account available -- add to database
      thisCourse = await new Course({
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
        rateStandard: req.body.rateStandard
      }).save();
      return res.status(200).send("New course for '" + 
        req.params.courseId + "' successfully created.");
    }
  } catch (err) {
    return res.status(400).send("Unexpected error occurred when adding or looking up course in database. " + err);
  }
});

//UPDATE course route: Updates a new course information in the courses collection (POST)
app.put('/courses/:courseId',  async (req, res, next) => {
  console.log("in /courses update route (PUT) with courseId = " + JSON.stringify(req.params) + 
    " and body = " + JSON.stringify(req.body));
  if (!req.params.hasOwnProperty("courseId"))  {
    return res.status(400).send("courses/ PUT request formulated incorrectly." +
        "It must contain 'courseId' as parameter.");
  }
  const validProps = ['courseName', 'id', 'rating', 'review', 'picture', 'location', 'yardage', 'runningDistance', 'timePar', 'bestScore', 'recordHolder', 'rateSenior', 'rateStandard'];
  for (const bodyProp in req.body) {
    if (!validProps.includes(bodyProp)) {
      return res.status(400).send("courses/ PUT request formulated incorrectly." +
        "Only the following props are allowed in body: " +
        "'courseName', 'id', 'rating', 'review', 'picture', 'location', 'yardage', 'runningDistance', 'timePar', 'bestScore', 'recordHolder', 'rateSenior', 'rateStandard'");
    } 
  }
  try {
        let status = await Course.updateOne({id: req.params.courseId}, 
          {$set: req.body});
          res.status(200).send("Course " + req.params.courseId + " successfully updated.")
      } catch (err) {
        res.status(400).send("Unexpected error occurred when updating course data in database: " + err);
      }
});

//DELETE course route: Deletes a specific course 
//for a given id in the course collection (DELETE)
app.delete('/courses/:courseId', async(req, res, next) => {
  console.log("in /courses route (DELETE) with courseId = " + 
    JSON.stringify(req.params.courseId));
  try {
    let status = await Course.deleteOne({id: req.params.courseId});
    if (status.deletedCount != 1) {
      return res.status(404).send("No course " +
        req.params.courseId + " was found. Course could not be deleted.");
    } else {
      return res.status(200).send("Course " +
      req.params.courseId + " was successfully deleted.");
    }
  } catch (err) {
    console.log()
    return res.status(400).send("Unexpected error occurred when attempting to delete course with id " +
      req.params.courseId + ": " + err);
  }
});

/////////////////////////////////
//APPOINTMENTS ROUTES
////////////////////////////////

//CREATE appointment route: Adds a new appointment as a subdocument to 
//a document in the users collection (POST)
app.post('/appointments/:userId', async (req, res, next) => {
  console.log("in /appointments (POST) route with params = " + 
              JSON.stringify(req.params) + " and body = " + 
              JSON.stringify(req.body));
  if (
      !req.body.hasOwnProperty("userId") || 
      !req.body.hasOwnProperty("username") || 
      !req.body.hasOwnProperty("courseName") || 
      !req.body.hasOwnProperty("date") || 
      !req.body.hasOwnProperty("time") || 
      !req.body.hasOwnProperty("paid")) {
    //Body does not contain correct properties
    return res.status(400).send("POST request on /appointments formulated incorrectly." +
      "Body must contain all 6 required fields: userId, username, courseName, date, time, paid");
  }
  try {
    let status = await User.updateOne(
    {id: req.params.userId},
    {$push: {appointments: req.body}});
    if (status.nModified != 1) { //Should never happen!
      res.status(400).send("Unexpected error occurred when adding appointment to"+
        " database. Appointment was not added.");
    } else {
      res.status(200).send("Appointment successfully added to database.");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unexpected error occurred when adding appointment" +
     " to database: " + err);
  } 
});

//READ appointment route: Returns all appointments associated 
//with a given user in the users collection (GET)
app.get('/appointments/:userId', async(req, res) => {
  console.log("in /appointments route (GET) with userId = " + 
    JSON.stringify(req.params.userId));
  try {
    let thisUser = await User.findOne({id: req.params.userId});
    if (!thisUser) {
      return res.status(400).message("No user account with specified userId was found in database.");
    } else {
      return res.status(200).json(JSON.stringify(thisUser.appointments));
    }
  } catch (err) {
    console.log()
    return res.status(400).message("Unexpected error occurred when looking up user in database: " + err);
  }
});

//UPDATE appointments route: Updates a specific appointment 
//for a given user in the users collection (PUT)
app.put('/appointments/:userId/:appointmentId', async (req, res, next) => {
  console.log("in /appointments (PUT) route with params = " + 
              JSON.stringify(req.params) + " and body = " + 
              JSON.stringify(req.body));
  const validProps = ['userId', 'username', 'courseName', 'date', 'time', 'paid'];
  let bodyObj = {...req.body};
  // delete bodyObj._id; //Not needed for update
  // delete bodyObj.SGS; //We'll compute this below in seconds.
  for (const bodyProp in bodyObj) {
    if (!validProps.includes(bodyProp)) {
      return res.status(400).send("appointments/ PUT request formulated incorrectly." +
        "It includes " + bodyProp + ". However, only the following props are allowed: " +
        "'userId', 'username', 'courseName', 'date', 'time', 'paid'");
    } else {
      bodyObj["appointments.$." + bodyProp] = bodyObj[bodyProp];
      delete bodyObj[bodyProp];
    }
  }
  try {
    let status = await User.updateOne(
      {"id": req.params.userId,
       "appointments._id": mongoose.Types.ObjectId(req.params.appointmentId)}
      ,{"$set" : bodyObj}
    );
    if (status.nModified != 1) {
      res.status(400).send("Unexpected error occurred when updating appointment in database. Appointment was not updated.");
    } else {
      res.status(200).send("Appointment successfully updated in database.");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unexpected error occurred when updating appointment in database: " + err);
  } 
});

//DELETE round route: Deletes a specific round 
//for a given user in the users collection (DELETE)
app.delete('/appointments/:username/:courseName/:date/:time/:userId', async (req, res, next) => {
  console.log("in /appointments (DELETE) route with params = " + 
              JSON.stringify(req.params)); 
  try {
    let status = await User.updateOne(
      {id: req.params.userId},
      {$pull: {appointments: {username: req.params.username, courseName: req.params.courseName, date: req.params.date, time: req.params.time}}});
    if (status.nModified != 1) { //Should never happen!
      res.status(400).send("Unexpected error occurred when deleting appointment from database. Appointment was not deleted.");
    } else {
      res.status(200).send("Appointment successfully deleted from database.");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unexpected error occurred when deleting appointment from database: " + err);
  } 
});

/////////////////////////////////
//APPOINTMENTS_OP ROUTES
////////////////////////////////

//CREATE appointment route: Adds a new appoint as a subdocument to 
//a document in the apoointments collection (POST)
app.post('/appointments_op/', async (req, res, next) => {
  console.log("in /appointment_op (POST) route with body = " + 
              JSON.stringify(req.body));
  if (
      !req.body.hasOwnProperty("userId") ||
      !req.body.hasOwnProperty("username") || 
      !req.body.hasOwnProperty("courseName") || 
      !req.body.hasOwnProperty("date") ||
      !req.body.hasOwnProperty("time") || 
      !req.body.hasOwnProperty("paid")) {
    //Body does not contain correct properties
    return res.status(400).send("POST request on /appointment_op formulated incorrectly." +
      "Body must contain all 6 required fields: userId, username, courseName, date, time, paid.");
  }
  try {
    let thisAppointment = await new Appointment({
      userId: req.body.userId,
      username: req.body.username,
      courseName: req.body.courseName,
      date: req.body.date,
      time: req.body.time,
      paid: req.body.paid
    }).save();
    return res.status(200).send("New appointment for '" + req.body.userId + "' successfully created.");
  } catch (err) {
    return res.status(400).send("Unexpected error occurred when adding or looking up appointment in database. " + err);
  }
});

//READ appointment route: Returns all appointments
app.get('/allappointments_op/', async(req, res) => {
  console.log("in /allappointments_op route (GET)");
  try {
    let allAppointment = await Appointment.find({});
    return res.status(200).json(JSON.stringify(allAppointment));
  } catch (err) {
    console.log()
    return res.status(400).message("Unexpected error occurred when getting all appointments from database: " + err);
  }
});

//DELETE course route: Deletes a specific course 
//for a given id in the course collection (DELETE)
app.delete('/appointments_op/:username/:courseName/:date/:time', async(req, res, next) => {
  console.log("in /appointments_op (DELETE) route with params = " + 
              JSON.stringify(req.params)); 
  try {
    let status = await Appointment.deleteOne({username: req.params.username, courseName: req.params.courseName, date: req.params.date, time: req.params.time});
    res.status(200).send("appointments successfully deleted from database.");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unexpected error occurred when deleting appointments from database: " + err);
  } 
});

//UPDATE appointment route: Updates a new appointment information in the appointments collection (POST)
app.put('/appointments_op/:username/:courseName/:date/:time',  async (req, res, next) => {
  console.log("in /appointments_op update route (PUT) with body = " + JSON.stringify(req.body));

  const validProps = ['userId', 'username', 'courseName', 'date', 'time', 'paid'];
  for (const bodyProp in req.body) {
    if (!validProps.includes(bodyProp)) {
      return res.status(400).send("appointments/ PUT request formulated incorrectly." +
        "It includes " + bodyProp + ". However, only the following props are allowed: " +
        "'userId', 'username', 'courseName', 'date', 'time', 'paid'");
    } 
  }
  try {
        let status = await Appointment.updateOne({username: req.params.username, courseName: req.params.courseName, date: req.params.date, time: req.params.time}, 
        {$set: req.body});
        res.status(200).send("Appointment successfully paid.")
      } catch (err) {
        res.status(400).send("Unexpected error occurred when updating appointment data in database: " + err);
      }
});

/////////////////////////////////
//CARD ROUTES
////////////////////////////////

//CREATE card route: Adds a new card as a subdocument to 
//a document in the cards collection (POST)
app.post('/cards/:userId', async (req, res, next) => {
  console.log("in /cards (POST) route with params = " + 
              JSON.stringify(req.params) + " and body = " + 
              JSON.stringify(req.body));
  if (!req.body.hasOwnProperty("name") || 
      !req.body.hasOwnProperty("number") || 
      !req.body.hasOwnProperty("expDate")) {
    //Body does not contain correct properties
    return res.status(400).send("POST request on /cards formulated incorrectly." +
      "Body must contain all 3 required fields: name, numner, expDate.");
  }
  try {
    let status = await User.updateOne(
    {id: req.params.userId},
    {$push: {card: req.body}});
    if (status.nModified != 1) { //Should never happen!
      res.status(400).send("Unexpected error occurred when adding card to database. Card was not added.");
    } else {
      res.status(200).send("Card successfully added to database.");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unexpected error occurred when adding card to database: " + err);
  } 
});

//READ card route: Returns cards associated 
//with a given user in the users collection (GET)
app.get('/cards/:userId', async(req, res) => {
  console.log("in /cards route (GET) with userId = " + 
    JSON.stringify(req.params.userId));
  try {
    let thisUser = await User.findOne({id: req.params.userId});
    if (!thisUser) {
      return res.status(400).message("No user account with specified userId was found in database.");
    } else {
      return res.status(200).json(JSON.stringify(thisUser.card));
    }
  } catch (err) {
    console.log()
    return res.status(400).message("Unexpected error occurred when looking up user in database: " + err);
  }
});

//UPDATE card route: Updates a specific card 
//for a given user in the users collection (PUT)
app.put('/cards/:userId/:cardId', async (req, res, next) => {
  console.log("in /cards (PUT) route with params = " + 
              JSON.stringify(req.params) + " and body = " + 
              JSON.stringify(req.body));
  const validProps = ['name', 'number', 'expDate'];
  let bodyObj = {...req.body};
  // delete bodyObj._id; //Not needed for update
  // delete bodyObj.SGS; //We'll compute this below in seconds.
  for (const bodyProp in bodyObj) {
    if (!validProps.includes(bodyProp)) {
      return res.status(400).send("cards/ PUT request formulated incorrectly." +
        "It includes " + bodyProp + ". However, only the following props are allowed: " +
        "'name', 'number', 'expDate'");
    } else {
      bodyObj["card.$." + bodyProp] = bodyObj[bodyProp];
      delete bodyObj[bodyProp];
    }
  }
  try {
    let status = await User.updateOne(
      {"id": req.params.userId,
       "card._id": mongoose.Types.ObjectId(req.params.cardId)}
      ,{"$set" : bodyObj}
    );
    if (status.nModified != 1) {
      res.status(400).send("Unexpected error occurred when updating card in database. Card was not updated.");
    } else {
      res.status(200).send("Card successfully updated in database.");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unexpected error occurred when updating card in database: " + err);
  } 
});

//DELETE card route: Deletes a specific card 
//for a given user in the users collection (DELETE)
app.delete('/cards/:userId/:cardId', async (req, res, next) => {
  console.log("in /cards (DELETE) route with params = " + 
              JSON.stringify(req.params)); 
  try {
    let status = await User.updateOne(
      {id: req.params.userId},
      {$pull: {card: {_id: mongoose.Types.ObjectId(req.params.cardId)}}});
      res.status(200).send("Card successfully deleted from database.");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unexpected error occurred when deleting card from database: " + err);
  } 
});