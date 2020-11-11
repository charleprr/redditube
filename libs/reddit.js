/**
 * @name Redditube
 * @version 1.0.2
 * 
 * A video generator from Reddit
 * submissions and comments.
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const Snoowrap = require(`snoowrap`);
const { comment } = require("./screenshot");
let reddit = null;

const format = submission => ({
    id: submission.id,
    subreddit: submission.subreddit.display_name,
    isSubmission: true,
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

    config: function (configuration) {
        reddit = new Snoowrap(configuration);
    },

    fetch: async function (id) {
        if (reddit) {
            return format(await reddit.getSubmission(id).fetch());
        } else {
            throw new Error(`Reddit authentification has not been configured!`);
        }
    },

    fetchRandom: async function (subreddit) {
        if (reddit) {
            return format(await reddit.getRandomSubmission(subreddit).fetch());
        } else {
            throw new Error(`Reddit authentification has not been configured!`);
        }
    },

    clean: function (submission) {
        for (let i=0; i<submission.comments.length; ++i) {
            if (submission.comments[i].body === "[deleted]") {
                submission.comments.splice(i, 1);
            } else {
                for (let j=0; j<submission.comments[i].replies.length; ++j) {
                    if (submission.comments[i].replies[j].body === "[deleted]") {
                        submission.comments[i].replies.splice(j, 1);
                    }
                }
            }
        }
        return submission;
    }

}
