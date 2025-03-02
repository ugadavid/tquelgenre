let currentTextIndex = 0;
let texts = [];
let totalAnswers = 0;
let correctAnswers = 0;
let categoryTitle = '';
const userResponses = {};

// Fonction pour charger le fichier texte
async function loadTexts() {
  try {
    const response = await fetch('text.txt'); // Remplacer par le chemin du fichier texte
    const text = await response.text();
    parseTexts(text);
    countTotalAnswers();
    displayText(currentTextIndex);
    updateProgressBar();
    startTimer();
  } catch (error) {
    console.error('Erreur lors du chargement du fichier texte :', error);
  }
}

// Fonction pour parser le contenu du fichier texte
function parseTexts(rawText) {
  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line !== '');

  if (lines.length < 2) {
    console.error('Le fichier texte ne contient pas suffisamment de données.');
    return;
  }

  // La première ligne est le titre de la catégorie
  categoryTitle = lines[0];

  // La deuxième ligne est l'ID de la catégorie (non utilisé ici)
  const categoryId = lines[1];

  let currentText = '';

  for (let i = 2; i < lines.length; i++) {
    if (lines[i].startsWith('Text')) {
      if (currentText.trim()) {
        texts.push({ category: categoryTitle, content: currentText.trim() });
      }
      currentText = lines[i].replace(/Text \d+ : /, '').trim();
    } else {
      currentText += `\n${lines[i]}`;
    }
  }

  // Ajouter le dernier texte s'il n'est pas vide
  if (currentText.trim()) {
    texts.push({ category: categoryTitle, content: currentText.trim() });
  }
}

// Compte le nombre total de réponses
function countTotalAnswers() {
  texts.forEach(text => {
    totalAnswers += (text.content.match(/\*/g) || []).length / 2;
  });
  updateScore();
}

// Mélanger les options dans un ordre aléatoire
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Fonction pour afficher un texte
function displayText(index) {
  const container = document.getElementById('exercise-container');
  container.innerHTML = '';

  if (index < 0 || index >= texts.length) return;

  const text = texts[index].content;

  const categoryHeader = document.createElement('h3');
  categoryHeader.textContent = categoryTitle;
  container.appendChild(categoryHeader);

  const title = document.createElement('h4');
  title.textContent = text.split('\n')[0];
  container.appendChild(title);

  const paragraph = document.createElement('pre');
  let dropdownCounter = 0;

  paragraph.innerHTML = text
    .split('\n')
    .slice(1)
    .join('\n')
    .replace(/\*(.*?)\*/g, (_, match) => {
      const options = match.split('/');
      const correctOption = options[0].trim();
      const dropdownId = `${index}-${dropdownCounter++}`;

    if (Math.random() > 0.5) {
      shuffleArray(options);
    }

    let selectHTML = `<select id="${dropdownId}" class="form-select dropdown" data-answer="${correctOption}">`;
    selectHTML += '<option value="">-- Choisir --</option>';
    options.forEach(option => {
      const selected = userResponses[dropdownId] === option.trim() ? 'selected' : '';
      selectHTML += `<option value="${option.trim()}" ${selected}>${option.trim()}</option>`;
    });
    selectHTML += '</select>';
    return selectHTML;
  });

  container.appendChild(paragraph);

  setupImmediateValidation();
  updateNavigationButtons();
}

// Ajout de la validation immédiate
function setupImmediateValidation() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('change', function () {
      const correctAnswer = this.getAttribute('data-answer');
      const dropdownId = this.id;
      userResponses[dropdownId] = this.value;

      if (this.value === correctAnswer) {
        if (!this.classList.contains('correct')) {
          correctAnswers++;
        }
        this.classList.remove('incorrect');
        this.classList.add('correct');
      } else {
        if (this.classList.contains('correct')) {
          correctAnswers--;
        }
        this.classList.remove('correct');
        this.classList.add('incorrect');
      }
      updateScore();
    });
  });
}

// Mise à jour du score
function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Score : ${correctAnswers}/${totalAnswers}`;
}

// Mise à jour des boutons de navigation
function updateNavigationButtons() {
  document.getElementById('prev-button').disabled = currentTextIndex === 0;
  document.getElementById('next-button').disabled = currentTextIndex === texts.length - 1;
}

// Gestion des clics sur les boutons
document.getElementById('prev-button').addEventListener('click', () => {
  if (currentTextIndex > 0) {
    currentTextIndex--;
    displayText(currentTextIndex);
    updateProgressBar();
  }
});

document.getElementById('next-button').addEventListener('click', () => {
  if (currentTextIndex < texts.length - 1) {
    currentTextIndex++;
    displayText(currentTextIndex);
    updateProgressBar();
  }
});

// Charger les textes au démarrage
loadTexts();
