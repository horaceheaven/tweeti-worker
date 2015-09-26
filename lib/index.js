var kue = require('kue');
var Twitter = require('twitter');

var jobs = kue.createQueue();

jobs.process('tweet', function (job, done) {
	var client = new Twitter({
		consumer_key: job.data.consumerKey,
		consumer_secret: job.data.consumerSecret,
		access_token_key: job.data.accessTokenKey,
		access_token_secret: job.data.accessTokenSecret
	});

	params = { status: job.data.status };

	client.post('status/update', params, function (err, tweet, res) {
		if (err) throw err;
		console.log(JSON.stringify(tweet));
		console.log(JSON.stringify(response));
	});
});

kue.app.listen( 3000 );