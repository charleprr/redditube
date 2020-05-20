/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const ffmpeg = require('fluent-ffmpeg');

let generateClip = async (id) => {
	const image = `./temporary/${id}.png`;
	const sound = `./temporary/${id}.mp3`;
	const command = new ffmpeg();

	// Input
	command.addInput(image);
	command.addInput(sound);

	// Options
	command.format(`mp4`);
	command.size(`1920x1080`);
	command.aspect('16:9');
	command.fps(60);
	command.videoCodec(`libx264`);
	command.videoBitrate(1024);
	command.audioCodec(`libmp3lame`);
	command.audioBitrate(128);

	// Output
	command.output(`./temporary/${id}.mp4`);
	command.outputOptions([`-pix_fmt yuv420p`]);
	
	command.run()
	command.on('start', (commandLine) => {
		console.log(commandLine);
	});
}

let mergeClips = (post, comments) => {
	const command = new ffmpeg();

	// command.mergeAdd('/path/to/input1.avi');
	// command.mergeAdd('/path/to/input2.avi');
	//...



	/*
	let child = shelljs.exec(`ffmpeg -f concat -safe 0 -protocol_whitelist file,http,https,tcp,tls,crypto -i ${args.fileList} -c copy ${outputFileName} ${overwrite}`, { async: true, silent: spec.silent });
	child.on('exit', (code, signal) => {
        if (code === 0) {
          resolve(outputFileName);
        } else {
          reject();
        }
	});
	*/

	/*
	ffmpeg('/path/to/part1.avi')
	.input('/path/to/part2.avi')
	.input('/path/to/part2.avi')
	.on('error', function(err) {
		console.log('An error occurred: ' + err.message);
	})
	.on('end', function() {
		console.log('Merging finished !');
	})
	.mergeToFile('/path/to/merged.avi', '/path/to/tempDir');
	*/

}

module.exports = {
	generate: (post, comments) => {
		return new Promise(async resolve => {

			await generateClip(post.id);
			for (let comment of comments) await generateClip(comment.id);
			await mergeClips(post, comments);

			resolve();
        });
	}
};
