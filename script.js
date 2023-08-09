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
const baseImageSize = 64;
const gravity = 0.2;

// wedding time: Aug 18, 2023 at 10:30 AM MST
const weddingTime = new Date("August 18, 2023 10:30:00").getTime();

const backgroundColor = "#ffffff";


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

class Heart {
    constructor(emoji) {
        this.x = width / 2 + Math.random() * 20 - 10;
        this.y = height / 2 + Math.random() * 20 - 10;
        this.size = baseImageSize + Math.random() * 10 - 5;
        this.image = emoji.image;

        this.vx = Math.random() * 20 - 10;
        this.vy = Math.random() * -10 - 5;
    }

    update() {
        this.vy += gravity;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        let x = this.x;
        let y = this.y;
        let size = this.size;
        ctx.drawImage(this.image, x, y, size, size);
    }

    isOutOfScreen() {
        return this.x + this.size < 0 || this.x - this.size > width || this.y - this.size > height;
    }
}

function draw() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    miniHearts.forEach((heart) => {
        heart.draw();
    });

    ctx.fillStyle = "#000000";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";

    // print time until wedding in the format of "X days, Y hours, Z minutes, A seconds" in the center of the screen
    const time = new Date().getTime();
    const timeDiff = weddingTime - time;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    const lineHeight = 70;
    ctx.fillText(days + " days, " + hours + " hours", centerX, centerY + lineHeight * -1);
    ctx.fillText(minutes + " minutes, " + seconds + " seconds", centerX, centerY + lineHeight);
}

let timeSinceLastHeart = 0;
let lastFrameTime = new Date().getTime();
function update() {
    const time = new Date().getTime();
    const timeDiff = weddingTime - time;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    const heartsPerSecond = 10 - days;
    const timeBetweenHearts = 1000 / heartsPerSecond;

    const deltaTime = time - lastFrameTime;
    timeSinceLastHeart += deltaTime;
    if (timeSinceLastHeart > timeBetweenHearts) {
        timeSinceLastHeart = 0;
        let emoji = miniHeartEmojis[Math.floor(Math.random() * miniHeartEmojis.length)];
        miniHearts.push(new Heart(emoji));
    }

    lastFrameTime = time;

    miniHearts.forEach((heart) => {
        heart.update();
    });

    miniHearts = miniHearts.filter((heart) => {
        return !heart.isOutOfScreen();
    });
}


function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();

canvas.addEventListener("click", function (e) {
    let x = e.pageX;
    let y = e.pageY;

    let emoji = miniHeartEmojis[Math.floor(Math.random() * miniHeartEmojis.length)];
    let heart = new Heart(emoji);
    heart.x = x - heart.size / 2;
    heart.y = y - heart.size / 2;
    miniHearts.push(heart);

    e.preventDefault();

    return false;
});