// Fonction pour retirer les accents et articles ("le", "la", "l'", etc.)
function cleanCategoryName(categorie) {
  categorie = categorie.replace(/\b(le|la|les|l'|un|une|des)\b\s*/gi, '');
  categorie = categorie.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
  return categorie.toLowerCase().replace(/\s+/g, '-');
}

// Sauvegarder le mot recherché dans localStorage
function saveSearchTerm(mot) {
  localStorage.setItem('searchTerm', mot);
}

// Charger le mot recherché depuis localStorage
function loadSearchTerm() {
  const mot = localStorage.getItem('searchTerm');
  if (mot) {
      document.getElementById('tdb_chercheur').value = mot;
      performSearch(mot);  // Lancer la recherche avec le mot
      localStorage.removeItem('searchTerm');  // Nettoyer après utilisation
  }
}

// Fonction principale de recherche
function performSearch(mot) {
  const searchResultDiv = document.getElementById('search_result');
  
  fetch('https://tqgapi.skys.fr/api/api/api.php?action=search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mot })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          const mots = data.mots;
          const resultsHTML = mots.map(mot => {
              const categorieClean = cleanCategoryName(mot.categorie);
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
          searchResultDiv.innerHTML = `<p>${data.message || 'Erreur inconnue'}</p>`;
      }
  })
  .catch(error => {
      console.error('Erreur lors de l\'appel API:', error);
      searchResultDiv.innerHTML = '<p>Erreur lors de l\'appel API. Veuillez réessayer plus tard.</p>';
  });
}

// Intercepter le submit du formulaire
document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('search_form');
  if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
          event.preventDefault();
          const searchInput = document.getElementById('tdb_chercheur').value.trim();
          if (searchInput) {
              saveSearchTerm(searchInput);
              window.location.href = '/recherche.html';  // 👈 Rediriger vers recherche.html
          }
      });
  } else {
      console.error('Formulaire de recherche introuvable sur cette page.');
  }
});



// Charger le mot recherché s'il existe
document.addEventListener('DOMContentLoaded', loadSearchTerm);
