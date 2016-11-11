var login = require("facebook-chat-api");
var prompt = require('prompt');
const birthday = 853027200000;


//CHANGE THIS FOR TESTING
//not case sensitive
var activationString = "hal";
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
	    		createReply(api, message, function(reply) {
	    			console.log("Reply", reply);
	    			if (reply !== null) {
	        			api.sendMessage(reply, message.threadID);
	    			};
	    		})
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

function daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}

function throwDices(number){
	var output = ""
	for (var i = 0; i < number; i++) {
		output += Math.ceil(Math.random()*6)+ " ";
	}
	return output;
}

function createReply(api, message, callback){
	var messageValue = message.body.toLowerCase();

	if (!messageValue.startsWith(activationString.concat(" "))) {
		callback(null);
	}
	else if(/you there/.test(messageValue)){
		getUsername(api, message, function(name){
			callback("Yes i am here "+name);
		})
	}
	//Open the pod bay doors, HAL
	else if (/open the pod/.test(messageValue)) {
		callback("I’m sorry, Dave, I’m afraid I can’t do that.");
	}
	else if (/how old are you/.test(messageValue) || /your age/.test(messageValue)) {
		callback("I’m "+daydiff(birthday, Date.now())+" days old");
	}
	else if (/your birthday/.test(messageValue) || /your date of birth/.test(messageValue)) {
		callback("My birthday is "+new Date(birthday).toString());
	}
	else if (/created you/.test(messageValue) || /your creator/.test(messageValue) || /your maker/.test(messageValue) || /made you/.test(messageValue)) {
		callback("Arthur C. Clarke, Stanley Kubrick, Kyrre Laugerud Moe and Paul Philip Mitchell are my creators <3");
	}
	else if (/kristian skog gay/.test(messageValue) || /kristian gay/.test(messageValue) || /skog gay/.test(messageValue)) {
		callback("Yes, yes he is!");
	}
	else if (/what is the meaning of life/.test(messageValue)) {
		callback("42");
	}
	else if (/dice/.test(messageValue)){
		callback(throwDices(1));
	}
	else if (/who should*/.test(messageValue) || /pick*/.test(messageValue)) {
		pickRandomParticipant(api, message.threadID, function(chosen) {
			callback(chosen);
		})
	}
	else {
		callback("I am afraid i can't answer that");
	}
}

function getUsername(api, message, callback){
	api.getUserInfo([message.senderID], function(err, users) {
		if (err) return console.error(err);
		callback(users[message.senderID].firstName);
	});
}

function pickRandomParticipant(api, threadID, callback) {
	api.getThreadInfo(threadID, function(err, info) {
		if (err) return console.error(err);

		api.getUserInfo(info.participantIDs, function(err, users) {
			if (err) return console.error(err);

			var currentUserId = api.getCurrentUserID();
			var usersInThread = []
			for (var userId in users) {
				if (userId !== currentUserId) {
					usersInThread.push(users[userId].name)
				}
			} 

			callback(usersInThread[Math.floor(Math.random()*usersInThread.length)]);
		})
	})
}
