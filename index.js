/**
 * @name Redditube
 * @version 1.0.3
 * 
 * A video generator from Reddit
 * submissions and comments.
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const Reddit = require(`./libs/reddit.js`);
const Screenshot = require(`./libs/screenshot.js`);
const Voiceover = require(`./libs/voiceover.js`);
const Video = require(`./libs/video.js`);
const EventEmitter = require('events');
const fs = require(`fs`);
const path = require('path');

module.exports = new EventEmitter();

/**
 * Configure authentification parameters
 * for Reddit.
 * 
 * @param {Object} configuration The configuration object
 */
module.exports.config = Reddit.config;

/**
 * Make a video from a Reddit submission ID.
 * 
 * @param {String} id ID of a Reddit submission.
 * @param {Number} n  Number of comments in the video.
 * 
 * @return {Promise<String>} Path to the generated video file.
 */
module.exports.make = async function (id, n) {

    this.emit(`start`);
    
    // 1. Fetch the submission
    this.emit(`status`, `Fetching the submission`);
    const submission = Reddit.clean(await Reddit.fetch(id));
    
    // 2. Make clips
    const tmp = path.join(__dirname, `/tmp`);
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);

    const clips = [];
    let clip;
    n = Math.min(n, submission.comments.length);

    this.emit(`status`, `Generating introduction clip`);
    const screenshot = await Screenshot.submission(submission);
    const voiceover = await Voiceover.submission(submission);
    clip = await Video.make(screenshot, voiceover);
    clip = await Video.glitch(clip);
    clips.push(clip);
    
    for (let i=0; i<n; ++i) {

        this.emit(`status`, `Generating comment clip ${i+1} out of ${n}`);
        let screenshots, voiceovers;
        try {
            if (!submission.comments[i]) break;
            screenshots = await Screenshot.comment(submission.comments[i]);
            voiceovers = await Voiceover.comment(submission.comments[i]);
        } catch (e) {
            console.error(e.stack);
            submission.comments.splice(i--, 1);
            continue;
        }

        let temporary = [];
        for (let j=0; j<screenshots.length; ++j) {
            clip = await Video.make(screenshots[j], voiceovers[j]);
            temporary.push(clip);
        }

        clip = await Video.smartMerge(temporary);
        clip = await Video.glitch(clip);
        clips.push(clip);
    }

    // 3. Edit the final video
    this.emit(`status`, `Merging all clips`);
    const video = await Video.smartMerge(clips);
    this.emit(`status`, `Adding background music`);
    const final_video = await Video.music(video);
    
    this.emit(`end`);

    // 4. Remove temporary files
    fs.readdir(`${__dirname}/tmp`, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(`${__dirname}/tmp/${file}`, err => {
                if (err) throw err;
            });
        }
    });
    
    return final_video;
}
