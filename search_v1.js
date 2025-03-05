// Fonction pour retirer les accents et articles ("le", "la", "l'", etc.)
function cleanCategoryName(categorie) {
  // Retirer les articles ("le", "la", "l'", etc.)
  categorie = categorie.replace(/\b(le|la|les|l'|un|une|des)\b\s*/gi, '');

  // Retirer les accents
  categorie = categorie.normalize("NFD").replace(/[\u0300-\u036f]/g, '');

  // Remplacer les espaces par des tirets
  return categorie.toLowerCase().replace(/\s+/g, '-');
}


document.getElementById('search_form').addEventListener('submit', function (event) {
event.preventDefault();  // Empêcher le rechargement de la page

const searchInput = document.getElementById('tdb_chercheur').value.trim();
const searchResultDiv = document.getElementById('search_result');

if (searchInput === '') {
  searchResultDiv.innerHTML = '<p>Veuillez entrer un mot à rechercher.</p>';
  return;
}

// Appel à l'API en `POST` avec `fetch`
fetch('http://127.0.0.1:8080/api/api/api.php?action=search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mot: searchInput })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
const mots = data.mots;
const resultsHTML = mots.map(mot => {
const categorieClean = cleanCategoryName(mot.categorie);  // Nettoyer le nom de la catégorie
return `
<div class="result-item">
  <strong>${mot.article} ${mot.mot}</strong> - 
  <em>Catégorie : ${mot.categorie}</em> - 
  <a href="javascript:void(0);" onclick="userLink(null, '${categorieClean}')">
      jouer avec cette catégorie
  </a>
</div>
`;
}).join('');

searchResultDiv.innerHTML = resultsHTML;
} else {
// Afficher le message personnalisé si le mot n'est pas trouvé
searchResultDiv.innerHTML = `<p>${data.message || 'Erreur inconnue'}</p>`;
}

})
.catch(error => {
  console.error('Erreur lors de l\'appel API:', error);
  searchResultDiv.innerHTML = '<p>Erreur lors de l\'appel API. Veuillez réessayer plus tard.</p>';
});
});