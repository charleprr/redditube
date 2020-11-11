/**
 * @name Redditube
 * @version 1.0.1
 * 
 * A video generator from Reddit
 * submissions and comments.
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const textToSpeech = require(`@google-cloud/text-to-speech`);
const fs = require(`fs`);
const util = require(`util`);
const client = new textToSpeech.TextToSpeechClient();
const shortId = require(`shortid`);

async function TTS(text) {
    const output = `${__dirname}/../tmp/${shortId.generate()}.mp3`;
    const [response] = await client.synthesizeSpeech({
        input: {text: text},
        voice: {languageCode: `en-US`, ssmlGender: `MALE`},
        audioConfig: {audioEncoding: `MP3`},
    });
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(output, response.audioContent, `binary`);
    return output;
}

module.exports = {

    submission: async function (submission) {
        const introduction = `${submission.subreddit.replace(`/`, ` slash `)} by ${submission.author}.`;
        return await TTS(introduction + submission.title);
    },

    comment: async function (comment) {
        const filenames = [];

        let texts = comment.paragraphs;
        if (comment.replies.length > 0)
            texts = texts.concat(comment.replies[0].paragraphs);

        for (let i=0; i<texts.length; ++i) {
            const filename = await TTS(texts[i]);
            filenames.push(filename);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return filenames;
    }

};
