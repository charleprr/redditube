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
const SpriteUtility = require("./modules/SpriteUtility.js");
const SoundUtility = require("./modules/SoundUtility.js");
const VideoUtility = require("./modules/VideoUtility.js");

/* Settings */
const subreddit = "r/askreddit";

/* Variables */
let sprites = [];
let sounds = [];

(async () => {

    /* Find posts and comments */
    let post = await RedditManager.fetchPost(subreddit);
    let comments = await RedditManager.fetchComments(subreddit, post.id, 3);

    /* Generate sprites (1) */
    sprites.push(await SpriteUtility.createPostSprite(post));
    for (let comment of comments) await sprites.push(SpriteUtility.createCommentSprite(comment));
    
    /* Generate text-to-speech (2) */
    
    /* Create videoclips with (1) and (2) */

    /* Merge clips */

    /* Upload to Youtube */
    
})();
