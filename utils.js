export const DateUtils = {
	daydiff: function(firstDate, secondDate) {
		return Math.round((secondDate-firstDate)/(1000*60*60*24));
	}
}