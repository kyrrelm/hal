import login from 'facebook-chat-api';
import { DateUtils } from './utils.js'
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
	        			api.sendMessage(reply, message.threadID);
	    			};
	    		})
			})
		})
	}

	createReply(api, message, callback) {
		if (!message.body) { return null }
		let msg = message.body.toLowerCase();
		
		if (!msg.startsWith(this.activationString.concat(" "))) {
			callback(null);
		}

		else if (/you there/.test(msg)) {
			this.getUsername(api, message, (name) => callback(`Yes, I am here, ${name}`))
		}
		else if (/open the pod/.test(msg)) {
			callback("I’m sorry, Dave, I’m afraid I can’t do that.");
		}
		else if (/how old are you/.test(msg) || /your age/.test(msg)) {
			callback(`I’m ${DateUtils.daydiff(this.birthday, Date.now())} days old`);
		}
		else if (/created you/.test(msg) || /your creator/.test(msg)) {
			callback("Arthur C. Clarke, Stanley Kubrick, Kyrre Laugerud Moe and Paul Philip Mitchell are my creators <3");
		}
		else if (/kristian skog gay/.test(msg) || /kristian gay/.test(msg) || /skog gay/.test(msg)) {
			callback("Yes, yes he is!");
		}
		else if (/meaning of life/.test(msg)) {
			callback("42");
		}
		else if (/dice/.test(msg)){
			callback(this.throwDices(1));
		}
		else if (/who should*/.test(msg) || /pick*/.test(msg)) {
			this.pickRandomParticipant(api, message.threadID, (chosen) => callback(chosen))
		}
		else {
			callback("I am afraid i can't answer that");
		}		
	}

	throwDices(number) {
		let output = ""
		for (var i = 0; i < number; i++) {
			output += Math.ceil(Math.random()*6)+ " ";
		}
		return output;
	}

	getUsername(api, message, callback){
		api.getUserInfo([message.senderID], (err, users) => {
			if (err) return console.error(err);
			callback(users[message.senderID].firstName);
		});
	}

	pickRandomParticipant(api, threadID, callback) {
		api.getThreadInfo(threadID, (err, info) => {
			if (err) return console.error(err);

			api.getUserInfo(info.participantIDs, (err, users) => {
				if (err) return console.error(err);

				let currentUserId = api.getCurrentUserID();
				let usersInThread = []
				for (let userId in users) {
					if (userId !== currentUserId) {
						usersInThread.push(users[userId].name)
					}
				} 

				callback(_.sample(usersInThread));
			})
		})
	}
}