// DragAndDropGame.js
import { WordManager } from '../COMMON/WordManager.js';

export class DragAndDropGame {
  constructor(apiCategoryId) {
    // Gestionnaire de mots qui utilisera l'API
    this.wordManager = new WordManager();
    // Optionnel : un id de catégorie pour filtrer les mots via l'API
    this.apiCategoryId = apiCategoryId;

    // État du jeu
    this.currentIndex = 0;
    this.score = 0;
    this.errors = [];

    // Récupération des éléments du DOM
    this.wordBox = document.getElementById('word');
    this.masculin = document.getElementById('masculin');
    this.feminin = document.getElementById('feminin');
    this.scoreDisplay = document.getElementById('score');
    this.overlay = document.getElementById('result-overlay');
    this.errorTable = document.getElementById('error-table');
  }

  async init() {
    await this.loadWords();
    this.setupEventListeners();
    this.updateWord();
  }

  async loadWords() {
    try {
      // On charge les mots depuis l'API en utilisant WordManager.
      // La méthode loadWordsFromAPI doit renvoyer un tableau de Word.
      this.wordManager.mots = await this.wordManager.loadWordsFromAPI(this.apiCategoryId);
      // Vous pouvez aussi prévoir un fallback sur loadWordsFromFile() en cas d'erreur API
      // if (this.wordManager.mots.length === 0) {
      //   this.wordManager.mots = await this.wordManager.loadWordsFromFile();
      // }
    } catch (error) {
      console.error('Erreur lors du chargement des mots :', error);
    }
  }

  updateWord() {
    if (this.currentIndex < this.wordManager.mots.length) {
      const currentWord = this.wordManager.mots[this.currentIndex];
      this.wordBox.textContent = currentWord.texte;
      // Réinitialiser les styles des zones de dépôt
      this.masculin.classList.remove('selected', 'incorrect');
      this.feminin.classList.remove('selected', 'incorrect');
    } else {
      this.wordBox.textContent = "Fini !";
      this.wordBox.setAttribute('draggable', 'false');
      this.showResults();
    }
  }

  showResults() {
    // Effacer d'éventuels résultats précédents
    this.errorTable.innerHTML = '';
    if (this.errors.length > 0) {
      this.errors.forEach(word => {
        const row = document.createElement('tr');
        // On calcule le genre en fonction de l'article (par exemple "le" => "masculin", "la" => "féminin")
        const genre = word.article === 'le' ? 'masculin' : 'feminin';
        row.innerHTML = `<td>${word.texte}</td><td>${genre}</td>`;
        this.errorTable.appendChild(row);
      });
    } else {
      this.errorTable.innerHTML = '<tr><td colspan="2">Aucune erreur !</td></tr>';
    }
    this.overlay.style.display = 'flex';
  }

  /**
   * Valide le dépôt en comparant l'id de la zone (masculin/féminin)
   * avec le genre attendu du mot courant.
   * Ici, on suppose que l'article "le" correspond au masculin et "la" au féminin.
   */
  validateDrop(targetId) {
    const currentWord = this.wordManager.mots[this.currentIndex];
    const correctGenre = currentWord.article === 'le' ? 'masculin' : 'feminin';
    return targetId === correctGenre;
  }

  setupEventListeners() {
    // Événements pour le drag sur la wordBox
    this.wordBox.addEventListener('dragstart', (e) => this.onDragStart(e));
    this.wordBox.addEventListener('dragend', () => this.onDragEnd());

    // Pour la zone de dépôt "masculin"
    this.masculin.addEventListener('dragover', (e) => e.preventDefault());
    this.masculin.addEventListener('dragenter', () => this.masculin.classList.add('drag-over'));
    this.masculin.addEventListener('dragleave', () => this.masculin.classList.remove('drag-over'));
    this.masculin.addEventListener('drop', (e) => this.onDrop(e, 'masculin'));

    // Pour la zone de dépôt "féminin"
    this.feminin.addEventListener('dragover', (e) => e.preventDefault());
    this.feminin.addEventListener('dragenter', () => this.feminin.classList.add('drag-over'));
    this.feminin.addEventListener('dragleave', () => this.feminin.classList.remove('drag-over'));
    this.feminin.addEventListener('drop', (e) => this.onDrop(e, 'feminin'));
  }

  onDragStart(e) {
    this.wordBox.classList.add('dragging');

    // Création d'une copie visuelle de la wordBox pour le drag preview
    const dragPreview = document.createElement('div');
    dragPreview.className = 'word-box';
    dragPreview.textContent = this.wordBox.textContent;
    dragPreview.style.position = 'absolute';
    dragPreview.style.top = '-9999px'; // Hors de la vue
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 75, 100);
    setTimeout(() => dragPreview.remove(), 0);

    // On peut transmettre des données si besoin
    e.dataTransfer.setData('text', this.wordBox.id);
  }

  onDragEnd() {
    this.wordBox.classList.remove('dragging');
  }

  onDrop(e, targetId) {
    e.preventDefault();
    if (this.validateDrop(targetId)) {
      // Marquer le succès en ajoutant la classe "selected"
      if (targetId === 'masculin' || targetId === 'féminin') {
        // On applique la classe sur le bon élément
        const zone = targetId === 'masculin' ? this.masculin : this.feminin;
        zone.classList.add('selected');
      }
      this.score++;
      this.scoreDisplay.textContent = this.score;
    } else {
      // Marquer l'erreur
      const zone = targetId === 'masculin' ? this.masculin : this.feminin;
      zone.classList.add('incorrect');
      this.errors.push(this.wordManager.mots[this.currentIndex]);
    }
    // Nettoyer la classe de survol
    this.masculin.classList.remove('drag-over');
    this.feminin.classList.remove('drag-over');

    this.currentIndex++;
    // Petite pause pour laisser le temps d'afficher la rétroaction
    setTimeout(() => this.updateWord(), 500);
  }
}
