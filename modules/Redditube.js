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
const path = require(`path`);
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

        await Image.generate(post, comments, subreddit);
        await Sound.generate(post, comments);
        await Video.generate(post, comments);

        fs.readdir(`tmp`, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(`tmp/${file}`, err => {
                    if (err) throw err;
                });
            }
        });
        
        const title = `${post.title} - ${subreddit}`;
        const description = `${title}\n#reddit #stories`;
        const tags = post.title.split(` `);
        const privacy = `unlisted`;

        await YouTube.upload(title, description, tags, privacy);

        console.log(`Done! Took ${Math.round((performance.now() - t0) / 1000 / 60)} minutes`);
        resolve();

    })

};
