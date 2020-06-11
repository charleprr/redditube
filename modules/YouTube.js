/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const googleapis = require('googleapis'); // AIzaSyAFfTodx67vV7UHkfiqSv0xqv4Odr5Lw20

// Full sample on how to upload to youtube:
// https://github.com/googleapis/google-api-nodejs-client/blob/master/samples/youtube/upload.js

module.exports = {
    upload: (title, description, tags, privacy) => {
        return new Promise (resolve => {
            return resolve();
            
            googleapis.discover('youtube', 'v3').execute((err, client) => {
                // https://developers.google.com/youtube/v3/docs/videos/insert#request-body
                let metadata = {
                    snippet: {
                        title: title,
                        description: description,
                        tags: tags,
                        categoryId: 24
                    }, 
                    status: {
                        privacyStatus: privacy
                    }
                };
                client
                    .youtube.videos.insert({ part: 'snippet,status'}, metadata)
                    .withMedia('video/mp4', fs.readFileSync('video.mp4'))
                    .withAuthClient(auth)
                    .execute(function(err, result) {
                        if (err) console.log(err);
                        else console.log(JSON.stringify(result, null, '  '));
                    });
            });

            resolve();
        });
    }
};
