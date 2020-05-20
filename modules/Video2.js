/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const FfmpegCommand  = require(`fluent-ffmpeg`);

let generateClip = async (id) => {
	console.log(`Generating ./temporary/${id}.mp4`);
	return new Promise(resolve => {
		new FfmpegCommand()
		// Image
			.addInput(`./temporary/${id}.png`)
			.loop()
		// Sound
			.addInput(`./temporary/${id}.mp3`)
			.addOption(`-shortest`)
			.audioCodec(`libmp3lame`)
			.audioBitrate(128)
		// Configuration
			.size(`1280x720`)
			.format(`mp4`)
			.videoCodec(`libx264`)
			.videoBitrate(5000)
			.fps(30)
			.aspect(`16:9`)
			.addOption(`-pix_fmt yuv420p`)
		// Run
			.save(`./temporary/${id}.mp4`)
			.on(`end`, () => resolve());
	});
}

let mergeClips = (post, comments) => {
	console.log(`Merging`);
	return new Promise(resolve => {
		let command = new FfmpegCommand()
		command.mergeAdd(`./temporary/${post.id}.mp4`)
		for (let comment of comments)
			command.mergeAdd(`./temporary/${comment.id}.mp4`);
		command.mergeToFile(`./video.mp4`, `./temporary/`)
		command.on(`end`, () => resolve());
	});

	/*
	ffmpeg(`/path/to/part1.avi`)
	.input(`/path/to/part2.avi`)
	.input(`/path/to/part2.avi`)
	.on(`error`, function(err) {
		console.log(`An error occurred: ` + err.message);
	})
	.on(`end`, function() {
		console.log(`Merging finished !`);
	})
	.mergeToFile(`/path/to/merged.avi`, `/path/to/tempDir`);
	*/
}

module.exports = {
	generate: (post, comments) => {
		return new Promise(async resolve => {

			//await generateClip(post.id);
			//for (let comment of comments) await generateClip(comment.id);
			await mergeClips(post, comments);

			resolve();
        });
	}
};
