const Redditube = require(`./modules/Redditube.js`);

/**
 * [x] Replies with >1 paragraphs
 * [x] Background music is not so good after a while
 * [ ] Pargraphs array with '' strings
 * [ ] Comments going out of frame
 * [ ] Video randomly cuts at ~13min
 * [ ] Links in comments
 * [ ] Deleted comments
 *
 *  comments |   time   |  video
 *  3        | 00:11:00 | 00:01:30
 *  4        | 00:10:00 | 00:01:00
 *  4        | 00:17:00 | 00:02:00
 *  6        | 00:17:00 | 00:02:00
 *  8        | 00:12:00 | 00:01:30
 *  15       | 00:54:00 | 00:06:43
 *  20       |          |
 *  30       | 02:23:00 | 00:13:00
*/

(async () => {
    await Redditube.make(`hbsat8`, 3);
})();
