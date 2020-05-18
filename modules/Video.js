/**
 * 
*/
const videoShow = require("videoshow");
const configuration = {
	fps: 24,
	loop: 7,
	transition: false,
	videoBitrate: 1024,
	size: "1920x1080",
	format: "mp4",
	videoCodec: "libx264",
	outputOptions: ["-pix_fmt yuv420p"]
}
const videoStitch = require("video-stitch").concat;
const mp3Duration = require('mp3-duration');

let generateClip = async (id, path) => {
	let image = `./media/images/${id}.png`;
	let voice = `./media/voices/${id}.mp3`;
	let output = `${path}/${id}.mp4`;
	console.log(`Generating ${output}`);
	let duration = await mp3Duration(voice);
	console.log(duration);
	configuration.loop = duration;
	return new Promise((resolve, reject) => {
		videoShow([image], configuration).audio(voice).save(output)
		.on("error", (error, stdout, stderr) => {
			console.log(error);
			console.log(stdout);
			console.log(stderr);
			reject();
		}).on("end", () => {
			resolve();
		});
	});
}

let mergeClips = (post, comments, path) => {
	let clips = [{"fileName":`../home/pi/projects/redditube/media/clips/${post.id}.mp4`}];
	comments.forEach(comment => clips.push({"fileName":`../home/pi/projects/redditube/media/clips/${comment.id}.mp4`}));
	console.log(JSON.stringify(clips));
	console.log(`\nMerging clips`);
	return new Promise((resolve, reject) => {
		videoStitch({silent: false, overwrite: true})
		.clips(clips)
		.output(`./media/final_video.mp4`)
		.concat()
		.then((filename) => {
			console.log(`Done! Check ${filename}.`);
			resolve();
		});
	});
}

module.exports = {
	generate: async (post, comments) => {
		return new Promise(async resolve => {
			
			// Generate clips
			await generateClip(post.id, path);
			for (let comment of comments) await generateClip(comment.id, path);
			
			// Merge clips
			await mergeClips(post, comments);

			// Transitions?
			
			// Background music?

			resolve();
        });
	}
};