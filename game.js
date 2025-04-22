const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Configurazioni
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let snake = [{ x: 5, y: 5 }];
let food = generateFood();
let dx = 1, dy = 0;
let score = 0;

function generateFood() {
    return {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
    };
}

function update() {
    // Movimento serpente
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Controllo cibo
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        food = generateFood();
    } else {
        snake.pop();
    }

    // Controllo collisioni
    if (isGameOver(head)) {
        resetGame();
    }
}

function draw() {
    // Sfondo
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Serpente
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * GRID_SIZE,
            segment.y * GRID_SIZE,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
    });

    // Cibo
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(
        food.x * GRID_SIZE,
        food.y * GRID_SIZE,
        GRID_SIZE - 2,
        GRID_SIZE - 2
    );
}

function isGameOver(head) {
    return head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE ||
           head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE ||
           snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function resetGame() {
    alert(`Game Over! Score: ${score}`);
    snake = [{ x: 5, y: 5 }];
    food = generateFood();
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
}

// Gestione input
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; } break;
        case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; } break;
        case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; } break;
        case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; } break;
    }
});

// Game loop
function gameLoop() {
    update();
    draw();
    setTimeout(() => requestAnimationFrame(gameLoop), 100);
}

// Avvio gioco
requestAnimationFrame(gameLoop);