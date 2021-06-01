<p align="center">
    <img src="./resources/images/redditube.png" width="64"/><br/>
</p>
<p align="center">
    <a href="https://github.com/charlypoirier/redditube/releases">
        <img alt="Release" src="https://img.shields.io/badge/Release-v1.1.0-1389BF.svg">
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
Check out [this example video](https://www.youtube.com/watch?v=CDSohzteAaw), made with Redditube.

## Installation
`npm install redditube`

You will need to have [FFmpeg](https://ffmpeg.org/download.html) installed on your machine.<br/>
You will also need Reddit credentials.
- Create a [Reddit account](https://www.reddit.com/register/), if you don't already have one
- Create a [Reddit app](https://ssl.reddit.com/prefs/apps/)
    - Give it a name
    - Set the redirect URI to "http://127.0.0.1/"

We will need the Client ID (random string under the app name) and Client secret later.

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
Redditube.make(`f9cufu`, 3).then(path_to_video => {
    console.log(path_to_video);
}).catch(error => {
    console.log(error);
});

// Option 2
// Await the promise (inside an asynchronous function)
const path_to_video = await Redditube.make(`f9cufu`, 3);
```

You only need a submission ID, that can be found in the URL of a post on Reddit (e.g. `f9cufu` from [this url](https://www.reddit.com/r/AskReddit/comments/f9cufu/what_are_some_ridiculous_history_facts/)).<br/>
You can also specify the number of comments you want to include in the video (e.g. `3`), the default is 5.

## Contributing
Feel free to star the repository, create issues and make pull requests on [GitHub](https://github.com/charlypoirier/redditube).

## License
Released under the [MIT](https://github.com/charlypoirier/redditube/blob/master/LICENSE) license.
