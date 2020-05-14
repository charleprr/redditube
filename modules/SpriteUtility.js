/**
 * 
 */
const { createCanvas, registerFont, loadImage } = require('canvas');
const fs = require('fs');


registerFont('./fonts/IBMPlexSans-Medium.ttf', {family: 'IBMPlexSans Medium'});
registerFont('./fonts/IBMPlexSans-Regular.ttf', {family: 'IBMPlexSans Regular'});

let wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    let words = text.split(' ');
    let line = '';
    for(let n = 0; n < words.length; ++n) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else line = testLine;
    }
    ctx.fillText(line, x, y);
}

let kFormatter = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num);
}

let createPostSprite = (post) => {
    let filepath = `./media/sprites/${post.id}.png`;
    console.log(`Generating ${filepath}`);
    return new Promise(async (resolve, reject) => {
        const canvas = createCanvas(1920, 1080);
        const ctx = canvas.getContext("2d");

        // Background
        ctx.fillStyle = '#1B191D';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Upvotes
        ctx.font = '32px IBMPlexSans Medium';
        ctx.fillStyle = '#D7DADC';
        let upvotes = kFormatter(post.ups);
        let textWidth = ctx.measureText(upvotes).width;
        ctx.fillText(upvotes , (canvas.width/2) - (textWidth / 2) - 526, 402);
        const up = await loadImage('./media/up.png');
        ctx.drawImage(up, 418, 323, 32, 36);
        const down = await loadImage('./media/down.png');
        ctx.drawImage(down, 418, 423, 32, 36);

        // Author
        ctx.font = '24px IBMPlexSans Regular';
        ctx.fillStyle = '#818384';
        wrapText(ctx, `Posted by u/${post.author}`, (canvas.width-900)/2, 340, 1000, 48);

        // Title
        ctx.font = '48px IBMPlexSans Medium';
        ctx.fillStyle = '#D7DADC';
        wrapText(ctx, post.title, (canvas.width-900)/2, 400, 1000, 58);

        // Saving as a PNG file
        const out = fs.createWriteStream(filepath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () =>  resolve(filepath));
    });
}

let createCommentSprite = (comment) => {
    let filepath = `./media/sprites/${comment.data.id}.png`;
    console.log(`Generating ${filepath}`);
    return new Promise((resolve, reject) => {
        const canvas = createCanvas(1920, 1080);
        const ctx = canvas.getContext("2d");

        // Saving as a PNG file
        const out = fs.createWriteStream(filepath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () =>  resolve(filepath));
    });
}

module.exports = {
    createPostSprite: createPostSprite,
    createCommentSprite: createCommentSprite
};