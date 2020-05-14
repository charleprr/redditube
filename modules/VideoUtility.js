/**
 * Example use:
 * index.js r/askreddit
 * 
 * Steps:
 * > 1. Try to create a simple video with some text/images
 *   2. Try to create text-to-speech audio files
 *   3. Try to create images from reddit posts/comments (optional)
 *   4. Merge all of them
*/

let videoshow = require("videoshow");
let outputPath = "output.mp4";

// Setup videoshow options
let videoOptions = {
	fps: 24,
	loop: 10,
	transition: false,
	videoBitrate: 1024,
	videoCodec: "libx264",
	size: "1920x1080",
	outputOptions: ["-pix_fmt yuv420p"],
	format: "mp4"
}

videoshow(["./question.png"], videoOptions).audio("0.wav").save(outputPath).on("start", (command) => { 
	//console.log("encoding " + outputPath + " with command " + command);
}).on("error", (err, stdout, stderr) => {
	return Promise.reject(new Error(err));
}).on("end", (output) => {
	console.log("> Done.");
});