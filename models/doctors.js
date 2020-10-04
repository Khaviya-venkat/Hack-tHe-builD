var mongoose = require("mongoose");

var doctorschema = new mongoose.Schema({
	username : String,
	type     : String,
	KnownDevices  : [{
		type : String,
		name : String,
	}],
	Patient   : {
		name : String,
		device : String,
		updates : [{
			comment  : String,
			Date     : String,
		}],
	},
	
});
module.exports = mongoose.model("Doctor", doctorschema);