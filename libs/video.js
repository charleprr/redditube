/**
 * @name Redditube
 * @version 1.0.3
 * 
 * A video generator from Reddit
 * submissions and comments.
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const ffmpeg = require(`fluent-ffmpeg`);
const shortId = require(`shortid`);
const Voiceover = require("./voiceover");

const transition = `${__dirname}/../resources/videos/glitch.mp4`;
const backgroundMusic = `${__dirname}/../resources/sounds/lofi1.mp3`;

function merge (...clips) {
    const output = `${__dirname}/../tmp/${shortId.generate()}.mp4`;
    const video = new ffmpeg();
    for (const clip of clips) video.addInput(clip);
    return new Promise(resolve => {
        video.mergeToFile(output, `${__dirname}/../tmp/`).on(`end`, () => resolve(output));
    });
}

function music (target, audio) {
    const output = `${__dirname}/../${shortId.generate()}.mp4`;
	const video = new ffmpeg();
	video.addInput(target);
	video.addInput(audio);
	video.addOptions([
        `-filter_complex [0:a]aformat=fltp:44100:stereo,apad[0a];[1]aformat=fltp:44100:stereo,volume=0.2[1a];[0a][1a]amerge[a]`,
        `-map 0:v`, `-map [a]`, `-ac 2`, `-shortest`
    ]);
	return new Promise(resolve => {
        video.save(output).on(`end`, () => resolve(output));
    });
}

module.exports = {

    make: function (screenshot, voiceover) {
        const output = `${__dirname}/../tmp/${shortId.generate()}.mp4`;
        const video = new ffmpeg();
        video.addInput(screenshot);
        video.loop();
        video.addInput(voiceover);
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
    },

    smartMerge: async (clips) => {
        return await clips.reduce(async (last, clip) => {
            return merge(await last, clip)
        });
    },

    glitch: async (clip) => await merge(clip, transition),
    music:  async (clip) => await music(clip, backgroundMusic),

};
