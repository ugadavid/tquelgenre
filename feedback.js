function loadFeedbackWords(list) {
  
  
  // Appel à l'API en `POST` avec un JSON
  fetch('https://tqgapi.skys.fr/api/api/api.php?action=sentencesId', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ list })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Erreur réseau');
      }
      return response.json();
  })
  .then(data => {
      const feedbackGrid = document.querySelector('.feedback-grid');
      feedbackGrid.innerHTML = '';  // Vider avant d'ajouter les nouveaux mots
      console.log('Données reçues de l API :', data);



      // 🛠 1. Regrouper les phrases par mot
      const groupedWords = {};
      data.sentences.forEach(word => {
          if (!groupedWords[word.name]) {
              groupedWords[word.name] = {
                  article: word.article,
                  phrases: []
              };
          }
          groupedWords[word.name].phrases.push(word.phrase);
      });

      // 🛠 2. Créer un seul `wordDiv` par mot avec les phrases regroupées
      Object.keys(groupedWords).forEach(mot => {
          const wordData = groupedWords[mot];
          const wordDiv = document.createElement('div');
          wordDiv.className = 'feedback-word';

          // Créer le bloc principal avec la première phrase
          const firstPhrase = wordData.phrases[0];
          wordDiv.innerHTML = `
              <strong>${wordData.article} ${mot}</strong>
              <em class="feedback-example">${firstPhrase}</em>
              <button class="bouton">+ Plus d'exemples</button>
              <div class="feedback-additional-examples" style="display: none;">
                  ${wordData.phrases.slice(1).map(phrase => `<em>${phrase}</em>`).join('')}
              </div>
          `;

          feedbackGrid.appendChild(wordDiv);
      });

      // 🛠 3. Ajouter des écouteurs d'événements aux boutons
      const buttons = document.querySelectorAll('.bouton');
      buttons.forEach(button => {
          button.addEventListener('click', () => {
              const additionalExamples = button.nextElementSibling;
              additionalExamples.style.display = 
                  additionalExamples.style.display === 'none' ? 'block' : 'none';
          });
      });
  })
  .catch(error => console.error('Erreur lors de l\'appel API:', error));
}