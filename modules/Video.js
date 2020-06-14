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

const create = (id) => {
    const output = `tmp/${id}.mp4`;
    console.log(` -> ${output}`);
    const video = new ffmpeg();
	video.addInput(`tmp/${id}.png`);
	video.loop();
	video.addInput(`tmp/${id}.mp3`);
	video.addOption(`-shortest`);
	video.audioCodec(`libmp3lame`);
    video.audioBitrate(128);
	video.size(`1280x720`);
	video.format(`mp4`);
	video.fps(60);
	video.videoCodec(`libx264`);
	video.videoBitrate(5000);
    video.addOption(`-pix_fmt yuv420p`);
	return new Promise(resolve => {
        video.save(output).on(`end`, () => resolve(output));
    });
}

const merge = (clips, output) => {
    console.log(` -> ${output}`);
    const video = new ffmpeg();
    for (const clip of clips) video.addInput(clip);
    return new Promise(resolve => {
        video.mergeToFile(output, `tmp/`).on(`end`, () => resolve(output));
    });
}

const backgroundMusic = (file, output) => {
    console.log(` -> ${output}`);
	const video = new ffmpeg();
	video.addInput(`tmp/chunks.mp4`);
	video.addInput(file);
	video.addOptions([
        `-filter_complex [0:a]aformat=fltp:44100:stereo,apad[0a];[1]aformat=fltp:44100:stereo,volume=0.25[1a];[0a][1a]amerge[a]`,
        `-map 0:v`, `-map [a]`, `-ac 2`, `-shortest`
    ]);
	return new Promise(resolve => {
        video.save(output).on(`end`, () => resolve());
    });
}

module.exports = {
	generate: (subreddit, post, comments) => {
		return new Promise(async resolve => {

            console.log(`Making video files`);
            await create(post.id);
            await merge([`tmp/${post.id}.mp4`, `resources/videos/glitch.mp4`], `tmp/${post.id}-glitch.mp4`);

            const clips = [`tmp/${post.id}-glitch.mp4`];

            let cuts;
            for (const comment of comments) {

                cuts = [];
                const iterations = comment.paragraphs.length + (comment.reply ? comment.reply.paragraphs.length : 0);
                for (let i=0; i<iterations; ++i) {
                    let cut = await create(`${comment.id}-${i}`);
                    cuts.push(cut);
                }

                await merge(cuts, `tmp/${comment.id}.mp4`);
                await merge([`tmp/${comment.id}.mp4`, `resources/videos/glitch.mp4`], `tmp/${comment.id}-glitch.mp4`);

                clips.push(`tmp/${comment.id}-glitch.mp4`);

            }

            console.log(`Working on chunks`);
            let n = 0;
            const chunks = [];
            for (let i=0; i<clips.length; i+=6, ++n) {
                await merge(clips.slice(i, i+6), `tmp/chunk${n}.mp4`);
                chunks.push(`tmp/chunk${n}.mp4`);
            }

            console.log(`Merging chunks`);
            await merge(chunks, `tmp/chunks.mp4`);
            
            console.log(`Adding the background music`);
            await backgroundMusic(`resources/music/lofi-1.mp3`, `${post.id}.mp4`);

			resolve();
        });
	}
};
