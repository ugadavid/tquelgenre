// WordStats.js
export class WordStats {
  constructor(word) {
    this.word = word;       // Instance de Word associée
    this.correctCount = 0;  // Nombre de réponses correctes
    this.incorrectCount = 0;// Nombre de réponses incorrectes
  }

  // Enregistre une réponse
  recordAnswer(isCorrect) {
    if (isCorrect) {
      this.correctCount++;
    } else {
      this.incorrectCount++;
    }
  }

  // Retourne le nombre total de tentatives
  get total() {
    return this.correctCount + this.incorrectCount;
  }
}
