class Emoji {
    constructor(src) {
        this.src = src;
        this.loaded = false;
        this.image = new Image();
        this.image.src = src;
        this.image.onload = () => {
            this.loaded = true;
        };
    }
}

let size = 1;
const baseSize = 1;
const baseImageSize = 64;
const limit = 60;

const increaseRate = 1;
let decreaseRate = 0.01;
const baseDecreaseRate = decreaseRate;
const decreaseAcceleration = 1.01;

let finished = false;

const backgroundColor = "#ffffff";


const messages = {
    0: "click me!",
    2: "keep clicking!",
    10: "faster!",
    20: "almost there!",
    30: "just kidding ;)",
    40: "ok now you're almost there :)",
    50: "just a little bit more",
}

function getMessage(size) {
    let index = Math.floor(size);
    while (!(index in messages)) {
        index--;
    }
    return messages[index];
}

// initialize canvas
let canvas = document.getElementById("canvas");
// set canvas size to window size
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let centerX = width / 2;
let centerY = height / 2;
let ctx = canvas.getContext("2d");

let heart = new Emoji("images/heart.png");

let kiss = new Emoji("images/kiss-mark.png");
let kiss2 = new Emoji("images/face-blowing-a-kiss.png");
let smile = new Emoji("images/smiling-face-with-heart-eyes.png");
let smile2 = new Emoji("images/smiling-face-with-hearts.png");
let miniHeartEmojis = [heart, kiss, kiss2, smile, smile2];

let miniHearts = [];

function draw() {
    if (finished) {
        doFinishedDraw();
    } else {
        doHeartDraw();
    }
}

function doHeartDraw(){
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    drawHeart(size);
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(getMessage(size), centerX, centerY);

    // display size for debugging
    // ctx.font = "30px Arial";
    // ctx.textAlign = "left";
    // ctx.fillText(size, 10, 50);
}

function drawHeart(size) {
    let imageSize = baseImageSize * size;
    let x = centerX - imageSize / 2;
    let y = centerY - imageSize / 2;
    ctx.drawImage(heart.image, x, y, imageSize, imageSize);
}

function doFinishedDraw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("happy national girlfriend day!", centerX, centerY);
    
    drawMiniHearts();
}

function update() {
    if (finished) {
        doFinishedUpdate();
    } else {
        doHeartUpdate();
    }
}

function doFinishedUpdate() {
    // update mini heart velocities based on gravity
    for (let i = 0; i < miniHearts.length; i++) {
        let miniHeart = miniHearts[i];
        miniHeart.vy += 0.1;
    }

    // update mini heart positions
    for (let i = 0; i < miniHearts.length; i++) {
        let miniHeart = miniHearts[i];
        miniHeart.x += miniHeart.vx;
        miniHeart.y += miniHeart.vy;
    }

    // check if mini hearts are out of bounds
    for (let i = 0; i < miniHearts.length; i++) {
        let miniHeart = miniHearts[i];
        if (miniHeart.x + baseImageSize < 0 || miniHeart.x - baseImageSize > width || miniHeart.y - baseImageSize > height) {
            miniHearts.splice(i, 1);
            i--;
        }
    }

    // check if all mini hearts are gone
    if (miniHearts.length == 0) {
        finished = false;
        size = 1;
        decreaseRate = baseDecreaseRate;
    }
}

function drawMiniHearts() {
    for (let i = 0; i < miniHearts.length; i++) {
        let miniHeart = miniHearts[i];
        let x = miniHeart.x;
        let y = miniHeart.y;
        let size = miniHeart.size;
        let imageSize = baseImageSize * size;
        let image = miniHeart.image;
        ctx.drawImage(image, x, y, imageSize, imageSize);
    }
}

function doHeartUpdate() {
    if (size > limit) {
        finish();
    }
    if (size > baseSize) {
        size -= decreaseRate;
        decreaseRate *= decreaseAcceleration;
    } else {
        size = baseSize;
    }
}

function finish() {
    finished = true;
    spawnMiniHearts(heart, 100);
    spawnMiniHearts(kiss, 5);
    spawnMiniHearts(kiss2, 5);
    spawnMiniHearts(smile, 5);
    spawnMiniHearts(smile2, 5);
    console.log("finished")
}

function spawnMiniHearts(emoji, number) {
    for (let i = 0; i < number; i++) {
        let x = width / 2 + Math.random() * 20 - 10;
        let y = height / 2 + Math.random() * 20 - 10;
        let angle = Math.random() * Math.PI;
        let speed = Math.random() * 15 + 1;
        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * -speed;
        let size = Math.random() * 0.5 + 0.5;
        miniHearts.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            size: size,
            image: emoji.image
        });
    }
}
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();

canvas.addEventListener("click", function (e) {
    size += increaseRate;
    decreaseRate = baseDecreaseRate;
});