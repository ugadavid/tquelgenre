export class Bullet {
  constructor(x, y, color) {
      this.element = document.createElement('div');
      this.element.classList.add('bullet', color); // Couleur : 'blue' ou 'pink'
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
      document.getElementById('game-container').appendChild(this.element);
  }

  move() {
      const currentTop = parseInt(this.element.style.top);
      this.element.style.top = `${currentTop - 5}px`;
  }

  isOutOfBounds() {
      return parseInt(this.element.style.top) < 0;
  }

  remove() {
      this.element.remove();
  }
}
