var login = require("facebook-chat-api");
var prompt = require('prompt');

// 
// Start the prompt 
// 
prompt.start();

// 
// Get two properties from the user: username and email 
// 
prompt.get(['username', 'email'], function (err, result) {
// 
// Log the results. 
// 
console.log('Command-line input received:');
console.log('  username: ' + result.username);
console.log('  email: ' + result.email);
});

function loginAndListen(){
	login({email: "", password: ""}, function callback (err, api) {
	    if(err) return console.error(err);
	    console.log("logged in");
	    api.listen(function callback(err, message) {
	    	var reply = "";
	    	if (shouldShowWelcomeMessage(message)) {
	    		reply = "HAL 9000: Kyrre is not here right now. I am kyrre's personal assistant, how can I help you?";
	    	}else{
	    		reply = "HAL 9000: I am afraid i can't answer that";
	    		if (message.body === "Open the pod bay doors, HAL") {
	    			reply = "HAL 9000: I’m sorry, Dave, I’m afraid I can’t do that.";
	    		}
	    	}
	        api.sendMessage(reply, message.threadID);
	        //api.sendMessage("Jeg er en bot", message.threadID);
	    });
	});
}


var set = {};
function shouldShowWelcomeMessage(message){
	if (!(message.id in set)){
		set[message.id] = Date.now();
		return true;
	}else if(Date.now()-set[message.id] > 86400000){
		set[message.id] = Date.now();
		return true;
	}
	return false;
}