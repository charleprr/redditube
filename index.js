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
     * @param {String} id ID of a Reddit submission.
     * @param {Number} n  Number of comments in the video.
     * 
     * @return {Promise<String>} Path to the generated video file.
     */
    make: async function (id, n) {

        // 1. Fetch the submission
        const submission = await Reddit.fetch(id);
        
        // 2. Make clips
        const clips = [];

        const screenshot = await Screenshot.submission(submission);
        const voiceover = await Voiceover.submission(submission);
        let clip = await Video.make(screenshot, voiceover);
        clips.push(clip);

        for (let i=0; i<n; ++i) {

            const screenshots = await Screenshot.comment(submission.comments[i]);
            const voiceovers = await Voiceover.comment(submission.comments[i]);
            
            assert(screenshots.length === voiceovers.length);

            for (let j=0; j<screenshots.length; ++j) {
                clip = await Video.make(screenshots[j], voiceovers[j]); // ..
                clips.push(clip);
            }

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

        return filename;
    }

};
