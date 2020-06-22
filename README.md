<p align="center">
  <img src="./resources/images/redditube.png" width="100"><br/>
  <b>Redditube</b><br/>
  A video generator from Reddit submissions and comments
</p>

### Installation

Make you have [FFmpeg](https://ffmpeg.org/download.html) installed on your machine.

Inside the project directory, run `npm install` to install dependencies.

### Configuration

You will need to create a `config.json` file at the root of the project.<br/>
Fill it with one of the following options:

1. By using a script-type Reddit app (check [Reddit preferences](https://ssl.reddit.com/prefs/apps/) to create yours).
```json
{
    "userAgent": "put your user-agent string here",
    "clientId": "put your client id here",
    "clientSecret": "put your client sercret here",
    "username": "put your username here",
    "password": "put your password here"
}
```

2. By using OAuth credentials (see [reddit-oauth-helper](https://github.com/not-an-aardvark/reddit-oauth-helper) for help).
```json
{
    "userAgent": "put your user-agent string here",
    "clientId": "put your client id here",
    "clientSecret": "put your client secret here",
    "refreshToken": "put your refresh token here"
}
```

### Generate a video

`node index.js <submission_id>`

The submission id can be found in the URL when browsing Reddit.<br/>
In `www.reddit.com/r/AskReddit/comments/f9cufu/what_are_some_ridiculous_history_facts/`, the submission id is `f9cufu`.
