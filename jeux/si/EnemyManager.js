import { Enemy } from './Enemy.js';
import { WordManager } from '../common/WordManager.js';
import { Sound } from './Sound.js';

export class EnemyManager {
    constructor(game) {
        this.game = game;
        this.enemies = [];
        this.wordList = [];
        this.wm = new WordManager();
        this.enemySpeed = 1;
        this.sound = new Sound();
        this.gameContainer = document.getElementById("game-container")
        //alert(this.gameContainer);
    }

    // Méthode d'initialisation de la classe EnemyManager
    async init() {
        // Charger les mots de façon asynchrone
        //this.wordList = await this.wm.loadWordsFromFile();
        this.wordList = await this.wm.loadWordsFromAPI(1);
        if (!this.wordList || this.wordList.length === 0) {
            console.warn("Aucun mot n'a été chargé.");
        }
    }

    // Méthode pour démarrer le spawn des ennemis
    startSpawning() {
        this.spawnInterval = setInterval(() => this.spawnEnemy(), 2000);
        this.gameContainer.classList.add("scrolling-background");
        this.gameContainer.classList.remove("paused");
    }

    // Méthode pour générer un ennemi
    spawnEnemy() {
        if (this.wordList.length === 0) {
            console.warn('Liste de mots vide. Aucun ennemi ne sera généré.');
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.wordList.length);
        const { texte, article } = this.wordList[randomIndex];

        // Créer un nouvel ennemi
        const newEnemy = new Enemy(texte, article, document.getElementById('game-container'));
        this.enemies.push(newEnemy);
    }

    // Méthode pour mettre à jour la position des ennemis
    update() {
        this.enemies.forEach((enemy, index) => {
            const top = enemy.updatePosition(this.enemySpeed);

            // Supprimer les ennemis qui sortent de l'écran
            if (top > 400) {
                enemy.remove();
                this.enemies.splice(index, 1);
                this.game.updateScore(-5);
            }
        });
    }

    // Méthode pour arrêter le spawn des ennemis
    reset() {
        clearInterval(this.spawnInterval);
        this.enemies.forEach(enemy => enemy.remove());
        this.enemies = [];
        this.gameContainer.classList.add("paused");
    }

    // Méthode pour mettre en pause le spawn des ennemis
    pauseSpawning() {
        clearInterval(this.spawnInterval);
        this.gameContainer.classList.add("paused");
    }

    // Méthode pour reprendre le spawn des ennemis
    resumeSpawning() {
        this.spawnInterval = setInterval(() => this.spawnEnemy(), 2000);
        this.gameContainer.classList.remove("paused");
    }

    // Méthode de gestion des collisions
    checkCollisions(bullets, updateScoreCallback) {
        bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                const enemyRect = enemy.element.getBoundingClientRect();
                const bulletRect = bullet.element.getBoundingClientRect();

                if (
                    bulletRect.left < enemyRect.right &&
                    bulletRect.right > enemyRect.left &&
                    bulletRect.top < enemyRect.bottom &&
                    bulletRect.bottom > enemyRect.top
                ) {
                    const isMatch =
                        (bullet.element.classList.contains('blue') && enemy.element.classList.contains('male')) ||
                        (bullet.element.classList.contains('pink') && enemy.element.classList.contains('female'));

                    if (isMatch) {
                        updateScoreCallback(10);
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
