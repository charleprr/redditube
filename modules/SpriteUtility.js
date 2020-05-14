/**
 *
 */
const { createCanvas/*, loadImage*/ } = require('canvas');

let createPostSprite = (post) => {
    console.log(`Generating sprite ${post.id}.png`);
    return new Promise((resolve, reject) => {
        const canvas = createCanvas(1080, 720);
        resolve(canvas.toDataURL());
    });
}

let createCommentSprite = (comment) => {
    console.log(`Generating sprite ${comment.data.id}.png`);
    return new Promise((resolve, reject) => {
        const canvas = createCanvas(1080, 720);
        resolve(canvas.toDataURL());
    });
}

module.exports = {
    createPostSprite: createPostSprite,
    createCommentSprite: createCommentSprite
};