let mongoose = require("mongoose");

let resultSchema = new mongoose.Schema({
	month: String,
	year: String,
	costIndex: String,
	description: String,
	user: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		},
		username: String
	}
});

module.exports = mongoose.model("result", resultSchema, 'results');