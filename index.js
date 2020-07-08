/**
 * @name Redditube
 * @version 1.0.0
 * 
 * A video generator from Reddit
 * submissions and comments.
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const Reddit = require(`./modules/Reddit.js`);
const Screenshot = require(`./modules/Screenshot.js`);
const Voiceover = require(`./modules/Voiceover.js`);
const Video = require(`./modules/Video.js`);
const EventEmitter = require('events');
const fs = require(`fs`);

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
    const submission = await Reddit.fetch(id);
    
    // 2. Make clips
    const clips = [];
    let clip;
    n = Math.min(n, submission.comments.length);

    this.emit(`status`, `Generating clips (${1}/${1+n})`);
    const screenshot = await Screenshot.submission(submission);
    const voiceover = await Voiceover.submission(submission);
    clip = await Video.make(screenshot, voiceover);
    clip = await Video.glitch(clip);
    clips.push(clip);
    
    for (let i=0; i<n; ++i) {

        this.emit(`status`, `Generating clips (${i+2}/${1+n})`);
        const screenshots = await Screenshot.comment(submission.comments[i]);
        const voiceovers = await Voiceover.comment(submission.comments[i]);
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
    this.emit(`status`, `Editing final video`);
    const video = await Video.smartMerge(clips);
    const final_video = await Video.music(video);
    
    this.emit(`end`);

    // 4. Remove temporary files
    fs.readdir(`tmp`, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(`tmp/${file}`, err => {
                if (err) throw err;
            });
        }
    });
    
    return final_video;
}
