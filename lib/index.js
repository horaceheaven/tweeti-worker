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

	var params = { status: job.data.status };

	client.post('statuses/update', params, function (err, tweet, res) {
		if (err) {
			console.log(JSON.stringify(err));
		}
		console.log(JSON.stringify(tweet));
		done();
	});
});

var port = 3001;
kue.app.listen( port );
console.log('kue listening on post ' + port);