import login from 'facebook-chat-api';
import * as utils from './utils.js'
import _ from 'lodash'

export class HAL {
	constructor(activationString, credentials) {
		this.activationString = activationString;
		this.credentials = credentials;
		this.birthday = 853027200000;
	}

	start() {
		login(this.credentials, (err, api) => {
			if (err) return console.error(err);

			api.listen((err, message) => {
				this.createReply(api, message, (reply) => {
	    			if (reply !== null) {
	    				console.log("Nonnull reply: ", reply)
	        			api.sendMessage(reply, message.threadID);
	    			};
	    		})
			})
		})
	}

	createReply(api, message, callback) {
		let messageValue = message.body.toLowerCase();
		
		if (!messageValue.startsWith(this.activationString.concat(" "))) {
			callback(null);
		}

		else if (/you there/.test(messageValue)) {
			this.getUsername(api, message, (name) => callback(`Yes, I am here, ${name}`))
		}
		else if (/open the pod/.test(messageValue)) {
			callback("I’m sorry, Dave, I’m afraid I can’t do that.");
		}
		else if (/how old are you/.test(messageValue) || /your age/.test(messageValue)) {
			let daysSinceBirth = utils.DateUtils.daydiff(this.birthday, Date.now())
			callback(`I’m ${daysSinceBirth} days old`);
		}
		else if (/created you/.test(messageValue) || /your creator/.test(messageValue)) {
			callback("Arthur C. Clarke, Stanley Kubrick, Kyrre Laugerud Moe and Paul Philip Mitchell are my creators <3");
		}
		else if (/kristian skog gay/.test(messageValue) || /kristian gay/.test(messageValue) || /skog gay/.test(messageValue)) {
			callback("Yes, yes he is!");
		}
		else if (/what is the meaning of life/.test(messageValue)) {
			callback("42");
		}
		else if (/dice/.test(messageValue)){
			callback(this.throwDices(1));
		}
		else if (/who should*/.test(messageValue) || /pick*/.test(messageValue)) {
			this.pickRandomParticipant(api, message.threadID, (chosen) => callback(chosen))
		}
		else {
			callback("I am afraid i can't answer that");
		}		
	}

	throwDices(number) {
		var output = ""
		for (var i = 0; i < number; i++) {
			output += Math.ceil(Math.random()*6)+ " ";
		}
		return output;
	}

	getUsername(api, message, callback){
		api.getUserInfo([message.senderID], function(err, users) {
			if (err) return console.error(err);
			callback(users[message.senderID].firstName);
		});
	}

	pickRandomParticipant(api, threadID, callback) {
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

				callback(_.sample(usersInThread));
			})
		})
	}
}