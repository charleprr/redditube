/**
 * @name Redditube
 * A video generator from Reddit
 * posts and comments.
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const ffmpeg = require(`fluent-ffmpeg`);
const shortId = require(`shortid`);
const fs = require(`fs`);

const sounds = fs.readdirSync(`${__dirname}/../resources/sounds/`);
const transition = `${__dirname}/../resources/videos/glitch.mp4`;

function merge (...clips) {
    const output = `${__dirname}/../tmp/${shortId.generate()}.mp4`;
    const video = new ffmpeg();
    for (const clip of clips) video.addInput(clip);
    video.addOption(`-vsync 2`);
    return new Promise(resolve => {
        video.mergeToFile(output, `${__dirname}/../tmp/`).on(`end`, () => resolve(output)).on(`start`, c=>console.log);
    });
}

function music (target) {
    const output = `${__dirname}/../${shortId.generate()}.mp4`;
    const audio = `${__dirname}/../resources/sounds/${sounds[Math.floor(Math.random()*sounds.length)]}`
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
	    let output = await merge(...clips.splice(0, 10));
        while (clips.length) {
            output = await merge(...[output, ...clips.splice(0, 10)]);
        }
        return output;
    },

    glitch: async (clip) => merge(clip, transition),
    music:  async (clip) => music(clip),

};
