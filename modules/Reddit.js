/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const getJSON = require(`get-json`);

module.exports = {
    
    fetchPost: (subreddit, sort=`top`, time=`all`) => new Promise((resolve, reject) => {
        getJSON(`https://www.reddit.com/${subreddit}/${sort}.json?&t=${time}&limit=1`, (e, res) => {
            if (e) return reject(e);
            let post = res.data.children[0].data;
            console.log(`Post title is « ${post.title} »`);
            resolve(post);
        });
    }),

    fetchComments: (subreddit, post_id, n, sort=`top`, time=`all`) => new Promise((resolve, reject) => {
        getJSON(`https://www.reddit.com/${subreddit}/comments/${post_id}/${sort}.json?t=${time}`, (e, res) => {
            if (e) return reject(e);
            let comments = [];
            for (let comment of res[1].data.children.slice(0, n)) 
                comments.push(comment.data);
            console.log(`Fetched ${comments.length} comments`);
            resolve(comments);
        });
    })

};
