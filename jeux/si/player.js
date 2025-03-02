import { Bullet } from './bullet.js';
import { Sound } from './Sound.js';

export class Player {
    constructor() {
        this.element = document.getElementById('spaceship');
        this.positionX = 275;
        this.positionY = 370;
        this.speed = 10;
        this.bullets = []; // Liste des missiles
        this.sound = new Sound();

        // Configuration des touches (par défaut)
        this.controls = {
            left: 'q',
            right: 'd',
            up: 'z',
            down: 's',
            shootBlue: 'k',
            shootPink: 'm',
        };
    }

    init() {
        document.addEventListener('keydown', (event) => this.handleMovement(event));
        document.addEventListener('keydown', (event) => this.shoot(event));
    }

    setControls(newControls) {
        // Permet à l'utilisateur de définir des nouvelles touches
        this.controls = { ...this.controls, ...newControls };
    }

    handleMovement(event) {
        if (event.key === this.controls.left && this.positionX > 0) this.positionX -= this.speed;
        if (event.key === this.controls.right && this.positionX < 550) this.positionX += this.speed;
        if (event.key === this.controls.up && this.positionY > 0) this.positionY -= this.speed;
        if (event.key === this.controls.down && this.positionY < 380) this.positionY += this.speed;

        this.element.style.left = `${this.positionX}px`;
        this.element.style.top = `${this.positionY}px`;
    }

    shoot(event) {
        if (event.key === this.controls.shootBlue || event.key === this.controls.shootPink) {
            const color = event.key === this.controls.shootBlue ? 'blue' : 'pink';
            event.key === this.controls.shootBlue ? this.sound.play(1) : this.sound.play(2);
            const bullet = new Bullet(this.positionX + 22, this.positionY, color);
            this.bullets.push(bullet);
        }
    }

    updateBullets() {
        this.bullets.forEach((bullet, index) => {
            bullet.move();
            if (bullet.isOutOfBounds()) {
                bullet.remove();
                this.bullets.splice(index, 1);
            }
        });
    }

    update() {
        this.updateBullets();
    }


    reset() {
        this.positionX = 275;
        this.positionY = 370;
        this.element.style.left = `${this.positionX}px`;
        this.element.style.top = `${this.positionY}px`;
    
        // Supprimer tous les missiles
        this.bullets.forEach(bullet => bullet.remove());
        this.bullets = [];
    }
    
}
