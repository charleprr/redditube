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
    const video = new ffmpeg();
	video.addInput(`tmp/${id}.png`);
	video.loop();
	video.addInput(`tmp/${id}.mp3`);
	video.addOption(`-shortest`);
	video.audioCodec(`libmp3lame`);
    video.audioBitrate(128);
	video.size(`1280x720`);
	video.format(`mp4`);
	video.fps(30);
	video.videoCodec(`libx264`);
	video.videoBitrate(5000);
    video.addOption(`-pix_fmt yuv420p`);
    video.save(output);
	return new Promise(resolve => video.on(`end`, resolve(output)));
}

const merge = (clips, output) => {
    const output = `tmp/${output}.mp4`;
    const video = new ffmpeg();
    for (const clip of clips) video.addInput(`tmp/${clip}.mp4`);
    video.mergeToFile(output, `tmp/`);
    return new Promise(resolve => video.on(`end`, resolve(output)));
}

const lofi = () => {
	const video = new ffmpeg();
	video.addInput(`tmp/tmp.mp4`);
	video.addInput(`resources/music/lofi3.mp3`);
	video.addOptions([
        `-filter_complex [0:a]aformat=fltp:44100:stereo,apad[0a];[1]aformat=fltp:44100:stereo,volume=0.4[1a];[0a][1a]amerge[a]`,
        `-map 0:v`, `-map [a]`, `-ac 2`, `-shortest`
    ]);
    video.save(`final_video.mp4`);
	return new Promise(resolve => video.on(`end`, resolve));
}

module.exports = {
	generate: (post, comments) => {
		return new Promise(async resolve => {

            const clips = [];

            await merge([
                await create(post.id), `resources/videos/glitch.mp4`
            ], post.id).then(file => clips.push(file));

            const splits;
            for (const comment of comments) {

                splits = [];
                for (let i=0; i<comment.paragraphs.length; ++i) {
                    await create(`${comment.id}-${i}`).then(split => splits.push(split));
                }

                await merge([
                    await merge(splits), `resources/videos/glitch.mp4`
                ], comment.id).then(file => clips.push(file));
                
            }

            await merge(clips, `tmp.mp4`);
			await lofi();

			resolve();
        });
	}
};
