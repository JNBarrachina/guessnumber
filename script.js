// --- Elementos del DOM ---
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const message = document.getElementById('message');
const attemptsNumbers = document.getElementById('attemptsNumbers');
const attemptsInfo = document.getElementById('attempts');
const playAgainButton = document.getElementById('playAgainButton');
const selectDifficulty = document.getElementById("selectDiff");
selectDifficulty.addEventListener("change", () => getDifficulty());
const difficultyText = document.getElementById("thinkNum");
const scoreText = document.getElementById("score");

// --- Variables del Juego ---
let secretNumber;
let attempts;
let attemptsNums = [];
let MAX_NUMBER;
const MIN_NUMBER = 1;
let highScore;

// --- Funciones ---

//Seleccionar dificultad
function getDifficulty(){
    scoreText.innerText = `HighScore: ${localStorage.getItem("highscore")} intentos`;

    switch (selectDifficulty.value) {
        case "value1":
            MAX_NUMBER = 50;
            difficultyText.innerText = `He pensado en un número entre 1 y ${MAX_NUMBER}. ¿Puedes adivinar cuál es?`;
            startGame();
            break;
        case "value2":
            MAX_NUMBER = 100;
            difficultyText.innerText = `He pensado en un número entre 1 y ${MAX_NUMBER}. ¿Puedes adivinar cuál es?`;
            startGame();
            break;
        case "value3":
            MAX_NUMBER = 200;
            difficultyText.innerText = `He pensado en un número entre 1 y ${MAX_NUMBER}. ¿Puedes adivinar cuál es?`;
            startGame();
            break;
        case "value4":
            MAX_NUMBER = 500;
            difficultyText.innerText = `He pensado en un número entre 1 y ${MAX_NUMBER}. ¿Puedes adivinar cuál es?`;
            startGame();
            break;
    }
}

// Función para iniciar o reiniciar el juego
function startGame() {
    attemptsNumbers.innerText = "";
    attemptsNums = [];

    // Genera un número secreto entre MIN_NUMBER y MAX_NUMBER
    secretNumber = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    attempts = 0; // Reinicia los intentos

    // Mensajes iniciales y estado de la UI
    message.textContent = '';
    message.className = 'message'; // Quita clases de color
    attemptsInfo.textContent = '';
    guessInput.value = ''; // Limpia el input
    guessInput.disabled = false; // Habilita el input
    guessButton.disabled = false; // Habilita el botón de adivinar
    playAgainButton.style.display = 'none'; // Oculta el botón de jugar de nuevo
    guessInput.focus(); // Pone el foco en el input
}

// Función para manejar el intento del usuario
function handleGuess() {
    const userGuessText = guessInput.value;

    // Validar si la entrada está vacía
    if (userGuessText === '') {
        setMessage('Por favor, introduce un número.', 'info');
        return;
    }

    const userGuess = parseInt(userGuessText);

    // Validar si la entrada es un número válido y está en el rango
    if (isNaN(userGuess) || userGuess < MIN_NUMBER || userGuess > MAX_NUMBER) {
        setMessage(`Introduce un número válido entre ${MIN_NUMBER} y ${MAX_NUMBER}.`, 'info');
        guessInput.value = ''; // Limpiar el input inválido
        guessInput.focus();
        return;
    }

    // Incrementar el contador de intentos
    attemptsNums.push(userGuess);

    let stringNums = "";
    attemptsNums.forEach(num => {
        stringNums += "(" + num + ")" + " ";
    });

    attemptsNumbers.innerText = `Números probados: ${stringNums}`;
    attempts++;
    attemptsInfo.textContent = `Intentos: ${attempts}/10`;

    // Comparar el intento con el número secreto
    if (userGuess === secretNumber) {
        checkHighScore();
        endGame();
    } else if (userGuess < secretNumber) {
        if (attemptsNums.length == 10){
            setMessage(`HAS AGOTADO LOS INTENTOS. HAS PERDIDO. El número secreto era el ${secretNumber}`, 'wrong');
            attemptsInfo.style.color = "red";
            endGame();
        }
        else{
            setMessage('¡Demasiado bajo! Intenta un número más alto. 👇', 'wrong');
        }
    } else {
        if (attemptsNums.length == 10){
            setMessage(`HAS AGOTADO LOS INTENTOS. HAS PERDIDO. El número secreto era el ${secretNumber}`, 'wrong');
            attemptsInfo.style.color = "red";
            endGame();
        }
        else{
            setMessage('¡Demasiado alto! Intenta un número más bajo. 👇', 'wrong');
        }
    }

    // Limpiar el input para el siguiente intento (si no ha ganado)
    if (userGuess !== secretNumber) {
        guessInput.value = '';
        guessInput.focus();
    }
}

// Función para mostrar mensajes al usuario
function setMessage(msg, type) {
    message.textContent = msg;
    message.className = `message ${type}`; // Añade clase para el color (correct, wrong, info)
}

// Función para terminar el juego (cuando se adivina el número)
function endGame() {
    guessInput.disabled = true; // Deshabilita el input
    guessButton.disabled = true; // Deshabilita el botón de adivinar
    playAgainButton.style.display = 'inline-block'; // Muestra el botón de jugar de nuevo
}

//Chequear la HighScore en el localStorage
function checkHighScore(){
    if (localStorage.getItem("highscore") > attempts){
        localStorage.setItem("highscore", attempts);

        setMessage(`¡Correcto! 🎉 El número era ${secretNumber}. Lo adivinaste en ${attempts} intentos. Nuevo HIGH SCORE!!!`, 'correct');

        scoreText.innerText = `HighScore: ${localStorage.getItem("highscore")} intentos`;
        scoreText.style.color = "green"
    }
    else{
        setMessage(`¡Correcto! 🎉 El número era ${secretNumber}. Lo adivinaste en ${attempts} intentos.`, 'correct');
    }
}

// --- Event Listeners ---

// Escuchar clics en el botón "Adivinar"
guessButton.addEventListener('click', handleGuess);

// Escuchar la tecla "Enter" en el campo de entrada
guessInput.addEventListener('keyup', function(event) {
    // Si la tecla presionada es Enter (código 13)
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita comportamiento por defecto (si estuviera en un form)
        handleGuess(); // Llama a la función de adivinar
    }
});

// Escuchar clics en el botón "Jugar de Nuevo"
playAgainButton.addEventListener('click', startGame);

// --- Iniciar el juego al cargar la página ---
getDifficulty();