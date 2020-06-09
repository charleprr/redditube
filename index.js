const Redditube = require(`./modules/Redditube.js`);

(async () => {
    await Redditube.make(`r/AskReddit`, 8, `top`, `today`);
})();
