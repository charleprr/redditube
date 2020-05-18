/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const videoStitch = require(`video-stitch`).concat;
const mp3Duration = require(`mp3-duration`);
const videoShow = require(`videoshow`);
const configuration = {
	fps: 24,
	loop: 7,
	transition: false,
	videoBitrate: 1024,
	size: `1920x1080`,
	format: `mp4`,
	videoCodec: `libx264`,
	outputOptions: [`-pix_fmt yuv420p`]
}

const FfmpegCommand = require('fluent-ffmpeg');
const command = new FfmpegCommand();

let generateClip = async (id) => {
	console.log(`Generating ${output}`);
	let image = `./temporary/${id}.png`;
	let voice = `./temporary/${id}.mp3`;
	let output = `./temporary/${id}.mp4`;
	let duration = await mp3Duration(voice);
	configuration.loop = duration;
	return new Promise((resolve, reject) => {
		videoShow([image], configuration).audio(voice).save(output)
		.on(`error`, (error, stdout, stderr) => {
			console.log(error);
			console.log(stdout);
			console.log(stderr);
			reject();
		}).on(`end`, () => {
			resolve();
		});
	});
}

let mergeClips = (post, comments) => {
	let clips = [{"fileName":`../home/pi/projects/redditube/temporary/${post.id}.mp4`}];
	comments.forEach(comment => clips.push({"fileName":`../home/pi/projects/redditube/temporary/${comment.id}.mp4`}));
	console.log(`\nMerging clips`);
	return new Promise(resolve => {
		videoStitch({silent: true, overwrite: true})
		.clips(clips)
		.output(`./final_video.mp4`)
		.concat()
		.then((filename) => {
			console.log(`Done! Check ${filename}.`);
			resolve();
		});
	});
}

module.exports = {
	generate: (post, comments) => {
		return new Promise(async resolve => {
			
			// Generate clips
			await generateClip(post.id);
			for (let comment of comments) await generateClip(comment.id);
			
			// Merge clips
			await mergeClips(post, comments);

			// Transitions?
			
			// Background music?

			resolve();
        });
	}
};
