/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const { performance } = require(`perf_hooks`);
const Reddit = require(`./Reddit.js`);
const Image = require(`./Image.js`);
const Sound = require(`./Sound.js`);
const Video = require(`./Video.js`);
const YouTube = require(`./YouTube.js`);

module.exports = {

    make: (subreddit, count, sort=`hot`, time=`all`) => new Promise(async resolve => {

        console.log(`Making video from ${subreddit} (${sort}/${time})`)
        const t0 = performance.now();

        const post = await Reddit.fetchPost(subreddit, sort, time);
        const comments = await Reddit.fetchComments(subreddit, post.id, count);

        const title = `${post.title} - ${subreddit}`;
        const description = `${title}\n#reddit #stories`;
        const tags = post.title.split(` `);
        const privacy = `unlisted`;

        await Image.generate(post, comments, subreddit);
        await Sound.generate(post, comments);
        await Video.generate(post, comments);

        /* Clean temporary folder (synchronous) */

        await YouTube.upload(title, description, tags, privacy);

        const seconds = (performance.now() - t0) / 1000;
        console.log(`Execution time: ${Math.round(seconds/60)} minutes ${Math.round(seconds%60)} seconds`);

        resolve();

    })

};
