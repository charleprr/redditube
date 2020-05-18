const { createCanvas, registerFont, loadImage } = require('canvas');
const fs = require('fs');

registerFont('./resources/IBMPlexSans-Medium.ttf', {family: 'IBMPlexSans Medium'});
registerFont('./resources/IBMPlexSans-Regular.ttf', {family: 'IBMPlexSans Regular'});
registerFont('./resources/NotoSans-Regular.ttf', {family: 'Noto Sans'});

let wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    text = text.split("\n");
    for (let paragraph of text) {
        let words = paragraph.split(" ");
        let line = "";
        for (let word of words) {
            line = line + word + " ";
            if (ctx.measureText(line).width > maxWidth) {
                ctx.fillText(line, x, y);
                y += lineHeight;
                line = "";
            }
        }
        ctx.fillText(line, x, y);
        y += lineHeight;
    }
    return y;
}

let kFormatter = (num) => {
    return Math.abs(num) > 999
    ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k'
    : Math.sign(num)*Math.abs(num);
}

let generatePostImage = (post, path) => {
    let filepath = `${path}/${post.id}.png`;
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
        const up = await loadImage('./resources/up.png');
        const down = await loadImage('./resources/down.png');
        ctx.drawImage(up, 418, 323, 32, 36);
        ctx.drawImage(down, 418, 423, 32, 36);

        // Author
        ctx.font = '24px IBMPlexSans Regular';
        ctx.fillStyle = '#818384';
        wrapText(ctx, `Posted by u/${post.author}`, (canvas.width-900)/2, 340, 1000, 48);

        // Title
        ctx.font = '48px IBMPlexSans Medium';
        ctx.fillStyle = '#D7DADC';
        wrapText(ctx, post.title, (canvas.width-900)/2, 400, 850, 58);

        // Saving as a PNG file
        const out = fs.createWriteStream(filepath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () =>  resolve(filepath));
    });
}

let generateCommentImage = (comment, path) => {
    let filepath = `${path}/${comment.id}.png`;
    console.log(`Generating ${filepath}`);
    return new Promise(async (resolve, reject) => {
        const canvas = createCanvas(1920, 1080);
        const ctx = canvas.getContext("2d");
        
        // Background
        ctx.fillStyle = '#1B191D';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Upvote arrows
        const up = await loadImage('./resources/up.png');
        const down = await loadImage('./resources/down.png');
        ctx.drawImage(up, 200, 143, 32, 36);
        ctx.drawImage(down, 200, 193, 32, 36);

        // Author
        ctx.font = '24px IBMPlexSans Regular';
        ctx.fillStyle = '#D7DADC';
        let author = comment.author;
        ctx.fillText(author, 270, 163);

        // Points
        ctx.font = '24px IBMPlexSans Regular';
        ctx.fillStyle = '#818384';
        let upvotes = `${kFormatter(comment.ups)} points`;
        ctx.fillText(upvotes, 277 + ctx.measureText(author).width, 163);

        // Comment
        ctx.font = '30px Noto Sans';
        ctx.fillStyle = '#D7DADC';
        wrapText(ctx, comment.body, 270, 215, 1300, 40);

        // Saving as a PNG file
        const out = fs.createWriteStream(filepath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () =>  resolve(filepath));
    });
}

module.exports = {
    generate: (post, comments) => {
        return new Promise(async resolve => {
            await generatePostImage(post);
            for (let comment of comments) await generateCommentImage(comment);
            resolve();
        });
    }
};
