let canvasSnake = document.getElementById('canvassn');
let ctxSnake = canvasSnake.getContext('2d');
let rows = 20;
let cols = 20;
let snake = [{
    x: 19,
    y: 3
}];

let food;
let foodImage = new Image();
foodImage.src = 'apfel.png';
let snakeHeadImage = new Image();
snakeHeadImage.src = 'head.png';

let cellWidth = canvasSnake.width / cols;
let cellHeight = canvasSnake.height / rows;
let direction = 'LEFT';
let foodCollected = false;
let score = 0;
let time = 0;
let highScore = 0;
let gamePaused = false;

placeFood();

let gameInterval = setInterval(gameLoop, 200);
document.addEventListener('keydown', keyDown);

draw();
function draw() {
    ctxSnake.fillStyle = '#5a5a5a';
    ctxSnake.fillRect(0, 0, canvasSnake.width, canvasSnake.height);
    ctxSnake.fillStyle = 'rgb(91, 123, 249)';

    ctxSnake.save();
    ctxSnake.translate(snake[0].x * cellWidth + cellWidth / 2, snake[0].y * cellHeight + cellHeight / 2);
    if (direction === 'UP') {
        ctxSnake.rotate(0);
    } else if (direction === 'DOWN') {
        ctxSnake.rotate(Math.PI);
    } else if (direction === 'LEFT') {
        ctxSnake.rotate(-Math.PI / 2);
    } else if (direction === 'RIGHT') {
        ctxSnake.rotate(Math.PI / 2);
    }
    ctxSnake.drawImage(snakeHeadImage, -cellWidth / 2, -cellHeight / 2, cellWidth - 1, cellHeight - 1);
    ctxSnake.restore();
    
    snake.slice(1).forEach(part => add(part.x, part.y));

    ctxSnake.drawImage(foodImage, food.x * cellWidth, food.y * cellHeight, cellWidth - 1, cellHeight - 1);
    requestAnimationFrame(draw);
}

function testGameOver() {
    let firstPart = snake[0];
    let otherParts = snake.slice(1);
    let duplicatePart = otherParts.find(part => part.x == firstPart.x && part.y == firstPart.y);

    if (snake[0].x < 0 ||
        snake[0].x > cols - 1 ||
        snake[0].y < 0 ||
        snake[0].y > rows - 1 ||
        duplicatePart
    ) {
        placeFood();
        snake = [{
            x: 19,
            y: 3
        }];
        direction = 'LEFT';
        score = 0;
        time = 0;
    }
}

function placeFood() {
    let randomX = Math.floor(Math.random() * cols);
    let randomY = Math.floor(Math.random() * rows);

    food = {
        x: randomX,
        y: randomY
    };
}

function add(x, y) {
    ctxSnake.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1);
}

function shiftSnake() {
    for (let i = snake.length - 1; i > 0; i--) {
        const part = snake[i];
        const lastPart = snake[i - 1];
        part.x = lastPart.x;
        part.y = lastPart.y;
    }
}

function gameLoop() {
    if (gamePaused) return;
    testGameOver();
    if (foodCollected) {
        snake = [{
            x: snake[0].x,
            y: snake[0].y
        }, ...snake];

        foodCollected = false;
    }

    shiftSnake();

    if (direction == 'LEFT') {
        snake[0].x--;
    }

    if (direction == 'RIGHT') {
        snake[0].x++;
    }

    if (direction == 'UP') {
        snake[0].y--;
    }

    if (direction == 'DOWN') {
        snake[0].y++;
    }

    if (snake[0].x == food.x &&
        snake[0].y == food.y) {
        foodCollected = true;
        placeFood();
    }
}

function keyDown(e) {
    if (e.keyCode == 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    }
    if (e.keyCode == 38 && direction !== 'DOWN') {
        direction = 'UP';
    }
    if (e.keyCode == 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
    if (e.keyCode == 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}
