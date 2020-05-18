const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const client = new textToSpeech.TextToSpeechClient();

let TTS = (text, id, path) => {
    let filepath = `${path}/${id}.mp3`;
    console.log(`Generating ${filepath}`);
    return new Promise(async (resolve, reject) => {
        const request = {
            input: {text: text},
            voice: {languageCode: 'en-US', ssmlGender: 'MALE'},
            audioConfig: {audioEncoding: 'MP3'},
        };
        const [response] = await client.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(filepath, response.audioContent, 'binary');
        resolve(filepath);
    });
}

module.exports = {
    generate: async (post, comments) => {
        return new Promise(async resolve => {
            await TTS(post);
            for (let comment of comments) await TTS(comment);
            resolve();
        });
    }
};
