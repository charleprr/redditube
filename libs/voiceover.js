/**
 * @name Redditube
 * @version 1.0.3
 * 
 * A video generator from Reddit
 * submissions and comments.
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const shortId = require(`shortid`);
const md5 = require(`md5`);
const got = require(`got`);
const stream = require(`stream`);
const {promisify} = require(`util`);
const pipeline = promisify(stream.pipeline);
const fs = require(`fs`);

async function TTS(text) {
    const output = `${__dirname}/../tmp/${shortId.generate()}.mp3`;
    const params = new URLSearchParams();
    params.set(`EID`, `4`);
    params.set(`LID`, `1`);
    params.set(`VID`, `5`);
    params.set(`TXT`, text);
    params.set(`IS_UTF8`, `1`);
    params.set(`EXT`, `mp3`);
    params.set(`ACC`, `5883747`);
    params.set(`CS`, md5(`415${text}1mp35883747uetivb9tb8108wfj`));
    const url = `https://cache-a.oddcast.com/tts/gen.php?` + params.toString();
    await pipeline(got.stream(url), fs.createWriteStream(output));
    return output;
}

module.exports = {

    submission: async function (submission) {
        const introduction = `${submission.subreddit.replace(`/`, ` slash `)} by ${submission.author}. `;
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
