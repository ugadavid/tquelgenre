import { Player } from './player.js';
import { EnemyManager } from './EnemyManager.js';


export class Game {
    // Constructeur de la classe Game
    constructor() {
        this.player = new Player();
        this.enemyManager = new EnemyManager(this);
        this.score = 0;
        this.level = 1;
        this.running = false; // Le jeu commence à l'arrêt
        this.paused = false;
        this.keyboardConfig = false;
    }

    // Méthode d'initialisation du jeu
    init() {
        document.getElementById('start-button').addEventListener('click', () => this.start());
        document.getElementById('pause-button').addEventListener('click', () => this.togglePause());
        document.getElementById('stop-button').addEventListener('click', () => this.stop());
        document.getElementById('keyboard-button').addEventListener('click', () => this.keyboard());
    }

    // Méthode de démarrage du jeu
    start() {
        if (this.running) return; // Empêche de relancer un jeu déjà démarré
        if (this.keyboardConfig) return; // Empêche de démarrer le jeu si la configuration des touches est ouverte
        this.running = true;
        this.paused = false;
        this.player.init();

        this.enemyManager.init().then(() => {
            console.log("Mots chargés, démarrage du spawn.");
            this.enemyManager.startSpawning();
            this.loop();
        }).catch((error) => {
            console.error("Erreur lors de l'initialisation de EnemyManager :", error);
        });

    }

    // Méthode pour mettre en pause ou reprendre le jeu
    togglePause() {
        if (!this.running) return; // Si le jeu n'est pas démarré, ne rien faire
        this.paused = !this.paused;
        const pauseOverlay = document.getElementById('pause-overlay');
        if (this.paused) {
            this.enemyManager.pauseSpawning(); // Arrête temporairement le spawn
            pauseOverlay.style.display = 'block';
        } else {
            this.enemyManager.resumeSpawning(); // Reprend le spawn
            pauseOverlay.style.display = 'none';
            this.loop(); // Relance la boucle de jeu
        }
    }
    
    // Méthode pour arrêter le jeu
    stop() {
        this.running = false;
        this.paused = false;
        this.score = 0;
        this.level = 1;

        // Réinitialise les composants du jeu
        this.enemyManager.reset();
        this.player.reset();

        document.getElementById('score').textContent = `Score: 0`;
        document.getElementById('level').textContent = `Level: 1`;
        document.getElementById('pause-overlay').style.display = 'none';
    }

    // Méthode de boucle de jeu
    loop() {
        if (!this.running || this.paused) return; // Arrête la boucle si le jeu est en pause ou arrêté

        this.player.update();
        this.enemyManager.update();
        this.enemyManager.checkCollisions(this.player.bullets, (points) => this.updateScore(points));

        requestAnimationFrame(() => this.loop());
    }

    // Méthode pour mettre à jour le score
    updateScore(points) {
        this.score += points;
        document.getElementById('score').textContent = `Score: ${this.score}`;

        if (this.score > this.level * 50) {
            this.level++;
            document.getElementById('level').textContent = `Level: ${this.level}`;
            //this.enemyManager.increaseDifficulty();
        }
    }

    keyboard() {
        if (this.running) return; // Si le jeu est démarré, ne rien faire
        if (!this.keyboardConfig) {
            document.getElementById('controls-config').style.display = 'block';
            this.keyboardConfig = true;
        } else {
            document.getElementById('controls-config').style.display = 'none';
            this.keyboardConfig = false;
        }
        
    }
}
