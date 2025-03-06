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

            // 🛠 2. Ajouter la source si elle commence par "http"
            const validSource = word.source && word.source.startsWith('http') ? word.source : null;

            groupedWords[word.name].phrases.push({
                phrase: word.phrase,
                source: validSource
            });
        });

        // 🛠 3. Créer un seul `wordDiv` par mot avec les phrases regroupées
        Object.keys(groupedWords).forEach(mot => {
            const wordData = groupedWords[mot];
            const wordDiv = document.createElement('div');
            wordDiv.className = 'feedback-word';

            // Créer le bloc principal avec la première phrase et sa source (si valide)
            const firstPhraseData = wordData.phrases[0];
            const firstPhrase = firstPhraseData.phrase;
            const firstSource = firstPhraseData.source 
                ? ` <a href="${firstPhraseData.source}" target="_blank">[source]</a>` 
                : '';

            wordDiv.innerHTML = `
                <strong>${wordData.article} ${mot}</strong>
                <em class="feedback-example">${firstPhrase}${firstSource}</em>
                <button class="bouton">+ Plus d'exemples</button>
                <div class="feedback-additional-examples" style="display: none;">
                    ${wordData.phrases.slice(1).map(phraseData => {
                        const sourceLink = phraseData.source 
                            ? ` <a href="${phraseData.source}" target="_blank">[source]</a>` 
                            : '';
                        return `<em>${phraseData.phrase}${sourceLink}</em>`;
                    }).join('')}
                </div>
            `;

            feedbackGrid.appendChild(wordDiv);
        });

        // 🛠 4. Ajouter des écouteurs d'événements aux boutons
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




function loadFeedbackWords2(list) {

    // Appel à l'API en `POST` avec un JSON
    fetch('http://127.0.0.1:8080/api/api/api.php?action=sentencesWord', {
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

            // 🛠 2. Ajouter la source si elle commence par "http"
            const validSource = word.source && word.source.startsWith('http') ? word.source : null;

            groupedWords[word.name].phrases.push({
                phrase: word.phrase,
                source: validSource
            });
        });

        // 🛠 3. Créer un seul `wordDiv` par mot avec les phrases regroupées
        Object.keys(groupedWords).forEach(mot => {
            const wordData = groupedWords[mot];
            const wordDiv = document.createElement('div');
            wordDiv.className = 'feedback-word';

            // Créer le bloc principal avec la première phrase et sa source (si valide)
            const firstPhraseData = wordData.phrases[0];
            const firstPhrase = firstPhraseData.phrase;
            const firstSource = firstPhraseData.source 
                ? ` <a href="${firstPhraseData.source}" target="_blank">[source]</a>` 
                : '';

            wordDiv.innerHTML = `
                <strong>${wordData.article} ${mot}</strong>
                <em class="feedback-example">${firstPhrase}${firstSource}</em>
                <button class="bouton">+ Plus d'exemples</button>
                <div class="feedback-additional-examples" style="display: none;">
                    ${wordData.phrases.slice(1).map(phraseData => {
                        const sourceLink = phraseData.source 
                            ? ` <a href="${phraseData.source}" target="_blank">[source]</a>` 
                            : '';
                        return `<em>${phraseData.phrase}${sourceLink}</em>`;
                    }).join('')}
                </div>
            `;

            feedbackGrid.appendChild(wordDiv);
        });

        // 🛠 4. Ajouter des écouteurs d'événements aux boutons
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