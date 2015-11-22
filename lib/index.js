var kue = require('kue');
var Twitter = require('twitter');

var queue = kue.createQueue({
	disableSearch: false,
	jobEvents: false
});

queue.process('tweet', function (job, done) {
	var client = new Twitter({
		consumer_key: job.data.consumerKey,
		consumer_secret: job.data.consumerSecret,
		access_token_key: job.data.accessTokenKey, // TODO update to read from environment variable
		access_token_secret: job.data.accessTokenSecret // TODO update to read from environment variable
	});

	var params = { status: job.data.status };

	client.post('statuses/update', params, function (err, tweet, res) {
		if (err) {
			console.log(JSON.stringify(err));
		}
		console.log(JSON.stringify(tweet));

	});
	done();
});

queue.on('job enqueue', function (id, type) {
	console.log('job #%s got queued of type %s', id, type);
})
	.on('job complete', function (id, type) {
		kue.Job.get(id, function (err, job) {
			console.log('completed job #%d', job.id);
			if (err) return;
		});
	});

var port = 3001;
kue.app.listen( port );
console.log('kue listening on post ' + port);