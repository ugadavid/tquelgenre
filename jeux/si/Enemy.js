export class Enemy {
  constructor(texte, article, gameContainer) {
      this.texte = texte;
      this.article = article;
      this.element = document.createElement('div');
      this.element.classList.add('enemy');
      this.element.textContent = this.texte;

      // Ajout de styles spécifiques
      this.element.style.left = `${Math.random() * 560}px`;
      this.element.style.top = '0px';

      if (this.article === 'le') {
          this.element.classList.add('male');
      } else if (this.article === 'la') {
          this.element.classList.add('female');
      }

      gameContainer.appendChild(this.element);
  }

  updatePosition(speed) {
      const top = parseInt(this.element.style.top);
      this.element.style.top = `${top + speed}px`;
      return top;
  }

  remove() {
      this.element.remove();
  }
}
