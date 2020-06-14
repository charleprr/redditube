/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const rp = require('request-promise');

module.exports = {

    fetchRandomPost: (subreddit, sort=`top`, time=`all`, limit=30) => new Promise(async resolve => {

        const res = await rp({
            uri: `https://www.reddit.com/${subreddit}/${sort}.json?&t=${time}&limit=${limit}`,
            json: true
        });

        let post = res.data.children[Math.floor(Math.random()*limit)].data;
        post = {
            id: post.id,
            title: post.title,
            body: post.body,
            author: post.author,
            ups: post.ups,
            awards: post.all_awardings.map(award => Object({
                name: award.name, count: award.count, url: award.icon_url
            }))
        };

        console.log(`Fetched post « ${post.title} »`);
        return resolve(post);

    }),

    fetchComments: (subreddit, post_id, count, sort=`top`, time=`all`) => new Promise(async resolve => {

        console.log(`Fetching comments`);
        
        const res = await rp({
            uri: `https://www.reddit.com/${subreddit}/comments/${post_id}/${sort}.json?t=${time}`,
            json: true
        });

        const comments = [];
        for (let comment of res[1].data.children.slice(0, count)) {
            comment = {
                id: comment.data.id,
                link_id: comment.data.link_id.substr(3),
                author: comment.data.author,
                body: comment.data.body,
                paragraphs: comment.data.body.split(/\n(?!.)/g),
                ups: comment.data.ups,
                awards: comment.data.all_awardings.map(award => Object({
                    name: award.name, count: award.count, url: award.icon_url
                }))
            };

            if (comment.body.length < 1000) {

                const res = await rp({
                    uri: `https://www.reddit.com/r/askreddit/comments/${comment.link_id}/_/${comment.id}.json`,
                    json: true
                });

                const replies = res[1].data.children[0].data.replies.data.children;
                
                let maxUps = 0;
                for (const reply of replies) {
                    if (reply.data.ups > maxUps) {
                        maxUps = reply.data.ups;
                        comment.reply = {
                            id: reply.data.id,
                            body: reply.data.body,
                            paragraphs: reply.data.body.split(/\n(?!.)/g),
                            author: reply.data.author,
                            ups: reply.data.ups,
                            awards: reply.data.all_awardings.map(award => Object({
                                name: award.name,
                                count: award.count,
                                url: award.icon_url
                            }))
                        };
                    }
                }
            }

            comments.push(comment);
        }
        
        console.log(`Fetched ${comments.length} comments`);
        resolve(comments);
    })
    
}
