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

const format = submission => ({
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
        paragraphs: comment.body.match(/(.+(?:\n+|$))/gm),
        ups: comment.ups,
        awards: comment.all_awardings.map(award => ({
            url: award.icon_url,
            count: award.count
        })),
        replies: comment.replies.map(reply => ({
            id: reply.id,
            body: reply.body,
            paragraphs: reply.body.match(/(.+(?:\n+|$))/gm),
            author: reply.author.name,
            ups: reply.ups,
            awards: reply.all_awardings.map(award => ({
                url: award.icon_url,
                count: award.count
            }))
        }))
    }))
});

module.exports = {

    /**
     * Fetch a submission from reddit.
     * 
     * Given a submission ID, this function will
     * fetch and return the submission containing
     * two levels of comments.
     * 
     * @param {Number} id The ID of a Reddit submission
     * 
     * @return {Object} The submission
     */
    fetch: (id) => new Promise (async resolve => {
        const submission = await reddit.getSubmission(id).fetch();
        resolve(format(submission));
    }),

    /**
     * Fetch a random submission from reddit.
     * 
     * Given a subreddit, this function will
     * fetch and return a random submission from
     * the front page, containing two levels of
     * comments.
     * 
     * @param {String} subreddit The name of a subreddit
     * 
     * @return {Object} The submission
     */
    fetchRandom: (subreddit) => new Promise (async resolve => {
        const submission = await reddit.getRandomSubmission(subreddit).fetch();
        resolve(format(submission));
    })

}
