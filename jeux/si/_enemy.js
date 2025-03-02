import { Sound } from './Sound.js';
import { Word } from './Word.js';
import { WordManager } from './WordManager.js';

export class EnemyManager {
    constructor(game) {
        this.game = game;
        this.enemies = [];
        this.wordList = [];
        this.wm = new WordManager();
        
        this.enemySpeed = 1; // Exemple : vitesse initiale
        this.sound = new Sound();
    }

    async init() {
        // Charge les mots de façon asynchrone
        this.wordList = await this.wm.loadWordsFromFile();
        

        console.log("Liste de mots :", this.wordList);
        if (!this.wordList) {
            console.warn("1. Aucun mot n'a été chargé.");
        }

        if (this.wordList.length === 0) {
            console.warn("2. Aucun mot n'a été chargé.");
        }
    }

    startSpawning() {
        this.spawnInterval = setInterval(() => this.spawnEnemy(), 2000);
    }

    spawnEnemy() {
        if (this.wordList.length === 0) {
            console.warn('Liste de mots vide. Aucun ennemi ne sera généré.');
            return;
        }

        
        const randomIndex = Math.floor(Math.random() * this.wordList.length);
        const { texte, article } = this.wordList[randomIndex];

        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.textContent = texte; // Utilise le mot réel
        enemy.style.left = `${Math.random() * 560}px`;
        enemy.style.top = '0px';

        // Ajout d'une classe spécifique au genre
        if (article === 'le') {
            enemy.classList.add('male');
        } else if (article === 'la') {
            enemy.classList.add('female');
        }

        document.getElementById('game-container').appendChild(enemy);
        this.enemies.push(enemy);
    }

    update() {
        this.enemies.forEach((enemy, index) => {
            const top = parseInt(enemy.style.top);
            enemy.style.top = `${top + this.enemySpeed}px`;

            if (top > 400) {
                enemy.remove();
                this.enemies.splice(index, 1);
                this.game.updateScore(-5);
            }
        });
    }

    increaseDifficulty() {
        this.enemySpeed += 0.5; // Augmente la vitesse
    }

    reset() {
        clearInterval(this.spawnInterval);
        this.enemies.forEach(enemy => enemy.remove());
        this.enemies = [];
    }

    pauseSpawning() {
        clearInterval(this.spawnInterval); // Stoppe temporairement le spawn
    }
    
    resumeSpawning() {
        this.spawnInterval = setInterval(() => this.spawnEnemy(), 2000); // Relance le spawn
    }
    
    


    checkCollisions(bullets, updateScoreCallback) {
    bullets.forEach((bullet, bulletIndex) => {
        this.enemies.forEach((enemy, enemyIndex) => {
            const enemyRect = enemy.getBoundingClientRect();
            const bulletRect = bullet.element.getBoundingClientRect();

            // Détection de collision
            if (
                bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top
            ) {
                // Vérifie si la couleur du missile correspond au genre
                const isMatch =
                    (bullet.element.classList.contains('blue') && enemy.classList.contains('male')) ||
                    (bullet.element.classList.contains('pink') && enemy.classList.contains('female'));

                if (isMatch) {
                    updateScoreCallback(10); // Augmente le score
                    enemy.remove();
                    bullet.remove();
                    this.enemies.splice(enemyIndex, 1);
                    bullets.splice(bulletIndex, 1);
                    this.sound.play(3);
                }
            }
        });
    });
}

}
