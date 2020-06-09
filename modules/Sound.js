/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const textToSpeech = require(`@google-cloud/text-to-speech`);
const fs = require(`fs`);
const util = require(`util`);
const client = new textToSpeech.TextToSpeechClient();

function TTS(text, id) {
    let filepath = `./tmp/${id}.mp3`;
    const request = {
        input: {text: text},
        voice: {languageCode: `en-US`, ssmlGender: `MALE`},
        audioConfig: {audioEncoding: `MP3`},
    };
    return new Promise(async resolve => {
        const [response] = await client.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(filepath, response.audioContent, `binary`);
        resolve();
    });
}

module.exports = {
    generate: (post, comments) => {
        return new Promise(async resolve => {
            console.log(`Generating sounds`);
            await TTS(post.title, post.id);
            for (let comment of comments)
                await TTS(comment.body, comment.id);
            resolve();
        });
    }
    
    /*
    generate: (post, comments) => Promise.all([
        TTS(post.title, post.id),
        comments.map(comment => TTS(comment.body, comment.id))
    ])
    */
};
