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

        console.log("Redditube process started");
        let t0 = performance.now();

        let post = await Reddit.fetchPost(subreddit, sort, time);
        let comments = await Reddit.fetchComments(subreddit, post.id, count);

        await Image.generate(subreddit, post, comments);
        await Sound.generate(post, comments);
        await Video.generate(post, comments);

        /* Clean temporary folder */

        let title = `${post.title} - ${subreddit}`;
        let description = ``;
        let tags = post.title.split().push("reddit");
        let privacy = `unlisted`;
        
        await YouTube.upload(title, description, tags, privacy);

        let t1 = performance.now();
        console.log(`Execution time: ${t1-t0}ms`);

        resolve();

    })

};  
