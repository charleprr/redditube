const Redditube = require(`./modules/Redditube.js`);

(async () => {
    await Redditube.make(`r/AskReddit`, 2, `rising`, `today`);
})();
