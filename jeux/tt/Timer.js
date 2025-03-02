// Timer
let timerInterval;
let secondsElapsed = 0;

function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        document.getElementById('timer').textContent = `Temps écoulé : ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}