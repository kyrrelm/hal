var login = require("facebook-chat-api");
var prompt = require('prompt');

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
	    		reply = "HAL 9000: Kyrre is not here right now. I am kyrre's personal assistant, how can I help you?";
	    	}else{
	    		reply = "HAL 9000: I am afraid i can't answer that";
	    		if (message.body === "Open the pod bay doors, HAL") {
	    			reply = "HAL 9000: I’m sorry, Dave, I’m afraid I can’t do that.";
	    		}
	    	}
	        api.sendMessage(reply, message.threadID);
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