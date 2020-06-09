/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const { performance } = require('perf_hooks');
const Reddit = require(`./Reddit.js`);
const Image = require(`./Image.js`);
const Sound = require(`./Sound.js`);
const Video = require(`./Video.js`);
const YouTube = require(`./YouTube.js`);

module.exports = {

    make: (subreddit, count, sort=`hot`, time=`all`) => new Promise(async resolve => {

        let t0 = performance.now();

        let post = await Reddit.fetchPost(subreddit, sort, time);
        let comments = await Reddit.fetchComments(subreddit, post.id, count);

        let title = `${post.title} - ${subreddit}`;
        let description = ``;
        let tags = post.title.split(` `);
        let privacy = `unlisted`;

        await Image.generate(post, comments, subreddit);
        await Sound.generate(post, comments);
        await Video.generate(post, comments);

        /* Clean temporary folder */

        await YouTube.upload(title, description, tags, privacy);

        let seconds = (performance.now() - t0) / 1000;
        console.log(`Execution time: ${Math.round(seconds/60)} minutes ${Math.round(seconds%60)} seconds`);

        resolve();

    })

};
