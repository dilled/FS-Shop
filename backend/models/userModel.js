var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
	{
		password: String,
		email: { type: String, unique: true },
		nickname: String,

	}, { collection: "users", versionKey: false }
);



//Export model
module.exports = mongoose.model('User', UserSchema);