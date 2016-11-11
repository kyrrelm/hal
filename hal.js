var login = require("facebook-chat-api");
var prompt = require('prompt');

//CHANGE THIS FOR TESTING
//not case sensitive
var activationString = "hil";
var welcomeMessage = false;
var credentials = {
	email: "deep.into.my.thoughts@gmail.com",
	password: "RagnarKro42"
}

var schema = {
	properties: {
	  email: {
	    message: 'email',
	  },
	  password: {
	  	message: 'password',
	    hidden: true
	  }
	}
};

prompt.start();

prompt.get(schema, function (err, result) {
	var email = result.email || credentials.email
	var password = result.password || credentials.password

	loginAndListen(email, password);
});

function loginAndListen(emailInput,passwordInput){
	login({email: emailInput, password: passwordInput}, function callback (err, api) {
	    if(err) return console.error(err);
	    api.listen(function callback(err, message) {
	    	var reply = "";
	    	if (shouldShowWelcomeMessage(message)) {
	    		api.sendMessage("I am HAL 9000, activate me by starting a message with \'hal\'", message.threadID);
	    	}else{
	    		var reply = createReply(api, message);
    			console.log("Reply", reply);
    			if (reply !== null) {
        			api.sendMessage(reply, message.threadID);
    			};
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

function createReply(api, message){
	var messageValue = message.body.toLowerCase();
	console.log("Message: ", messageValue)

	if (!messageValue.startsWith(activationString.concat(" "))) {
		return null;
	}
	//Open the pod bay doors, HAL
	if (/open the pod.*/.test(messageValue)) {
		return "I’m sorry, Dave, I’m afraid I can’t do that.";
	}

	if (/who should*/.test(messageValue)) {
		var chosenParticipant = pickRandomParticipant(api, message.threadID)
		return chosenParticipant;
	}

	else {
		return "I am afraid i can't answer that";
	}
}

function pickRandomParticipant(api, threadID) {
	api.getThreadInfo(threadID, function callback(err, info) {
		if (err) return console.error(err);

		api.getUserInfo(info.participantIDs, function callback(err, users) {
			if (err) return console.error(err);

			var currentUserId = api.getCurrentUserID();
			var usersInThread = []
			for (var userId in users) {
				if (userId !== currentUserId) {
					usersInThread.push(users[userId].name)
				}
			} 

			return usersInThread[Math.floor(Math.random()*usersInThread.length)];
		})
	})
}
