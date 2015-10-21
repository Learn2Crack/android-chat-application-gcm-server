var request = require('request');
var mysql = require('mysql');
 
var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database : 'chat',
    }
);
 
connection.connect();


exports.login = function(name,mobno,reg_id,callback) {

var data = {
            
            name    : name,
            mobno :  mobno,
            reg_id   : reg_id
            
        
        };
var que = "SELECT * from users WHERE mobno =" + mobno;

 var query = connection.query(que, function(err, rows)
        {
          if(rows.length == 0){
            var query = connection.query("INSERT INTO users set ? ",data, function(err, rows)
        {
  
          callback({'response':"Sucessfully Registered"});
    
        });
          }else {

           callback({'response':"User already Registered"});

          }
      
        });
    

}


exports.getuser = function(mobno,callback) {



 var query = connection.query("SELECT * from users", function(err, rows)
        {
          if(rows.length == 0){
            callback({'response':"No Users Registered"});
          }else {

          callback(removeUser(rows, mobno));

          }
      
        });

}


exports.removeuser = function(mobno,callback) {

var que = "DELETE FROM users  WHERE mobno =" + mobno;

var query = connection.query(que, function(err, rows)
        {
            
             if(!err){

    callback({'response':"Removed Sucessfully"});
  }else{
    callback({'response':"Error"});
  }  
        });
}



exports.send = function(fromn,fromu,to,msg,callback) {

var que = "SELECT * from users WHERE mobno =" + to;

 var query = connection.query(que, function(err, rows)
        {
          if(rows.length == 0){
            callback({'response':"Failure"});
        
          }else {

           
	var to_id = rows[0].reg_id;
	var name = rows[0].name;

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

