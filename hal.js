var login = require("facebook-chat-api");
var prompt = require('prompt');

//CHANGE THIS FOR TESTING
//not case sensitive
var activationString = "hal";

var schema = {
properties: {
  email: {
    message: 'email',
    required: true
  },
  password: {
  	message: 'password',
  	required: true,
    hidden: true
  }
}
};

prompt.start();

prompt.get(schema, function (err, result) {
	loginAndListen(result.email, result.password);
});

function loginAndListen(emailInput,passwordInput){
	login({email: emailInput, password: passwordInput}, function callback (err, api) {
	    if(err) return console.error(err);
	    api.listen(function callback(err, message) {
	    	var reply = "";
	    	if (shouldShowWelcomeMessage(message)) {
	    		api.sendMessage("I am HAL 9000, activate me by starting a message with \'hal\'", message.threadID);
	    	}else{
	    		reply = createReply(message);
	    		if (reply !== null) {
	        		api.sendMessage(reply, message.threadID);
	    		}
	    	}
	    });
	});
}



function createReply(message){
	if (!message.body.toLowerCase().startsWith(activationString.concat(" "))) {
		return null;
	}
	reply = "I am afraid i can't answer that";
	if (message.body === "Open the pod bay doors, HAL") {
		reply = "I’m sorry, Dave, I’m afraid I can’t do that.";
	}
	return reply;
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