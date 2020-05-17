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

let generateClips = (post, comments, path) => {
	return new Promise(async (resolve, reject) => {
		await generateClip(post.id, path);
		for (let comment of comments)
			await generateClip(comment.id, path);
		resolve();
	});
}

let generateClip = (id, path) => {
	let image = `./media/images/${id}.png`;
	let voice = `./media/voices/${id}.mp3`;
	let output = `${path}/${id}.mp4`;
	console.log(`Generating ${output}`);
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

let upload = () => {
	//console.log(`Uploading to Youtube`);
	return new Promise((resolve, reject) => {
		resolve();
	});
}

module.exports = {
	generateClips: generateClips,
	mergeClips: mergeClips,
	upload: upload
};