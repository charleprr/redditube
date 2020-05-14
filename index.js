/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

/* Import modules */
const RedditManager = require("./modules/RedditManager.js");

/* Settings */
const subreddit = "r/askreddit";

/* Variables */
let post;
let comments;

(async () => {

    /* Find posts and comments */
    post = await RedditManager.getPost(subreddit, sort="top", time="all");
    comments = await RedditManager.getComments(subreddit, post.id, 3, sort="top", time="all");

    /* Generate images (1) */
    
    /* Generate text-to-speech (2) */
    
    /* Create videoclips with (1) and (2) */

    /* Merge clips */

    /* Upload to Youtube */

})();
