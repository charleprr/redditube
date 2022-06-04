/**
 * @name Redditube
 * A video generator from Reddit
 * posts and comments.
 * 
 * @copyright (C) 2020 by Charly Poirier
*/

const { loadImage, registerFont, createCanvas } = require(`canvas`);
const shortId = require(`shortid`);
const fs = require(`fs`);

let initialized = false;
let questionMark, upvote, downvote;

async function initialize () {
    registerFont(`${__dirname}/../resources/fonts/IBMPlexSans-Medium.ttf`, {family: `IBMPlexSans Medium`});
    registerFont(`${__dirname}/../resources/fonts/IBMPlexSans-Regular.ttf`, {family: `IBMPlexSans Regular`});
    registerFont(`${__dirname}/../resources/fonts/NotoSans-Regular.ttf`, {family: `Noto Sans`});
    questionMark = await loadImage(`${__dirname}/../resources/images/questionMark.png`);
    upvote = await loadImage(`${__dirname}/../resources/images/upvote.png`);
    downvote = await loadImage(`${__dirname}/../resources/images/downvote.png`);
    initialized = true;
}

function kFormat (num) {
    return Math.abs(num) > 999
    ? `${Math.sign(num)*((Math.abs(num)/1000).toFixed(1))}k`
    : Math.sign(num)*Math.abs(num);
}

function wrapText (ctx, text, x, y, maxWidth, lineHeight) {
    text = text.split(`\n`);
    for (const paragraph of text) {
        const words = paragraph.split(` `);
        let line = ``;
        for (let word of words) {
            line = `${line}${word} `;
            if (ctx.measureText(line).width > maxWidth) {
                ctx.fillText(line, x, y);
                y += lineHeight;
                line = ``;
            }
        }
        if (line.length > 0) {
            ctx.fillText(line, x, y);
            y += lineHeight;
        }
    }
    y -= lineHeight;
    if (y > 1080) throw new Error(`Comment is too long to fit.`);
    return y;
}

async function printCommentHeader (x, y, comment, ctx) {
    const points = `${kFormat(comment.ups)} points`;
    ctx.drawImage(upvote, x, y, 32, 36);
    ctx.drawImage(downvote, x, y+50, 32, 36);
    ctx.font = `24px IBMPlexSans Regular`;
    ctx.fillStyle = `#D7DADC`;
    const w1 = ctx.measureText(comment.author).width;
    ctx.fillText(comment.author, x+70, y+20);
    ctx.font = `24px IBMPlexSans Regular`;
    ctx.fillStyle = `#818384`;
    const w2 = ctx.measureText(points).width;
    ctx.fillText(points, x+79+w1, y+20);
    let icon;
    for (let i=0; i<comment.awards.length; ++i) {
        icon = await loadImage(comment.awards[i].url);
        ctx.drawImage(icon, x+w1+w2+i*40+90, y-5, 30, 30);
    }
}

function printCommentBody (x, y, text, ctx) {
    ctx.font = `30px Noto Sans`;
    ctx.fillStyle = `#D7DADC`;
    return wrapText(ctx, text, x, y, 1240, 40);
}

function save (canvas) {
    const output = `${__dirname}/../tmp/${shortId.generate()}.png`;
    return new Promise(resolve => {
        const out = fs.createWriteStream(output);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on(`finish`, () => resolve(output));
    });
}

module.exports = {

    submission: async function (submission) {
        if (!initialized) await initialize();

        const canvas = createCanvas(1920, 1080);
        const ctx = canvas.getContext(`2d`);
        ctx.fillStyle = `#1B191D`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const x = 420, y = 540;
        const author = `Posted by u/${submission.author}`;
        const points = kFormat(submission.ups);
        ctx.drawImage(questionMark, 832, y-320, 256, 256);
        ctx.drawImage(upvote, x, y, 32, 36);
        ctx.font = `32px IBMPlexSans Medium`;
        ctx.fillStyle = `#D7DADC`;
        ctx.fillText(points, x+16-(ctx.measureText(points).width/2), y+79);
        ctx.drawImage(downvote, x, y+100, 32, 36);
        ctx.font = `24px IBMPlexSans Regular`;
        ctx.fillStyle = `#818384`;
        wrapText(ctx, author, x+92, y+17, 1000, 48);
        let icon;
        for (let i=0; i<submission.awards.length; ++i) {
            icon = await loadImage(submission.awards[i].url);
            ctx.drawImage(icon, x+ctx.measureText(author).width+i*40+102, y-5, 30, 30);
        }
        ctx.font = `52px IBMPlexSans Medium`;
        ctx.fillStyle = `#D7DADC`;
        wrapText(ctx, submission.title, x+92, y+80, 850, 58);

        return await save(canvas);
    },
    
    comment: async function (comment) {
        if (!initialized) await initialize();

        const canvas = createCanvas(1920, 1080);
        const ctx = canvas.getContext(`2d`);
        ctx.fillStyle = `#1B191D`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const x = 180;
        const y = 145;
        const offset = 60;
        const files = [];

        await printCommentHeader(x, y, comment, ctx);
        let i, lastLine = y+72;
        for (i=0; i<comment.paragraphs.length; ++i) {
            lastLine = printCommentBody(x+70, lastLine, comment.paragraphs[i], ctx);
            files.push(await save(canvas));
        }

        if (comment.replies.length > 0) {

            let reply = comment.replies[0];
            await printCommentHeader(x+offset, lastLine+offset, reply, ctx);

            lastLine += 132;
            for (let j=0; j<reply.paragraphs.length; ++j) {
                lastLine = printCommentBody(x+offset+70, lastLine, reply.paragraphs[j], ctx);
                files.push(await save(canvas));
            }

        }

        return files;
    }

};
