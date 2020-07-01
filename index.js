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
const Image = require(`./modules/Image.js`);
const Sound = require(`./modules/Sound.js`);
const Video = require(`./modules/Video.js`);

module.exports = {

    /**
     * Configure authentification parameters
     * for Reddit.
     * 
     * @param {Object} configuration The configuration object
     */
    config: Reddit.config,

    /**
     * Make a video from a Reddit submission ID.
     * 
     * @param {String} id               The ID of a Reddit submission
     * @param {Number} numberOfComments The number of 1st-level comments to put in the video
     * 
     * @return {String} Path to the generated video file
     */
    make: function (id) {
        return new Promise(async resolve => {

            // 1. Fetch the submission
            const submission = await Reddit.fetch(id);
            
            // 2. Make clips
            const clips = [];

            let screenshot = await Image.screenshot(submission);
            let narration = await Sound.narrate(submission);
            let clip = await Video.make(screenshot, narration);
            clips.push(clip);

            for (let i=0; i<3; ++i) {
                screenshot = await Image.screenshot(submission.comments[i]);
                narration = await Sound.narrate(submission.comments[i]);
                clip = await Video.make(screenshot, narration);
                clips.push(clip);
            }

            // 3. Edit the final video
            const filename = await Video.edit(clips);

            // 4. Remove temporary files
            require(`fs`).readdir(`tmp`, (err, files) => {
                if (err) throw err;
                for (const file of files) {
                    fs.unlink(`tmp/${file}`, err => {
                        if (err) throw err;
                    });
                }
            });

            resolve(filename);
        });
    }

};
