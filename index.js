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
const ImageUtility = require("./modules/ImageUtility.js");
const VoiceUtility = require("./modules/VoiceUtility.js");
const VideoUtility = require("./modules/VideoUtility.js");

/* Settings */
const subreddit = "r/askreddit";
const directory = "./media";

(async () => {

    /* Find post and comments */
    let post = await RedditManager.fetchPost(subreddit, sort="top", time="all");
    let comments = await RedditManager.fetchComments(subreddit, post.id, 3);

    /* Generate images */
    //await ImageUtility.generateImages(post, comments, `${directory}/images`);

    /* Generate voices */
    //await VoiceUtility.generateVoices(post, comments, `${directory}/voices`);

    /* Create clips merge them */
    //await VideoUtility.generateClips(post, comments, `${directory}/clips`);
    await VideoUtility.mergeClips(post, comments, `${directory}/clips`);

    /* Upload to Youtube */
    //await VideoUtility.upload();

})();
