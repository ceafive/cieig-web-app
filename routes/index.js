let passport = require("passport"),
	express = require("express"),
	router  = express.Router();

let User = require("../models/users");


// SHOW LANDING PAGE
router.get("/", function(req, res){
	res.render("landing");
});


//SIGN UP
router.get("/register", function(req, res){
	res.render("register");
});

//SIGN UP LOGIC
router.post("/register", function(req, res){
	let newUser = new User({username: req.body.username});
	if(req.body.adminCode === process.env.ADMIN_CODE){
			newUser.isAdmin = true; 
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			 return res.redirect("/register");
		}else {
				passport.authenticate("local")(req, res, function (){
				req.flash("success", "Sign Up Successful! Welcome" + " " + user.username);
				res.redirect("/results");
			});
		}
	});
});

//LOGIN
router.get("/login", function(req, res){
	res.render("login");
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
		successRedirect: "/results",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome Back!"
}), function(req, res){

});

//LOGOUT
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged Out!");
	res.redirect("/");
});


module.exports = router;