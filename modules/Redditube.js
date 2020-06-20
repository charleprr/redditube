/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const Log = require(`./Log.js`);
const Reddit = require(`./Reddit.js`);
const Image = require(`./Image.js`);
const Sound = require(`./Sound.js`);
const Video = require(`./Video.js`);

module.exports = {

    /**
     * Make a video from a Reddit submission ID.
     * 
     * @param {Number} id The ID of a Reddit submission
     * 
     * @return {String} Path to the generated video file
     */
    make: function (id) {

        console.log(`Making a video from Reddit`);

        return new Promise(async resolve => {

            const submission = await Reddit.fetch(id);
            await Image.generate(submission);
            await Sound.generate(submission);
            await Video.generate(submission);

            console.log(`Video has been successfully generated`);

            require(`fs`).readdir(`tmp`, (err, files) => {
                if (err) throw err;
                for (const file of files) {
                    fs.unlink(`tmp/${file}`, err => {
                        if (err) throw err;
                    });
                }
            });

            resolve(`${id}.mp4`);
        });
    }

};
