var set = {};
var message = {};
message.body = 1478824889599;
message.id = 2345;

console.log(shouldShowWelcomeMessage(message));
console.log(shouldShowWelcomeMessage(message));
console.log(Date.now());

function shouldShowWelcomeMessage(message){
	if (!(message.id in set)){
		set[message.id] = Date.now();
		return true;
	}else if(Date.now()-set[message.id] > 180000){
		set[message.id] = Date.now();
		return true;
	}
	return false;
}