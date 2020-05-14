/**
 * s: top|hot|new
 * t: all|hour|day|week|month|year
 */
const getJSON = require("get-json");

let fetchPost = (subreddit, sort="top", time="all") => {
    console.log("Fetching post...");
    return new Promise((resolve, reject) => {
        getJSON(`https://www.reddit.com/${subreddit}/${sort}.json?&t=${time}&limit=1`, (e, res) => {
            if (e) reject(e);
            resolve(res.data.children[0].data);
        });
    });
}

let fetchComments = (subreddit, post_id, n, sort="top", time="all") => {
    console.log("Fetching comments...");
    return new Promise((resolve, reject) => {
        getJSON(`https://www.reddit.com/${subreddit}/comments/${post_id}/${sort}.json?t=${time}`, (e, res) => {
            if (e) reject(e);
            resolve(res[1].data.children.slice(0, n));
        });
    });
}

module.exports = {
    fetchPost: fetchPost,
    fetchComments: fetchComments
};