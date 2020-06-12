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
            console.log(`Fetched post « ${post.title} »`);
            return resolve({
                id: post.id,
                author: post.author,
                title: post.title,
                body: post.body,
                ups: post.ups,
                awards: post.all_awardings.map(award => Object({
                    name: award.name,
                    count: award.count,
                    url: award.icon_url
                }))
            });
        });
    }),

    fetchComments: (subreddit, post_id, n, sort=`top`, time=`all`) => new Promise((resolve, reject) => {
        getJSON(`https://www.reddit.com/${subreddit}/comments/${post_id}/${sort}.json?t=${time}`, (e, res) => {
            if (e) return reject(e);
            let comments = [];
            for (let comment of res[1].data.children.slice(0, n)) {
                comment = {
                    id: comment.data.id,
                    link_id: comment.data.link_id.substr(3),
                    author: comment.data.author,
                    body: comment.data.body,
                    paragraphs: comment.data.body.split(/\n(?!.)/g),
                    ups: comment.data.ups,
                    awards: comment.data.all_awardings.map(award => Object({
                        name: award.name,
                        count: award.count,
                        url: award.icon_url
                    }))
                };
                getJSON(`https://www.reddit.com/r/askreddit/comments/${comment.link_id}/_/${comment.id}.json`, (e, res) => {
                    if (e) return reject(e);
                    comment.replies = res[1].data.children[0].data.replies;
                    for (let i=0; i<comment.replies.length; ++i) {
                        comment.replies[i] = {
                            id: comment.data.children.replies[i].data.id,
                            author: comment.data.children.replies[i].data.author,
                            body: comment.data.children.replies[i].data.body,
                            ups: comment.data.children.replies[i].data.ups,
                            awards: comment.data.children.replies[i].data.all_awardings.map(award => Object({
                                name: award.name,
                                count: award.count,
                                url: award.icon_url
                            }))
                        }
                    }
                    comments.push(comment);
                    if (comments.length >= n) {
                        console.log(`Fetched ${comments.length} comments`);
                        return resolve(comments);
                    }
                });
            }
        });
    })

};
