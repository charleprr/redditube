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

const kFormatter = num => Math.abs(num) > 999 ? `${Math.sign(num)*((Math.abs(num)/1000).toFixed(1))}k` : Math.sign(num)*Math.abs(num);
const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    text = text.split(`\n`);
    for (const paragraph of text) {
        const words = paragraph.split(` `);
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

const postImage = async post => {
    console.log(` -> tmp/${post.id}.png`);

    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext(`2d`);

    ctx.fillStyle = `#1B191D`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const x = 420;
    const y = 540;
    const author = `Posted by u/${post.author}`;
    const points = kFormatter(post.ups);
    const title = post.title;
    const awards = post.awards;
    
    ctx.drawImage(sticker, 832, y - 320, 256, 256);

    ctx.drawImage(arrowUp, x, y, 32, 36);
    ctx.font = `32px IBMPlexSans Medium`;
    ctx.fillStyle = `#D7DADC`;
    ctx.fillText(points, x + 16 - (ctx.measureText(points).width/2), y + 79);
    ctx.drawImage(arrowDown, x, y + 100, 32, 36);
    
    ctx.font = `24px IBMPlexSans Regular`;
    ctx.fillStyle = `#818384`;
    wrapText(ctx, author, x + 92, y + 17, 1000, 48);
    
    let icon;
    for (let i=0; i<awards.length; ++i) {
        icon = await loadImage(awards[i].url);
        ctx.drawImage(icon, x + ctx.measureText(author).width + i*40 + 102, y - 5, 30, 30);
    }
    
    ctx.font = `52px IBMPlexSans Medium`;
    ctx.fillStyle = `#D7DADC`;
    wrapText(ctx, title, x + 92, y + 80, 850, 58);

    return new Promise(resolve => {
        const out = fs.createWriteStream(`tmp/${post.id}.png`);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on(`finish`, () => resolve());
    });
}

const commentImages = async comment => {

    let x = 180;
    let y = 145;
    let author = comment.author;
    let points = `${kFormatter(comment.ups)} points`;
    let awards = comment.awards;
    let paragraphs = comment.paragraphs;
    const reply = comment.reply;

    let icon, end;
    const promises = [];
    const iterations = paragraphs.length + (reply ? reply.paragraphs.length : 0);

    for (let i=0; i<iterations; ++i) {

        console.log(` -> tmp/${comment.id}-${i}.png`);

        const canvas = createCanvas(1920, 1080);
        const ctx = canvas.getContext(`2d`);

        ctx.fillStyle = `#1B191D`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(arrowUp, x, y, 32, 36);
        ctx.drawImage(arrowDown, x, y + 50, 32, 36);

        ctx.font = `24px IBMPlexSans Regular`;
        ctx.fillStyle = `#D7DADC`;
        const wAuthor = ctx.measureText(author).width;
        ctx.fillText(author, x + 70, y + 20);
        
        ctx.font = `24px IBMPlexSans Regular`;
        ctx.fillStyle = `#818384`;
        const wPoints = ctx.measureText(points).width;
        ctx.fillText(points, x + 79 + wAuthor, y + 20);
        
        for (let j=0; j<awards.length; ++j) {
            icon = await loadImage(awards[j].url);
            ctx.drawImage(icon, x + wAuthor + wPoints + j * 40 + 90, y - 5, 30, 30);
        }
        
        ctx.font = `30px Noto Sans`;
        ctx.fillStyle = `#D7DADC`;
        end = wrapText(ctx, paragraphs.slice(0, i + 1).join(`\n`), x + 70, y + 72, 1300, 40);

        if (i + 1 > paragraphs.length) {

            x = 240;
            y = end + 60;
            author = reply.author;
            points = `${kFormatter(reply.ups)} points`;
            awards = reply.awards;
            paragraphs = reply.paragraphs;
        
            ctx.drawImage(arrowUp, x, y, 32, 36);
            ctx.drawImage(arrowDown, x, y + 50, 32, 36);

            ctx.font = `24px IBMPlexSans Regular`;
            ctx.fillStyle = `#D7DADC`;
            const wAuthor = ctx.measureText(author).width;
            ctx.fillText(author, x + 70, y + 20);
            
            ctx.font = `24px IBMPlexSans Regular`;
            ctx.fillStyle = `#818384`;
            const wPoints = ctx.measureText(points).width;
            ctx.fillText(points, x + 79 + wAuthor, y + 20);
            
            for (let j=0; j<awards.length; ++j) {
                icon = await loadImage(awards[j].url);
                ctx.drawImage(icon, x + wAuthor + wPoints + j * 40 + 90, y - 5, 30, 30);
            }
            
            ctx.font = `30px Noto Sans`;
            ctx.fillStyle = `#D7DADC`;
            end = wrapText(ctx, paragraphs.slice(0, (i-comment.paragraphs.length) + 1).join(`\n`), x + 70, y + 72, 1240, 40);

        }

        promises.push(new Promise(resolve => {
            const out = fs.createWriteStream(`tmp/${comment.id}-${i}.png`);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            out.on(`finish`, () => resolve());
        }));

    }

    return Promise.all(promises);
}

let sticker, arrowUp, arrowDown;
registerFont(`resources/fonts/IBMPlexSans-Medium.ttf`, {family: `IBMPlexSans Medium`});
registerFont(`resources/fonts/IBMPlexSans-Regular.ttf`, {family: `IBMPlexSans Regular`});
registerFont(`resources/fonts/NotoSans-Regular.ttf`, {family: `Noto Sans`});

module.exports = {
    generate: (subreddit, post, comments) => {
        return new Promise(async resolve => {

            console.log(`Making image files`);
            
            sticker = await loadImage(`resources/images/askReddit.png`);
            arrowUp = await loadImage(`resources/images/arrowUp.png`);
            arrowDown = await loadImage(`resources/images/arrowDown.png`);

            await postImage(post);
            
            for (const comment of comments) {
                await commentImages(comment);
            }

            resolve();

        });
    }
};
