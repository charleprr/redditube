/**
 * @name Redditube
 * @version 1.0.0
 * 
 * A video generator from Reddit
 * submissions and comments.
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const Snoowrap = require(`snoowrap`);
let reddit = null;

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
     * Configure authentification parameters
     * for Reddit.
     * 
     * @param {Object} configuration The configuration object
     */
    config: function (configuration) {
        reddit = new Snoowrap(configuration);
    },

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
    fetch: function (id) {
        return new Promise ((resolve, reject) => {
            if (reddit) {
                reddit.getSubmission(id).fetch().then(submission => {
                    resolve(format(submission));
                }).catch(reject);
            } else reject(`Reddit authentification has not been configured!`);
        });
    },

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
    fetchRandom: function (subreddit) {
        return new Promise ((resolve, reject) => {
            if (reddit) {
                reddit.getRandomSubmission(subreddit).fetch().then(submission => {
                    resolve(format(submission));
                }).catch(reject);
            } else reject(`Reddit authentification has not been configured!`);
        });
    }

}
