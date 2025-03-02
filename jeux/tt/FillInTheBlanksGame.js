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
    this.userResponses = {}; // Enregistrement des réponses de l'utilisateur

    // Pour accumuler les objets Word de tous les textes
    this.allWords = [];

    // WordManager pourra être utilisé si besoin, mais ici nous stockons tous les mots dans allWords
    this.wordManager = new WordManager();
  }

  async init() {
    await this.loadTexts();
    this.countTotalAnswers();
    this.displayText(this.currentTextIndex);
    this.updateProgressBar();
    this.startTimer(); // Si nécessaire
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
    // Découpage en lignes en supprimant les lignes vides
    const lines = rawText.split('\n').map(line => line.trim()).filter(line => line !== '');
    if (lines.length < 2) {
      console.error('Le fichier texte ne contient pas suffisamment de données.');
      return;
    }
    // La première ligne est le titre de la catégorie
    this.categoryTitle = lines[0];
    // La deuxième ligne contient l'ID (non utilisé ici)
    // const categoryId = lines[1];

    let currentText = '';
    for (let i = 2; i < lines.length; i++) {
      if (lines[i].startsWith('Text')) {
        if (currentText.trim()) {
          this.texts.push({ category: this.categoryTitle, content: currentText.trim() });
        }
        // Enlever le préfixe "Text X : "
        currentText = lines[i].replace(/Text \d+ : /, '').trim();
      } else {
        currentText += `\n${lines[i]}`;
      }
    }
    if (currentText.trim()) {
      this.texts.push({ category: this.categoryTitle, content: currentText.trim() });
    }
  }

  // Compte le nombre total de zones interactives dans tous les textes
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

  // Affiche le texte (avec listes déroulantes) correspondant à this.currentTextIndex
  displayText(index) {
    const container = document.getElementById('exercise-container');
    container.innerHTML = '';

    if (index < 0 || index >= this.texts.length) return;

    const textData = this.texts[index];

    // Affichage du titre de la catégorie
    const categoryHeader = document.createElement('h3');
    categoryHeader.textContent = this.categoryTitle;
    container.appendChild(categoryHeader);

    // La première ligne du texte est considérée comme le titre du texte
    const lines = textData.content.split('\n');
    const titleLine = lines[0];
    const titleElem = document.createElement('h4');
    titleElem.textContent = titleLine;
    container.appendChild(titleElem);

    // Le reste du texte (contenant les zones interactives)
    const contentText = lines.slice(1).join('\n');
    let dropdownCounter = 0;

    // Pour ce texte, nous stockerons ses objets Word dans une propriété (si besoin de les distinguer)
    textData.words = [];

    // Remplacement de chaque occurence du schéma *options* _mot_ par une liste déroulante
    const newContent = contentText.replace(/\*(.*?)\*\s*_(.*?)_/g, (match, articleOptions, wordText) => {
      const options = articleOptions.split('/').map(opt => opt.trim());
      // Par convention, la première option est la bonne réponse
      const correctArticle = options[0];
      const dropdownId = `${index}-${dropdownCounter++}`;

      // Création d'un objet Word et ajout dans le tableau global
      const word = new Word(wordText, correctArticle);
      word.id_mot = dropdownId;
      // Ajout dans le WordManager si nécessaire
      this.wordManager.ajouterMot(word);
      // Stockage dans le tableau global allWords
      this.allWords.push(word);
      // Et dans le texte courant (pour d'éventuelles récupérations spécifiques)
      textData.words.push(word);

      // Optionnel : mélanger les options
      if (Math.random() > 0.5) {
        shuffleArray(options);
      }

      // Construction de la liste déroulante
      let selectHTML = `<select id="${dropdownId}" class="form-select dropdown" data-answer="${correctArticle}">`;
      selectHTML += '<option value="">-- Choisir --</option>';
      options.forEach(option => {
        // Si l'utilisateur a déjà répondu, pré-sélectionner la réponse
        const selected = this.userResponses[dropdownId] === option ? 'selected' : '';
        selectHTML += `<option value="${option}" ${selected}>${option}</option>`;
      });
      selectHTML += '</select>';
      return selectHTML + ` <span class="word-text">${wordText}</span>`;
    });

    console.log('currentTextIndex: ' + this.currentTextIndex +', this.texts.length: '+ this.texts.length);
    // Affichage dans une balise <pre> pour conserver la mise en forme
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

        // Mise à jour de l'objet Word correspondant dans allWords
        const wordObj = this.allWords.find(w => w.id_mot === dropdownId);
        if (wordObj) {
          wordObj.userResponse = target.value;
        }

        // Gestion du style (classes correct / incorrect) et du score
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
    scoreElement.textContent = `Score : ${this.correctAnswers} / ${this.totalAnswers}`;
  }

  updateNavigationButtons() {
    document.getElementById('prev-button').disabled = this.currentTextIndex === 0;
    const nextButton = document.getElementById('next-button');
    // Si nous sommes sur le dernier texte, on modifie le libellé du bouton
    if (this.currentTextIndex === this.texts.length - 1) {
      nextButton.textContent = "Voir les résultats";
      document.getElementById('next-button').disabled = false;
    } else {
      nextButton.textContent = "Suivant";
      document.getElementById('next-button').disabled = false;
    }
  }

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
      } else {
        // Dernier texte → afficher les résultats
        this.showResults();
      }
    });
  }

  updateProgressBar() {
    // Implémente ici la mise à jour de ta barre de progression si besoin
  }

  startTimer() {
    // Implémente ici ton timer si nécessaire
  }

  // Affiche les résultats dans une overlay en listant les erreurs (les réponses incorrectes)
  showResults() {
    // Supposons que dans le HTML, une overlay avec l'id "result-overlay"
    // et un tableau (ex. <tbody>) avec l'id "error-table" soient présents
    const overlay = document.getElementById('result-overlay');
    const errorTable = document.getElementById('error-table');
    errorTable.innerHTML = '';

    // Récupérer les mots pour lesquels la réponse de l'utilisateur est incorrecte
    const errors = this.allWords.filter(word => word.userResponse !== word.article);
    errors.forEach(word => {
      const row = document.createElement('tr');
      // Affichage du mot, de la bonne réponse et de la réponse donnée (ou "-" si aucune réponse)
      row.innerHTML = `<td>${word.texte}</td>
                       <td>${word.article}</td>
                       <td>${word.userResponse ? word.userResponse : '-'}</td>`;
      errorTable.appendChild(row);
    });
    if (errors.length === 0) {
      errorTable.innerHTML = '<tr><td colspan="3">Aucune erreur !</td></tr>';
    }
    overlay.style.display = 'flex';
  }
}
