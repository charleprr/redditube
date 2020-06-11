/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const ffmpeg = require(`fluent-ffmpeg`);

const postClip = post => {
    console.log(`\ttmp/${post.id}.mp4`);
	const clip = new ffmpeg()
	// Image
		.addInput(`tmp/${post.id}.png`)
		.loop()
	// Audio
		.addInput(`tmp/${post.id}.mp3`)
		.addOption(`-shortest`)
		.audioCodec(`libmp3lame`)
        .audioBitrate(128)
	// Configuration
		.size(`1280x720`)
		.format(`mp4`)
		.fps(30)
		.videoCodec(`libx264`)
		.videoBitrate(5000)
		.addOption(`-pix_fmt yuv420p`);
	
	return new Promise(resolve => {
		clip.save(`tmp/${post.id}.mp4`).on(`end`, resolve);
	});
}

const commentClip = comment => {

    const n = comment.body.split(/\n(?!.)/g).length;

    return new Promise(async resolve => {
        for (let i=0; i<n; ++i) {
            console.log(`\ttmp/${comment.id}-${i}.mp4`);
            const clip = new ffmpeg()
                .addInput(`tmp/${comment.id}-${i}.png`)
                .loop()
                .addInput(`tmp/${comment.id}-${i}.mp3`)
                .addOption(`-shortest`)
                .audioCodec(`libmp3lame`)
                .audioBitrate(128)
                .size(`1280x720`)
                .format(`mp4`)
                .fps(30)
                .videoCodec(`libx264`)
                .videoBitrate(5000)
                .addOption(`-pix_fmt yuv420p`);
            await new Promise(resolve => { clip.save(`tmp/${comment.id}-${i}.mp4`).on(`end`, resolve); });
        }
        
        console.log(`\tMerging into tmp/${comment.id}.mp4`);
        const clip = new ffmpeg();
        for (let i=0; i<n; ++i) {
            clip.addInput(`tmp/${comment.id}-${i}.mp4`);
        }
        //clip.addInput(`resources/videos/glitch.mp4`);
        await new Promise(resolve => { clip.mergeToFile(`tmp/${comment.id}.mp4`, `tmp/`).on(`end`, resolve); });
        
        resolve();
    });
    
}

const mergeClips = (post, comments) => {	
    const video = new ffmpeg();
    
    // Post
	video.addInput(`tmp/${post.id}.mp4`);
	video.addInput(`resources/videos/glitch.mp4`);
	// Comments
	for (const comment of comments) {
		video.addInput(`tmp/${comment.id}.mp4`);
		video.addInput(`resources/videos/glitch.mp4`);
    }
    
	return new Promise(resolve => {
		video.mergeToFile(`tmp/video.mp4`, `tmp/`).on(`end`, resolve);
	});
}

const backgroundMusic = () => {
	const video = new ffmpeg();
	video.addInput(`tmp/video.mp4`);
	video.addInput(`resources/music/lofi2.mp3`);
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
            /* Work here first */

            await postClip(post);

            for (const comment of comments) {
                await commentClip(comment);
            }
            
            console.log(`Merging clips`);
            await mergeClips(post, comments);
            
            console.log(`Adding some LoFi`);
			await backgroundMusic();

			resolve();
        });
	}
};
