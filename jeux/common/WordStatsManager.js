// WordStatsManager.js
import { WordStats } from './WordStats.js';

export class WordStatsManager {
  constructor() {
    // Utilisation d'une Map pour indexer les statistiques par un identifiant unique du mot.
    // On peut utiliser l'id du mot (s'il existe) ou le texte du mot.
    this.stats = new Map();
  }

  // Retourne l'objet WordStats associé au mot, en le créant s'il n'existe pas encore.
  getStats(word) {
    // On utilise word.id_mot s'il existe, sinon word.texte
    const key = word.id_mot || word.texte;
    if (!this.stats.has(key)) {
      this.stats.set(key, new WordStats(word));
    }
    return this.stats.get(key);
  }

  // Enregistre une réponse pour un mot donné
  recordAnswer(word, isCorrect) {
    const stats = this.getStats(word);
    stats.recordAnswer(isCorrect);
  }

  // Retourne un tableau avec toutes les statistiques enregistrées
  getAllStats() {
    return Array.from(this.stats.values());
  }
}
