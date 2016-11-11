var login = require("facebook-chat-api");
var prompt = require('prompt');

//CHANGE THIS FOR TESTING
//not case sensitive
var activationString = "hal";
var welcomeMessage = false;

var schema = {
properties: {
  email: {
    message: 'email',
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
	var email = result.email;
	if (!email) {
		email = "deep.into.my.thoughts@gmail.com"
	}
	loginAndListen(email, result.password);
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

var set = {};
function shouldShowWelcomeMessage(message){
	if (!welcomeMessage) {
		return false;
	}
	if (!(message.id in set)){
		set[message.id] = Date.now();
		return true;
	}else if(Date.now()-set[message.id] > 86400000){
		set[message.id] = Date.now();
		return true;
	}
	return false;
}

function createReply(message){
	if (!message.body.toLowerCase().startsWith(activationString.concat(" "))) {
		return null;
	}
	//Open the pod bay doors, HAL
	if (/open the pod.*/.test(message.body.toLowerCase())) {
		return "I’m sorry, Dave, I’m afraid I can’t do that.";
	}
	return "I am afraid i can't answer that";
}
