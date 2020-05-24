const Redditube = require(`./modules/Redditube.js`);

(async () => {
    await Redditube.make(`r/askreddit`, 3, `hot`, `all`);
    // await Redditube.upload();
})();
