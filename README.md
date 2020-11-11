<p align="center">
    <img src="./resources/images/redditube.png" width="96"/><br/>
</p>
<p align="center">
    <a href="https://github.com/charlypoirier/redditube/releases">
        <img alt="Release" src="https://img.shields.io/badge/Release-v1.0.2-1389BF.svg">
    </a>
    <a href="https://github.com/charlypoirier/redditube/blob/master/LICENSE">
        <img alt="License" src="https://img.shields.io/badge/License-MIT-458831.svg">
    </a><br/>
    <a href="https://github.com/charlypoirier/redditube#overview">Overview</a> •
    <a href="https://github.com/charlypoirier/redditube#installation">Installation</a> •
    <a href="https://github.com/charlypoirier/redditube#usage">Usage</a> •
    <a href="https://github.com/charlypoirier/redditube#contributing">Contributing</a> •
    <a href="https://github.com/charlypoirier/redditube#license">License</a>
</p>

## Overview
A video generator from Reddit submissions and comments!<br/>
Here is an example made with this generator: https://www.youtube.com/watch?v=yeaZMAtF_Yc

## Installation

### 1. Reddit
- Create a [Reddit account](https://www.reddit.com/register/) (if you don't already have one)
- Create a [Reddit app](https://ssl.reddit.com/prefs/apps/)
    - Give it a name (e.g. "Redditube")
    - Set the redirect URI to `http://127.0.0.1/`

We will need the **Client ID** (random string under the app name) and **Client secret** later.

### 2. Text-to-speech API
- Go to [Google Cloud](https://console.cloud.google.com/projectcreate) and create a new project
- Go to [Google Cloud](https://console.cloud.google.com/apis/credentials/serviceaccountkey) and create a service account for that project
- Go to [their text-to-speech API](https://console.cloud.google.com/marketplace/product/google/texttospeech.googleapis.com) and enable it
- Download your key credentials in JSON format

**Linux:** Run `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"` in a terminal<br/>
**Windows:** Run `SET GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json` in command prompt

This gives Redditube an access to Google Cloud's free text-to-speech API.

### 3. Dependencies
Make sure you have [FFmpeg](https://ffmpeg.org/download.html) installed on your machine.<br/>
Run `npm install redditube`.

If `canvas` fails to install, check that you have those libraries installed.
- pixeman (`apt-get install libpixman-1-dev`)
- cairo (`apt-get install libcairo2-dev`)
- pango (`apt-get install libsdl-pango-dev`)
- libjpeg (`apt-get install libjpeg-dev`)
- libgif (`apt-get isntall libgif-dev`)

Then, run `npm install redditube` again.

## Usage

```js
const Redditube = require(`redditube`);

// Configure access to Reddit
Redditube.config({
    "userAgent": "Redditube",
    "clientId": "",     // Your Client ID
    "clientSecret": "", // Your Client secret
    "username": "",     // Your Reddit username
    "password": ""      // Your Reddit password
});

// Log start, status, errors and end events (optional)
Redditube.on("start", () => console.log("Start event!"));
Redditube.on("status", status => console.log(status));
Redditube.on("error",  error => console.log(error));
Redditube.on("end", () => console.log("End event!"));

// Option 1
// Use .then() and .catch()
Redditube.make(`f9cufu`, 5).then(path_to_video => {
    console.log(path_to_video);
}).catch(error => {
    console.log(error);
});

// Option 2
// Await the promise (inside an asynchronous function)
const path_to_video = await Redditube.make(`f9cufu`, 5);
```
> `Redditube.make()` takes a submission ID and an optional number of comments to include in the video (15 by default).

> The submission ID can be found in the URL when browsing Reddit submissions.<br/>
> The submission ID used in the above examples (`f9cufu`) is taken from the URL of [this Reddit submission](https://www.reddit.com/r/AskReddit/comments/f9cufu/what_are_some_ridiculous_history_facts/).

## Contributing
Feel free to star, fork, create issues and pull requests on GitHub!<br/>
Here are some ideas I've had:
- Simplify the installation process (e.g. simpler text-to-speech API)
- Take a Reddit URL instead of the submission ID
- Thumbnail generation

## License
Released under the [MIT](https://github.com/charlypoirier/redditube/blob/master/LICENSE) license.
