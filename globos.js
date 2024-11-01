const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverDiv = document.getElementById("gameOver");
const finalScoreSpan = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");

canvas.width = 850;
canvas.height = 500;

class Globo {
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.speedY = Math.random() * 1 + 1; // Velocidad hacia abajo
        this.speedX = Math.random() * 2 - 1; // Movimiento lateral aleatorio
        this.clicked = false; // Indica si el globo fue clickeado
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.ellipse(this.x, this.y, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (!this.clicked) {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.x < this.size || this.x > canvas.width - this.size) {
                this.speedX *= -1;
            }
        } else {
            this.y -= 3; // Impulso hacia arriba al hacer clic
        }
    }

    isClicked(mouseX, mouseY) {
        const dist = Math.hypot(mouseX - this.x, mouseY - this.y);
        return dist < this.size;
    }

    boost() {
        this.clicked = true;
        setTimeout(() => this.clicked = false, 500); // El globo vuelve a caer después de 0.5 segundos
    }
}

const colores = ["red", "blue", "green", "yellow", "purple", "pink", "black"];
let globos = [];
let score = 0;
let gameOver = false;

function generarGlobos(num) {
    globos = [];
    for (let i = 0; i < num; i++) {
        const size = Math.random() * 20 + 30;
        const x = Math.random() * canvas.width;
        const y = -size; // Aparecen en la parte superior del canvas
        const color = colores[Math.floor(Math.random() * colores.length)];
        globos.push(new Globo(x, y, color, size));
    }
}

canvas.addEventListener("click", (event) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    globos.forEach((globo) => {
        if (globo.isClicked(mouseX, mouseY)) {
            globo.boost();
            score += 10; // Incrementar la puntuación
        }
    });
});

function checkGameOver() {
    return globos.every(globo => globo.y > canvas.height + globo.size); // Todos los globos están fuera de la pantalla
}

function endGame() {
    gameOver = true;
    finalScoreSpan.textContent = score;
    gameOverDiv.classList.remove("d-none");
}

function resetGame() {
    score = 0;
    gameOver = false;
    gameOverDiv.classList.add("d-none");
    generarGlobos(5);
    animate();
}

restartButton.addEventListener("click", resetGame);

function animate() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    globos.forEach((globo, index) => {
        globo.update();
        globo.draw();
        if (globo.y > canvas.height + globo.size) globos.splice(index, 1); // Eliminar globo si toca el suelo
    });

    if (checkGameOver()) {
        endGame();
    } else {
        requestAnimationFrame(animate);
    }
}

generarGlobos(5); // Inicia el juego con 5 globos
animate();
