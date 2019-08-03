let express = require("express"),
	router  = express.Router(),
	mongoose = require('mongoose'),
	csvFilePath = ('./public/files/data.csv'),
	csv = require('csvtojson'),
	Result = require("../models/results");
 

// SHOW SEARCH RESULTS
router.get("/results", isLoggedIn, function(req, res){
	let month = req.query.month,
		year = req.query.year,
		description = req.query.description;
		Result.find(({month:month,year:year,description:description}), function(err, results){
			if(err || (month === '' || year === '' || description === '' )){
				console.log(err);
				req.flash("error", "Select All Inputs");
				res.redirect("back");
			}else{
				res.render("results", {results: results});
	}
});
	});
	

// NEW RESULT FORM
router.get("/results/new", checkAuthorization, function(req, res){
	res.render("new");
});


// ADD NEW DATA 
router.post('/results', checkAuthorization, function(req, res) {
  // The name of the input field (i.e. "file") is used to retrieve the uploaded file
  let file = req.files.file;
  // Use the mv() method to place the file somewhere on your server
  file.mv('./public/files/data.csv', function(err) {
    if (err){
      res.status(500).send(err);
	} else {
		csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
Result.create(jsonObj, function (err, data) {
      if (err){ 
          return console.error(err);
      } else {
        console.log("Multiple documents inserted to Collection");
      }
    });
});
		    console.log('File Uploaded!');
			res.redirect("/results");
		}
  });
});

// DELETE PARTICULAR DATA
router.delete("/results/:id", function(req, res){
	Result.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else {
				res.redirect("/results");
		}
	});
});

// SERVICES
router.get("/services", function(req, res){
	res.render("services");
});



//AUTHENTICATE USER
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
		req.flash("error", "Please Login First");
		res.redirect("/login");
}

//CHECK AUTHORIZATION
function checkAuthorization(req, res, next){
		if(req.isAuthenticated()){
			Result.find({}, function(err, results){
		if(err || !results){
			req.flash("error", "Data Not Found");
			res.redirect("back");
		}else{
			if(req.user && req.user.isAdmin){
				next();
			}else{
				req.flash("error", "Unauthorized Request. Sign In As Admin");
				res.redirect("/results");
			}
			
		}
	});
	}else{
		req.flash("error", "Please Login First");
		res.redirect("/login");
	}
}

module.exports = router;
