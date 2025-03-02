// FillInTheBlanksGame.js
import { Word } from '../COMMON/Word.js';
import { WordManager } from '../COMMON/WordManager.js';

// Fonction utilitaire pour mélanger un tableau
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export class FillInTheBlanksGame {
  constructor(textFileUrl) {
    this.textFileUrl = textFileUrl;

    // Variables de gestion de l'exercice
    this.currentTextIndex = 0;
    this.texts = [];
    this.totalAnswers = 0;
    this.correctAnswers = 0;
    this.categoryTitle = '';
    this.userResponses = {}; // Pour mémoriser la réponse de l'utilisateur

    // On instancie un WordManager pour gérer les mots interactifs de cet exercice
    this.wordManager = new WordManager();
  }

  async init() {
    await this.loadTexts();
    this.countTotalAnswers();
    this.displayText(this.currentTextIndex);
    this.updateProgressBar();
    this.startTimer(); // Si tu souhaites utiliser un timer
    this.setupNavigationButtons();
  }

  async loadTexts() {
    try {
      const response = await fetch(this.textFileUrl);
      const rawText = await response.text();
      this.parseTexts(rawText);
    } catch (error) {
      console.error('Erreur lors du chargement du fichier texte :', error);
    }
  }

  parseTexts(rawText) {
    // On découpe le fichier en lignes et on élimine les lignes vides
    const lines = rawText.split('\n').map(line => line.trim()).filter(line => line !== '');

    if (lines.length < 2) {
      console.error('Le fichier texte ne contient pas suffisamment de données.');
      return;
    }

    // La première ligne contient le titre de la catégorie
    this.categoryTitle = lines[0];
    // La deuxième ligne contient l'ID de la catégorie (pour l'instant non utilisé)
    // const categoryId = lines[1];

    let currentText = '';
    // À partir de la 3ème ligne, on parcourt le contenu
    for (let i = 2; i < lines.length; i++) {
      if (lines[i].startsWith('Text')) {
        if (currentText.trim()) {
          this.texts.push({ category: this.categoryTitle, content: currentText.trim() });
        }
        // On enlève par exemple "Text 1 : " en début de ligne
        currentText = lines[i].replace(/Text \d+ : /, '').trim();
      } else {
        currentText += `\n${lines[i]}`;
      }
    }
    // Ajout du dernier texte s'il existe
    if (currentText.trim()) {
      this.texts.push({ category: this.categoryTitle, content: currentText.trim() });
    }
  }

  // Parcourt tous les textes pour compter le nombre de zones interactives
  countTotalAnswers() {
    // On recherche les occurences du schéma *...* _..._
    const regex = /\*(.*?)\*\s*_(.*?)_/g;
    this.texts.forEach(text => {
      let match;
      while ((match = regex.exec(text.content)) !== null) {
        this.totalAnswers++;
      }
    });
    this.updateScore();
  }

  // Affiche le texte (avec les listes déroulantes) correspondant à this.currentTextIndex
  displayText(index) {
    const container = document.getElementById('exercise-container');
    container.innerHTML = '';

    if (index < 0 || index >= this.texts.length) return;

    const textData = this.texts[index];

    // Affichage du titre de la catégorie
    const categoryHeader = document.createElement('h3');
    categoryHeader.textContent = this.categoryTitle;
    container.appendChild(categoryHeader);

    // Le premier bloc de ligne est le titre du texte
    const lines = textData.content.split('\n');
    const titleLine = lines[0];
    const titleElem = document.createElement('h4');
    titleElem.textContent = titleLine;
    container.appendChild(titleElem);

    // Le reste du texte (qui contient les zones interactives)
    const contentText = lines.slice(1).join('\n');
    let dropdownCounter = 0;

    // Avant de créer les dropdown, on vide le WordManager pour ce texte
    this.wordManager.mots = [];

    // On remplace chaque occurence du schéma *options* _mot_ par une liste déroulante
    const newContent = contentText.replace(/\*(.*?)\*\s*_(.*?)_/g, (match, articleOptions, wordText) => {
      // On découpe les options (par exemple "une/un" → ["une", "un"])
      const options = articleOptions.split('/').map(opt => opt.trim());
      // Par convention, la première option est la bonne réponse
      const correctArticle = options[0];
      const dropdownId = `${index}-${dropdownCounter++}`;

      // Créer un objet Word et l'ajouter au WordManager
      const word = new Word(wordText, correctArticle);
      word.id_mot = dropdownId;
      this.wordManager.ajouterMot(word);

      // Optionnel : mélanger les options (parfois, on mélange au hasard)
      if (Math.random() > 0.5) {
        shuffleArray(options);
      }

      // Construction de la liste déroulante
      let selectHTML = `<select id="${dropdownId}" class="form-select dropdown" data-answer="${correctArticle}">`;
      selectHTML += '<option value="">-- Choisir --</option>';
      options.forEach(option => {
        const selected = this.userResponses[dropdownId] === option ? 'selected' : '';
        selectHTML += `<option value="${option}" ${selected}>${option}</option>`;
      });
      selectHTML += '</select>';
      return selectHTML;
    });

    // On affiche le texte transformé dans une balise <pre> pour conserver la mise en forme
    const paragraph = document.createElement('pre');
    paragraph.innerHTML = newContent;
    container.appendChild(paragraph);

    this.setupImmediateValidation();
    this.updateNavigationButtons();
  }

  // Ajoute la validation immédiate sur chaque liste déroulante
  setupImmediateValidation() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.addEventListener('change', (e) => {
        const target = e.target;
        const correctAnswer = target.getAttribute('data-answer');
        const dropdownId = target.id;
        this.userResponses[dropdownId] = target.value;

        if (target.value === correctAnswer) {
          if (!target.classList.contains('correct')) {
            this.correctAnswers++;
          }
          target.classList.remove('incorrect');
          target.classList.add('correct');
        } else {
          if (target.classList.contains('correct')) {
            this.correctAnswers--;
          }
          target.classList.remove('correct');
          target.classList.add('incorrect');
        }
        this.updateScore();
      });
    });
  }

  updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Score : ${this.correctAnswers}/${this.totalAnswers}`;
  }

  updateNavigationButtons() {
    document.getElementById('prev-button').disabled = this.currentTextIndex === 0;
    document.getElementById('next-button').disabled = this.currentTextIndex === this.texts.length - 1;
  }

  // Méthodes pour la navigation dans les textes
  setupNavigationButtons() {
    document.getElementById('prev-button').addEventListener('click', () => {
      if (this.currentTextIndex > 0) {
        this.currentTextIndex--;
        this.displayText(this.currentTextIndex);
        this.updateProgressBar();
      }
    });
    document.getElementById('next-button').addEventListener('click', () => {
      if (this.currentTextIndex < this.texts.length - 1) {
        this.currentTextIndex++;
        this.displayText(this.currentTextIndex);
        this.updateProgressBar();
      }
    });
  }

  updateProgressBar() {
    // Implémente ici la mise à jour de ta barre de progression (si tu en as une)
  }

  startTimer() {
    // Implémente ici ton timer si nécessaire
  }
}
