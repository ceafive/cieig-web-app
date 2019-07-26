let express = require("express"),
	fileUpload = require('express-fileupload'),
	session = require("express-session"),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	flash = require("connect-flash"),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	dotenv = require('dotenv'),
	app = express();


dotenv.config();
const URI = process.env.MONGODB_URI;
// const URI = process.env.LOCALDB_URI

// CONNECT mongoDB DATABASE TO EXPRESS SERVER
// CONNECT APP TO MONGODB DB
mongoose.connect(URI, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true}).then(() => {
	console.log("Connected to DB");
}).catch(err => {
	console.log("ERROR:", err.message);
});

mongoose.Promise = global.Promise;

// REQUIRE RESULTS SCHEMA
let Result = require("./models/results");

//REQUIRE USER SCHEMA
let User = require("./models/users");

//REQUIRE ROUTES
let resultsRoutes = require("./routes/results"),
	indexRoutes = require("./routes/index");

app.set("view engine", "ejs");
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.use(flash());

app.use(session({
	cookie: { maxAge: 60000 },
	secret: "CIEIG",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(resultsRoutes);
app.use(indexRoutes);


// PORT LISTEN
app.listen(process.env.PORT || 3000, function(){
	console.log("PORT CONNECTED");
});