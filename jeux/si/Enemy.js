export class Enemy {
  constructor(texte, id_mot, article, gameContainer) {
      this.texte = texte;
      this.id_mot = id_mot;
      this.article = article;
      this.element = document.createElement('div');
      this.element.classList.add('enemy');
      this.element.textContent = this.texte;

      // Ajout de styles spécifiques
      this.element.style.left = `${Math.random() * 560}px`;
      this.element.style.top = '0px';

      if (this.article === 'un') {
          this.element.classList.add('male');
      } else if (this.article === 'une') {
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
