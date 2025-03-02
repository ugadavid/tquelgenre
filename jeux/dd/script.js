let mots = []; // Tableau qui sera rempli dynamiquement
let currentIndex = 0; // Index pour suivre le mot en cours
let score = 0; // Compteur de bonnes réponses
let errors = []; // Liste des erreurs

const wordBox = document.getElementById('word');
const masculin = document.getElementById('masculin');
const feminin = document.getElementById('feminin');
const scoreDisplay = document.getElementById('score');
const overlay = document.getElementById('result-overlay');
const errorTable = document.getElementById('error-table');

// Charger les mots depuis words.txt
async function loadWords() {
  try {
    const response = await fetch('words.txt');
    const text = await response.text();
    mots = text.split('\n').map(line => {
      const [mot, genre] = line.split(',').map(item => item.trim());
      return { mot, genre: genre === 'le' ? 'masculin' : 'feminin' };
    });
    updateWord();
  } catch (error) {
    console.error('Erreur lors du chargement des mots :', error);
  }
}

// Afficher le mot courant
function updateWord() {
  if (currentIndex < mots.length - 1) {
    wordBox.textContent = mots[currentIndex].mot;
    masculin.classList.remove('selected', 'incorrect');
    feminin.classList.remove('selected', 'incorrect');
  } else {
    wordBox.textContent = "Fini !";
    wordBox.setAttribute('draggable', 'false');
    showResults();
  }
}

// Afficher le résumé des erreurs
function showResults() {
  if (errors.length > 0) {
    errors.forEach(error => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${error.mot}</td><td>${error.genre}</td>`;
      errorTable.appendChild(row);
    });
  } else {
    errorTable.innerHTML = '<tr><td colspan="2">Aucune erreur !</td></tr>';
  }
  overlay.style.display = 'flex';
}

// Fonction de validation
function validateDrop(targetId) {
  const correctGenre = mots[currentIndex].genre;
  return targetId === correctGenre;
}

// Fonction de drag and drop
wordBox.addEventListener('dragstart', (e) => {
  wordBox.classList.add('dragging');

  // Création d'une copie visuelle de la carte
  const dragPreview = document.createElement('div');
  dragPreview.className = 'word-box';
  dragPreview.textContent = wordBox.textContent;
  dragPreview.style.position = 'absolute';
  dragPreview.style.top = '-9999px'; // Hors de la vue
  document.body.appendChild(dragPreview);
  e.dataTransfer.setDragImage(dragPreview, 75, 100);

  // Nettoyer après le drag
  setTimeout(() => dragPreview.remove(), 0);

  e.dataTransfer.setData('text', e.target.id);
});

wordBox.addEventListener('dragend', () => {
  wordBox.classList.remove('dragging');
});

masculin.addEventListener('dragover', (e) => {
  e.preventDefault();
});

feminin.addEventListener('dragover', (e) => {
  e.preventDefault();
});

masculin.addEventListener('dragenter', () => {
  masculin.classList.add('drag-over');
});

feminin.addEventListener('dragenter', () => {
  feminin.classList.add('drag-over');
});

masculin.addEventListener('dragleave', () => {
  masculin.classList.remove('drag-over');
});

feminin.addEventListener('dragleave', () => {
  feminin.classList.remove('drag-over');
});

masculin.addEventListener('drop', (e) => {
  e.preventDefault();
  if (validateDrop('masculin')) {
    masculin.classList.add('selected');
    score++;
    scoreDisplay.textContent = score;
  } else {
    masculin.classList.add('incorrect');
    errors.push(mots[currentIndex]);
  }
  masculin.classList.remove('drag-over');
  currentIndex++;
  setTimeout(updateWord, 500);
});

feminin.addEventListener('drop', (e) => {
  e.preventDefault();
  if (validateDrop('feminin')) {
    feminin.classList.add('selected');
    score++;
    scoreDisplay.textContent = score;
  } else {
    feminin.classList.add('incorrect');
    errors.push(mots[currentIndex]);
  }
  feminin.classList.remove('drag-over');
  currentIndex++;
  setTimeout(updateWord, 500);
});

// Charger les mots et initialiser le jeu
loadWords();
