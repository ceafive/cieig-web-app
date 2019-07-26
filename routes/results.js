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
router.get("/results/new", isLoggedIn, function(req, res){
	res.render("new");
});

// CREATE NEW DATA 
// router.post("/results", isLoggedIn, function(req, res){
// 	req.body.data.month = req.sanitize(req.body.data.month);
// 	req.body.data.year = req.sanitize(req.body.data.year);
// 	req.body.data.costIndex = req.sanitize(req.body.data.costIndex);
// 	req.body.data.description = req.sanitize(req.body.data.description);
// 	req.body.data.user = {
// 				id: req.user.id,
// 				username: req.user.username
// 	};
// 	Result.create(req.body.data, function(err, result){
// 	if(err){
// 		console.log(err);
// 		console.log(req.body.data);
// 	}else {
// 		res.redirect("back");
// 	}
// });
// });

// ADD NEW DATA 
router.post('/results', isLoggedIn, function(req, res) {
  // The name of the input field (i.e. "data") is used to retrieve the uploaded file
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

// ABOUT US
router.get("/contact", function(req, res){
	res.render("contact");
});

//AUTHENTICATE USER
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
		req.flash("error", "Please Login First");
		res.redirect("/login");
}

module.exports = router;
