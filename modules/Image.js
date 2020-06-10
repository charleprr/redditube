/**
 * @name Redditube
 * @version 1.0.0
 * 
 * From posts and comments on Reddit
 * to a video uploaded on Youtube!
 * 
 * @copyright (C) 2020 by Charly Poirier
*/
const fs = require(`fs`);
const { loadImage, registerFont, createCanvas } = require(`canvas`);

let kFormatter = num => Math.abs(num) > 999 ? `${Math.sign(num)*((Math.abs(num)/1000).toFixed(1))}k` : Math.sign(num)*Math.abs(num);
let wrapText = (context, text, x, y, maxWidth, lineHeight) => {
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

function generateThumbnail(subreddit, post) {
    return new Promise (resolve => resolve());
}

async function generatePostImage(post) {

    const filepath = `./tmp/${post.id}.png`;
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext(`2d`);

    ctx.fillStyle = `#1B191D`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const x = 400;
    const y = 350;
    const author = `Posted by u/${post.author}`;
    const points = kFormatter(post.ups);
    const title = post.title;

    ctx.drawImage(arrowUp, x, y, 32, 36);
    ctx.font = `32px IBMPlexSans Medium`;
    ctx.fillStyle = `#D7DADC`;
    ctx.fillText(points, x + 16 - (ctx.measureText(points).width/2), y + 79);
    ctx.drawImage(arrowDown, x, y + 100, 32, 36);
    
    ctx.font = `24px IBMPlexSans Regular`;
    ctx.fillStyle = `#818384`;
    wrapText(ctx, author, x + 92, y + 17, 1000, 48);
    
    let icon;
    for (let i=0; i<post.awards.length; ++i) {
        icon = await loadImage(post.awards[i].url);
        ctx.drawImage(icon, x + ctx.measureText(author).width + i*40 + 102, y - 5, 30, 30);
    }
    
    ctx.font = `52px IBMPlexSans Medium`;
    ctx.fillStyle = `#D7DADC`;
    wrapText(ctx, title, x + 92, y + 80, 850, 58);

    return new Promise(resolve => {
        const out = fs.createWriteStream(filepath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on(`finish`, () => resolve());
    });
}

async function generateCommentImage(comment) {

    const filepath = `./tmp/${comment.id}.png`;
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext(`2d`);

    ctx.fillStyle = `#1B191D`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const x = 200;
    const y = 145;
    const author = comment.author;
    const points = `${kFormatter(comment.ups)} points`;
    const body = comment.body;

    ctx.drawImage(arrowUp, x, y, 32, 36);
    ctx.drawImage(arrowDown, x, y + 50, 32, 36);

    ctx.font = `24px IBMPlexSans Regular`;
    ctx.fillStyle = `#D7DADC`;
    ctx.fillText(author, x + 70, y + 20);
    
    ctx.font = `24px IBMPlexSans Regular`;
    ctx.fillStyle = `#818384`;
    ctx.fillText(points, x + 79 + ctx.measureText(author).width, y + 20);
    
    let icon;
    for (let i=0; i<comment.awards.length; ++i) {
        icon = await loadImage(comment.awards[i].url);
        ctx.drawImage(icon, x + ctx.measureText(author).width + ctx.measureText(points).width + i*40 + 90, y - 5, 30, 30);
    }
    
    ctx.font = `30px Noto Sans`;
    ctx.fillStyle = `#D7DADC`;
    wrapText(ctx, body, x + 70, y + 72, 1300, 40);

    return new Promise(resolve => {
        const out = fs.createWriteStream(filepath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on(`finish`, () => resolve());
    });
}

let arrowUp, arrowDown;

module.exports = {
    generate: (post, comments, subreddit) => {
        return new Promise(async resolve => {

            // Load resources
            arrowUp = await loadImage(`./resources/images/arrowUp.png`);
            arrowDown = await loadImage(`./resources/images/arrowDown.png`);
            registerFont(`./resources/fonts/IBMPlexSans-Medium.ttf`, {family: `IBMPlexSans Medium`});
            registerFont(`./resources/fonts/IBMPlexSans-Regular.ttf`, {family: `IBMPlexSans Regular`});
            registerFont(`./resources/fonts/NotoSans-Regular.ttf`, {family: `Noto Sans`});
            
            // Generate images
            console.log(`Generating images`);
            await Promise.all([
                generateThumbnail(subreddit, post),
                generatePostImage(post),
                comments.map(comment => generateCommentImage(comment))
            ]);

            // Resolve
            resolve();

        });
    }
};
