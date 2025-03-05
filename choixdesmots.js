function loadWordsByCategory() {
  const categoryId = document.getElementById('categorie').value;
  const columns = document.querySelectorAll('.column');

  // Vider les colonnes avant d'ajouter de nouveaux mots
  columns.forEach(column => column.innerHTML = '');

  // Appel de l'API avec le bon `categorieId`
  fetch(`https://tqgapi.skys.fr/api/getWords.php?categorieId=${categoryId}`)
      .then(response => response.json())
      .then(data => {
          const itemsPerColumn = Math.ceil(data.length / columns.length);  // Nb d'items par colonne

          data.forEach((word, index) => {
              const label = document.createElement('label');
              const checkbox = document.createElement('input');

              checkbox.type = 'checkbox';
              checkbox.id = word.mot;

              // Ajoute l'article devant le mot
              label.innerHTML = `${word.article} ${word.mot}`;
              label.prepend(checkbox);

              // Répartit équitablement les mots dans les colonnes
              const columnIndex = Math.floor(index / itemsPerColumn);
              columns[columnIndex].appendChild(label);
          });
      })
      .catch(error => console.error('Erreur lors de l\'appel API:', error));
}