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
            //console.log(this.enemyManager.wordList);
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

    // Méthode pour gérer la fin du jeu
    endGame() {
        this.running = false;
        this.paused = false;
    
        // Arrêter le spawn des ennemis
        this.enemyManager.reset();
    
        // Sauvegarder les erreurs dans sessionStorage s'il y en a
        if (this.enemyManager.errors.length > 0) {
            sessionStorage.setItem('errors', JSON.stringify(this.enemyManager.errors));
        } else {
            sessionStorage.removeItem('errors');  // Nettoyer les erreurs précédentes s'il n'y en a plus
        }
    
        // Créer le message de fin
        const endMessage = document.createElement("div");
        endMessage.textContent = `Ton score est de ${this.score}`;
        endMessage.style.position = "absolute";
        endMessage.style.top = "50%";
        endMessage.style.left = "50%";
        endMessage.style.transform = "translate(-50%, -50%)";
        endMessage.style.backgroundColor = "#fff";
        endMessage.style.padding = "20px";
        endMessage.style.border = "2px solid #000";
        endMessage.style.zIndex = "100";
        endMessage.setAttribute("id", "end-message");
    
        // Bouton pour rejouer
        const replayButton = document.createElement("button");
        replayButton.textContent = "Rejouer";
        replayButton.style.marginTop = "10px";
        replayButton.onclick = () => {
            endMessage.remove();
            this.stop(); // Réinitialiser le jeu
            this.start(); // Redémarrer le jeu
        };
        endMessage.appendChild(replayButton);
    
        // Ajouter un lien vers la page feedback s'il y a des erreurs
        if (this.enemyManager.errors.length > 0) {
            const feedbackLink = document.createElement("a");
            feedbackLink.textContent = "Voir le feedback";
            feedbackLink.href = "/feedback.html";
            feedbackLink.style.display = "block";
            feedbackLink.style.marginTop = "10px";
            feedbackLink.style.textAlign = "center";
            endMessage.appendChild(feedbackLink);
        }
    
        document.body.appendChild(endMessage);
        console.log("Le jeu est terminé !");
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
