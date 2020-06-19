/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const Snoowrap = require(`snoowrap`);
const configuration = require(`../config.json`);
const reddit = new Snoowrap(configuration);

module.exports = {

    fetch: (id) => new Promise (async resolve => {
        const submission = await reddit.getSubmission(id).fetch();
        resolve({
            id: submission.id,
            subreddit: submission.subreddit.display_name,
            title: submission.title,
            body: submission.body,
            author: submission.author.name,
            ups: submission.ups,
            awards: submission.all_awardings.map(award => ({
                url: award.icon_url,
                count: award.count
            })),
            comments: submission.comments.map(comment => ({
                id: comment.id,
                author: comment.author.name,
                body: comment.body,
                ups: comment.ups,
                awards: comment.all_awardings.map(award => ({
                    url: award.icon_url,
                    count: award.count
                })),
                replies: comment.replies.map(reply => ({
                    id: reply.id,
                    body: reply.body,
                    author: reply.author.name,
                    ups: reply.ups,
                    awards: reply.all_awardings.map(award => ({
                        url: award.icon_url,
                        count: award.count
                    }))
                }))
            }))
        });
    }),

    fetchRandom: (subreddit, count, sort, time) => new Promise (resolve => {
        resolve(`Not supported yet.`);
    })

}
