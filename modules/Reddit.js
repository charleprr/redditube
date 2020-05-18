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
    
    fetchPost: (subreddit, sort=`top`, time=`all`) => {
        console.log(`Fetching post`);
        return new Promise((resolve, reject) => {
            getJSON(`https://www.reddit.com/${subreddit}/${sort}.json?&t=${time}&limit=1`, (e, res) => {
                if (e) return reject(e);
                resolve(res.data.children[0].data);
            });
        });
    },

    fetchComments: (subreddit, post_id, n, sort=`top`, time=`all`) => {
        console.log(`Fetching comments`);
        return new Promise((resolve, reject) => {
            getJSON(`https://www.reddit.com/${subreddit}/comments/${post_id}/${sort}.json?t=${time}`, (e, res) => {
                if (e) return reject(e);
                let comments = [];
                for (let comment of res[1].data.children.slice(0, n)) 
                    comments.push(comment.data);
                resolve(comments);
            });
        });
    }

};