<p align="center">
  <img src="./resources/images/redditube.png" width="100"><br/>
  <b>Redditube</b><br/>
  A video generator from Reddit submissions and comments
</p>

### Installation

You'll need to install [FFmpeg](https://ffmpeg.org/download.html) on your machine.

### Importation

```js
const Redditube = require(`redditube`);
```

### Configuration

You will need to configure Reddit authentification before generating videos.<br/>
This can be done with one of those ways:

1. Using a script-type Reddit app. Go to [Reddit preferences](https://ssl.reddit.com/prefs/apps/) to create yours.
```js
Redditube.config({
    "userAgent": "put your user-agent string here",
    "clientId": "put your client id here",
    "clientSecret": "put your client sercret here",
    "username": "put your username here",
    "password": "put your password here"
});
```

2. Using OAuth credentials. See [reddit-oauth-helper](https://github.com/not-an-aardvark/reddit-oauth-helper) for help.
```js
Redditube.config({
    "userAgent": "put your user-agent string here",
    "clientId": "put your client id here",
    "clientSecret": "put your client secret here",
    "refreshToken": "put your refresh token here"
});
```

### Generate a video

Use `make(submissionId [, numberOfComments=15])`.<br/>
It supports ES6 and returns a Promise.

```js
// Specifying the submission id only (will generate a video with 15 comments)
Redditube.make(`f9cufu`);

// Specifying the number of comments to include in the video.
Redditube.make(`f9cufu`, 10);
```

The submission id can be found in the URL when browsing Reddit submissions.<br/>
In `www.reddit.com/r/AskReddit/comments/f9cufu/what_are_some_ridiculous_history_facts/`, the submission id is `f9cufu`.
