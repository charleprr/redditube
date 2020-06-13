/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const fs = require(`fs`);
const { performance } = require(`perf_hooks`);

const Reddit = require(`./Reddit.js`);
const Image = require(`./Image.js`);
const Sound = require(`./Sound.js`);
const Video = require(`./Video.js`);

module.exports = {

    make: (subreddit, count, sort=`hot`, time=`all`) => new Promise(async resolve => {

        console.log(`Making video from ${subreddit}`);
        const t0 = performance.now();

        const post = await Reddit.fetchPost(subreddit, sort, time);
        const comments = await Reddit.fetchComments(subreddit, post.id, count);

        await Image.generate(post, comments);
        await Sound.generate(post, comments);
        await Video.generate(post, comments);

        fs.readdir(`./tmp`, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(`./tmp/${file}`);
            }
        });
        
        const title = `${post.title} - ${subreddit}`;

        console.log(`Done! Took ${Math.round((performance.now() - t0) / 1000 / 60)} minutes`);
        resolve();

    })

};
