var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({ 
	name : String,
	mobno: String, 
	reg_id: String
});

mongoose.connect('mongodb://localhost:27017/node-android-chat');
module.exports = mongoose.model('users', userSchema);        
