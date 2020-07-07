/**
 * @name Redditube
 * @version 1.0.0
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

async function TTS(text, name) {
    const output = `tmp/${name}.mp3`;
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
        return await TTS(introduction + submission.title, submission.id);
    },

    comment: async function (comment) {
        const filenames = [];
        const paragraphs = comment.paragraphs.concat(comment.replies[0].paragraphs);

        for (let i=0; i<paragraphs.length; ++i) {
            const filename = await TTS(paragraphs[i], `${comment.id}-${i}`);
            filenames.push(filename);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return filenames;
    }

};
