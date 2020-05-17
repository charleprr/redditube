/**
 * Comments   : Noto Sans
 * TTS voice  : Daniel (UK) or "MLG voice"
 */
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const client = new textToSpeech.TextToSpeechClient();

let generateVoices = async (post, comments, path) => {
    await TTS(post.title, post.id, path);
    comments.forEach(async comment => await TTS(comment.body, comment.id, path));
}

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
    generateVoices: generateVoices
};
