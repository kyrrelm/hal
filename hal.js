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
	    		reply = createReply(api, message);
	    		console.log("Reply", reply);
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

function createReply(api, message){
	var messageValue = message.body.toLowerCase();
	console.log("Message: ", messageValue)

	for (var property in message) {
    if (message.hasOwnProperty(property)) {
        console.log(property);
    }
}

	if (!messageValue.startsWith(activationString.concat(" "))) {
		return null;
	}

	if(/you there/.test(messageValue)){
		return "Yes i am here "+ getUsername(api, message);
	}

	//Open the pod bay doors, HAL
	if (/open the pod.*/.test(messageValue)) {
		return "I’m sorry, Dave, I’m afraid I can’t do that.";
	}

	if (/who should*/.test(messageValue)) {
		var chosenParticipant = pickRandomParticipant(api, message.threadID)
		return chosenParticipant;
	}
	return "I am afraid i can't answer that";
}

function getUsername(api, message){
	var name
	api.getUserInfo([message.senderID], function callback(err, users) {
		if (err) return console.error(err);
		console.log(users[message.senderID].firstName);
		name = users[message.senderID].firstName;
	});
	return name;
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
