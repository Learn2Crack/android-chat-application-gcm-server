var mongoose = require('mongoose');
var request = require('request');
var user = require('./models.js');

exports.login = function(name,mobno,reg_id,callback) {

var newuser = new user({ 
	name: name,
	mobno: mobno, 
	reg_id: reg_id});

user.find({mobno: mobno},function(err,users){

var len = users.length;

if(len == 0){
 	newuser.save(function (err) {
	
	callback({'response':"Sucessfully Registered"});
		
});
}else{

	callback({'response':"User already Registered"});

}});
}
exports.getuser = function(mobno,callback) {

user.find(function(err,users){

var len = users.length;

if(len == 0){
 	
	
	callback({'response':"No Users Registered"});
		

}else{
callback(removeUser(users, mobno));
	
}});
}


exports.removeuser = function(mobno,callback) {

user.remove({mobno:mobno},function(err,users){

	if(!err){

		callback({'response':"Removed Sucessfully"});
	}else{
		callback({'response':"Error"});
	}
});
}



exports.send = function(fromn,fromu,to,msg,callback) {

user.find({mobno: to},function(err,users){
var len = users.length;
if(len == 0){
callback({'response':"Failure"});
}else{
	var to_id = users[0].reg_id;
	var name = users[0].name;

request(
    { method: 'POST', 
    uri: 'https://android.googleapis.com/gcm/send',
    headers: {
        'Content-Type': 'application/json',
        'Authorization':'key=Your API Key'
    },
    body: JSON.stringify({
  "registration_ids" : [to_id],
  "data" : {
    "msg":msg,
    "fromu":fromu,
    "name":fromn
  },
  "time_to_live": 108
})
    }
  , function (error, response, body) {

	  callback({'response':"Success"});
    }
  )
}});

}

function removeUser(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i].mobno == val) {
            arr.splice(i, 1);
            return arr;
            break;
        }
    }
}

