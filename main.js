import * as prompt from 'prompt';
import { HAL } from './HAL3000'


const activationString = "hal";
const credentials = {
	email: "deep.into.my.thoughts@gmail.com",
	password: "RagnarKro42"
}
const schema = {
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

prompt.get(schema, (err, result) => {
	let email = result.email || credentials.email
	let password = result.password || credentials.password

	let hal = new HAL(activationString, credentials);
	hal.start()
});