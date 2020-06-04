const Redditube = require(`./modules/Redditube.js`);

(async () => {
    await Redditube.make(`r/askreddit`, 5, `hot`, `all`);
    // await Redditube.upload();
})();
