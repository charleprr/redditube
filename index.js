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
    make: function (id, numberOfComments=15) {

        return new Promise(async resolve => {

            const submission = await Reddit.fetch(id);
            submission.comments = submission.comments.slice(0, numberOfComments);

            console.log(submission.title);

            await Image.generate(submission);
            await Sound.generate(submission);
            await Video.generate(submission);

            console.log(`Video has been successfully generated`);
            
            resolve(`${submission.id}.mp4`);

            require(`fs`).readdir(`tmp`, (err, files) => {
                if (err) throw err;
                for (const file of files) {
                    fs.unlink(`tmp/${file}`, err => {
                        if (err) throw err;
                    });
                }
            });

        });
    }

};
