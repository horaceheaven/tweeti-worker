var kue = require('kue');
var Twitter = require('twitter');

var queue = kue.createQueue({ jobEvents: false });

queue.process('tweet', function (job, done) {
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

queue.on('job enqueue', function (id, type) {
	console.log('job #%s got queued of type %s', id, type);
})
	.on('job complete', function (id, type) {
		kue.Job.get(id, function (err, job) {
			if (err) return;
			job.remove(function () {
				if (err) throw err;
				console.log('removed completed job #%d', job.id);
			});
		});
	});

var port = 3001;
kue.app.listen( port );
console.log('kue listening on post ' + port);