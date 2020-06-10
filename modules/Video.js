/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const ffmpeg  = require(`fluent-ffmpeg`);

let generateClip = async (id) => {
	let clip = new ffmpeg()
	// Image
		.addInput(`./tmp/${id}.png`)
		.loop()
	// Audio
		.addInput(`./tmp/${id}.mp3`)
		.addOption(`-shortest`)
		.audioCodec(`libmp3lame`)
		.audioBitrate(128) // 128
	// Configuration
		.size(`1280x720`)
		.format(`mp4`)
		.fps(30)
		.videoCodec(`libx264`)
		.videoBitrate(5000) // 5000
		.addOption(`-pix_fmt yuv420p`);
	
	return new Promise(resolve => {
		clip.save(`./tmp/${id}.mp4`).on(`end`, resolve);
	});
}

let mergeClips = (post, comments) => {	
    let video = new ffmpeg();
    
    // Post
	video.addInput(`tmp/${post.id}.mp4`);
	video.addInput(`resources/videos/glitch.mp4`);
	// Comments
	for (let comment of comments) {
		video.addInput(`tmp/${comment.id}.mp4`);
		video.addInput(`resources/videos/glitch.mp4`);
    }
    
	return new Promise(resolve => {
		video.mergeToFile(`tmp/video.mp4`, `tmp/`).on(`end`, resolve);
	});
}

let backgroundMusic = () => {
	let video = new ffmpeg();
	video.addInput(`./tmp/video.mp4`);
	video.addInput(`./resources/music/lofi2.mp3`);
	video.addOptions([
        `-filter_complex [0:a]aformat=fltp:44100:stereo,apad[0a];[1]aformat=fltp:44100:stereo,volume=0.4[1a];[0a][1a]amerge[a]`,
        `-map 0:v`, `-map [a]`, `-ac 2`, `-shortest`
    ]);
	return new Promise(resolve => {
		video.save(`video.mp4`).on('end', resolve);
	});
}

module.exports = {
	generate: (post, comments) => {
		return new Promise(async resolve => {

            console.log(`Generating clips`);
            await generateClip(post.id);
            for (let comment of comments)
                await generateClip(comment.id);
            
            console.log(`Merging clips`);
            await mergeClips(post, comments);
            
            console.log(`Adding some LoFi`);
			await backgroundMusic();

			resolve();
        });
	}
};
