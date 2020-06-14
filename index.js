const Redditube = require(`./modules/Redditube.js`);

/**
 * - Video randomly cuts at ~13min ????
 * - Comments ending with \n ?
 * - Comments going out of frame
 * - Replies with >1 paragraphs
 * - Background music is not so good after a while
 * 
 * 30 comments, 2 hours and 23 min to make
 * --> ~15min video
*/

(async () => {
    await Redditube.make(`r/AskReddit`, 30, `top`, `month`);
})();
