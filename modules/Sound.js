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

function TTS(text, output) {
    console.log(` -> ${output}`);
    const request = {
        input: {text: text},
        voice: {languageCode: `en-US`, ssmlGender: `MALE`},
        audioConfig: {audioEncoding: `MP3`},
    };
    return new Promise(async resolve => {
        const [response] = await client.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(output, response.audioContent, `binary`);
        resolve();
    });
}

module.exports = {

    /**
     * Generates all the sounds needed for the video
     * and saves them in the temporary folder.
     * 
     * @param {Object} submission A reddit submission
     */
    generate: function (submission) {
        return new Promise(async resolve => {

            await TTS(`${subreddit.replace(`/`, ` slash `)} by ${post.author}. ${post.title}`, `tmp/${post.id}.mp3`);
            for (const comment of comments) {
                const paragraphs = comment.paragraphs;
                const iterations = paragraphs.length + (comment.reply ? comment.reply.paragraphs.length : 0);
                for (let i=0; i<iterations; ++i) {
                    if (i < paragraphs.length) {
                        await TTS(paragraphs[i], `tmp/${comment.id}-${i}.mp3`);
                    } else {
                        await TTS(comment.reply.paragraphs[i-paragraphs.length], `tmp/${comment.id}-${i}.mp3`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            resolve();
        });
    }
};
