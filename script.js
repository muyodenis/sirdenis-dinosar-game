const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const canvasWidth = 800;
const canvasHeight = 200;
const groundHeight = 150;

const dinoImage = new Image();
dinoImage.src = 'dino.png'; // Add a dinosaur sprite image

const obstacleImage = new Image();
obstacleImage.src = 'cactus.png'; // Add a cactus sprite image

const groundImage = new Image();
groundImage.src = 'ground.png'; // Add a ground image

const jumpSound = document.getElementById('jump-sound');
const scoreSound = document.getElementById('score-sound');
const gameOverSound = document.getElementById('game-over-sound');

let dino = {
    x: 50,
    y: groundHeight,
    width: 44,  // Adjusted to the size of the sprite
    height: 47, // Adjusted to the size of the sprite
    dy: 0,
    gravity: 1,
    jumpPower: -15,
    isJumping: false,
    draw() {
        ctx.drawImage(dinoImage, this.x, this.y, this.width, this.height);
    },
    update() {
        if (this.isJumping) {
            this.dy += this.gravity;
            this.y += this.dy;

            if (this.y > groundHeight) {
                this.y = groundHeight;
                this.dy = 0;
                this.isJumping = false;
            }
        }
        this.draw();
    }
};

let obstacles = [];
let frames = 0;
let score = 0;

function generateObstacle() {
    obstacles.push({
        x: canvasWidth,
        y: groundHeight,
        width: 25,  // Adjusted to the size of the sprite
        height: 50, // Adjusted to the size of the sprite
        draw() {
            ctx.drawImage(obstacleImage, this.x, this.y, this.width, this.height);
        },
        update() {
            this.x -= 5;
            this.draw();
        }
    });
}

function updateObstacles() {
    if (frames % 100 === 0) {
        generateObstacle();
    }
    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }

        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            gameOverSound.play();
            alert(`Game Over! Your score is ${score}`);
            obstacles = [];
            frames = 0;
            score = 0;
            scoreDisplay.textContent = `Score: ${score}`;
            dino.y = groundHeight;
        }
    });
}

function updateScore() {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    if (score % 100 === 0) {
        scoreSound.play();
    }
}

function gameLoop() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(groundImage, 0, groundHeight + 20, canvasWidth, canvasHeight - groundHeight - 20); // Draw the ground
    dino.update();
    updateObstacles();

    if (frames % 5 === 0) {
        updateScore();
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', event => {
    if (event.code === 'Space' && !dino.isJumping) {
        jumpSound.play();
        dino.dy = dino.jumpPower;
        dino.isJumping = true;
    }
});

gameLoop();
