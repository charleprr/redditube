/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const { loadImage, registerFont, createCanvas } = require(`canvas`);
const fs = require(`fs`);

function kFormatter(num) {
    return Math.abs(num) > 999
    ? `${Math.sign(num)*((Math.abs(num)/1000).toFixed(1))}k`
    : Math.sign(num)*Math.abs(num);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    text = text.split(`\n`);
    for (let paragraph of text) {
        let words = paragraph.split(` `);
        let line = ``;
        for (let word of words) {
            line = line + word + ` `;
            if (context.measureText(line).width > maxWidth) {
                context.fillText(line, x, y);
                y += lineHeight;
                line = ``;
            }
        }
        context.fillText(line, x, y);
        y += lineHeight;
    }
    return y - lineHeight;
}

function generatePostImage(post) {
    let filepath = `./temporary/${post.id}.png`;
    console.log(`Generating ${filepath}`);

    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext(`2d`);

    // Background
    ctx.fillStyle = `#1B191D`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Upvotes
    ctx.font = `32px IBMPlexSans Medium`;
    ctx.fillStyle = `#D7DADC`;
    let upvotes = kFormatter(post.ups);
    let textWidth = ctx.measureText(upvotes).width;
    ctx.fillText(upvotes, (canvas.width/2) - (textWidth/2) - 526, 402);
    ctx.drawImage(arrowUp, 418, 323, 32, 36);
    ctx.drawImage(arrowDown, 418, 423, 32, 36);

    // Author
    ctx.font = `24px IBMPlexSans Regular`;
    ctx.fillStyle = `#818384`;
    wrapText(ctx, `Posted by u/${post.author}`, (canvas.width-900)/2, 340, 1000, 48);

    // Title
    ctx.font = `48px IBMPlexSans Medium`;
    ctx.fillStyle = `#D7DADC`;
    wrapText(ctx, post.title, (canvas.width-900)/2, 400, 850, 58);

    return new Promise(resolve => {
        const out = fs.createWriteStream(filepath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on(`finish`, () => resolve());
    });
}

function generateCommentImage(comment) {
    let filepath = `./temporary/${comment.id}.png`;
    console.log(`Generating ${filepath}`);
    
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext(`2d`);
    
    // Background
    ctx.fillStyle = `#1B191D`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Upvote arrows
    ctx.drawImage(arrowUp, 200, 143, 32, 36);
    ctx.drawImage(arrowDown, 200, 193, 32, 36);

    // Author
    ctx.font = `24px IBMPlexSans Regular`;
    ctx.fillStyle = `#D7DADC`;
    let author = comment.author;
    ctx.fillText(author, 270, 163);

    // Points
    ctx.font = `24px IBMPlexSans Regular`;
    ctx.fillStyle = `#818384`;
    let upvotes = `${kFormatter(comment.ups)} points`;
    ctx.fillText(upvotes, 277 + ctx.measureText(author).width, 163);

    // Comment
    ctx.font = `30px Noto Sans`;
    ctx.fillStyle = `#D7DADC`;
    wrapText(ctx, comment.body, 270, 215, 1300, 40);

    return new Promise(resolve => {
        const out = fs.createWriteStream(filepath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on(`finish`, () => resolve());
    });
}

let arrowUp, arrowDown;

module.exports = {
    generate: (post, comments) => {
        return new Promise(async resolve => {

            // Load resources
            arrowUp = await loadImage(`./resources/arrowUp.png`);
            arrowDown = await loadImage(`./resources/arrowDown.png`);
            registerFont(`./resources/IBMPlexSans-Medium.ttf`, {family: `IBMPlexSans Medium`});
            registerFont(`./resources/IBMPlexSans-Regular.ttf`, {family: `IBMPlexSans Regular`});
            registerFont(`./resources/NotoSans-Regular.ttf`, {family: `Noto Sans`});
            
            // Generate images
            await generatePostImage(post);
            for (let comment of comments) await generateCommentImage(comment);
            
            // Resolve
            resolve();

        });
    }
};
