document.addEventListener('DOMContentLoaded', function() {
  // Initialise l'objet utilisateur
  let user = {
      nom: '',
      prenom: '',
      email: '',
      jeuCourant: '',
      categorieCourante: '',
      mots: []  // Tableau de tableau [id_mot, 'mot', 'genre', nb_correct, nb_incorrect]
  };

  // 🔄 Charge l'objet depuis sessionStorage s'il existe
  if (sessionStorage.getItem('user')) {
      user = JSON.parse(sessionStorage.getItem('user'));
  }

  // 🔄 Sauvegarde automatique dans sessionStorage
  function saveUser() {
      sessionStorage.setItem('user', JSON.stringify(user));
  }

  // 🛠️ Fonctions pour gérer les informations utilisateur
  function setUserInfo(key, value) {
      if (user.hasOwnProperty(key)) {
          user[key] = value;
          saveUser();
          debugLog(`Mise à jour de ${key} : ${value}`);
      } else {
          debugLog(`Clé inconnue : ${key}`);
      }
  }

  // 🛠️ Fonctions pour gérer jeuCourant et categorieCourante
  function setJeu(jeu) {
    user.jeuCourant = jeu;
    saveUser();
    debugLog(`Jeu courant mis à jour : ${jeu}`);
}

function setCategorie(categorie) {
    user.categorieCourante = categorie;
    saveUser();
    debugLog(`Catégorie courante mise à jour : ${categorie}`);
}

function resetJeu() {
    user.jeuCourant = '';
    saveUser();
    debugLog('Jeu courant réinitialisé.');
}

function resetCategorie() {
    user.categorieCourante = '';
    saveUser();
    debugLog('Catégorie courante réinitialisée.');
}

  function addMot(id_mot, mot, genre) {
      const index = user.mots.findIndex(m => m[0] === id_mot);
      if (index === -1) {
          user.mots.push([id_mot, mot, genre, 0, 0]);
          debugLog(`Ajout du mot : ${mot}`);
      } else {
          debugLog(`Mot déjà existant : ${mot}`);
      }
      saveUser();
  }

  function updateMot(id_mot, correct = 0, incorrect = 0) {
      const index = user.mots.findIndex(m => m[0] === id_mot);
      if (index !== -1) {
          user.mots[index][3] += correct;
          user.mots[index][4] += incorrect;
          saveUser();
          debugLog(`Mise à jour du mot ${user.mots[index][1]} : Correct = ${user.mots[index][3]}, Incorrect = ${user.mots[index][4]}`);
      } else {
          debugLog(`Mot introuvable avec l'ID ${id_mot}`);
      }
  }

  function removeMot(id_mot) {
      user.mots = user.mots.filter(m => m[0] !== id_mot);
      saveUser();
      debugLog(`Mot supprimé (ID: ${id_mot})`);
  }

  // 🛠️ Fonction pour tout réinitialiser
  function resetUser() {
      user = {
          nom: '',
          prenom: '',
          email: '',
          jeuCourant: '',
          categorieCourante: '',
          mots: []
      };
      saveUser();
      debugLog('Utilisateur réinitialisé.');
  }

  // 🛠️ Fonction pour afficher l'objet utilisateur dans la fenêtre de debug
  function showUser() {
      debugLog('--- Détails de l\'utilisateur ---');
      debugLog(`Nom : ${user.nom}`);
      debugLog(`Prénom : ${user.prenom}`);
      debugLog(`Email : ${user.email}`);
      debugLog(`Jeu courant : ${user.jeuCourant}`);
      debugLog(`Catégorie courante : ${user.categorieCourante}`);
      debugLog(`Mots : ${user.mots.length} mots enregistrés`);
      user.mots.forEach(m => debugLog(`Mot: ${m[1]}, Genre: ${m[2]}, Correct: ${m[3]}, Incorrect: ${m[4]}`));
  }

  function afficherCategorie() {
    const categorieCourante = sessionStorage.getItem('categorieCourante');
    const categorieElement = document.getElementById('affichage-categorie');

    if (categorieCourante) {
        categorieElement.textContent = `Space Invader : ${categorieCourante}`;
        debugLog(`Catégorie affichée : ${categorieCourante}`);
    } else {
        categorieElement.textContent = 'Space Invader : Non définie';
        debugLog('Aucune catégorie définie.');
    }
}


  function userLink(jeu = null, categorie = null) {
    // Vérifier si le jeu ou la catégorie est passé en paramètre
    if (jeu) {
        //sessionStorage.setItem('jeuCourant', jeu);
        setJeu(jeu);
        debugLog(`Jeu courant mis à jour : ${jeu}`);
    }
    if (categorie) {
        alert('CATEGORIE : ' + categorie);
        //sessionStorage.setItem('categorieCourante', categorie);
        setCategorie(categorie);
        debugLog(`Catégorie courante mise à jour : ${categorie}`);
    }
    saveUser();

    // Ajoute un léger délai pour assurer le stockage avant la redirection
    setTimeout(() => {

        // Récupérer les valeurs depuis le sessionStorage
        const jeuCourant = sessionStorage.getItem('jeuCourant');
        const categorieCourante = sessionStorage.getItem('categorieCourante');

        // Log des valeurs récupérées
        debugLog(`Jeu courant dans le stockage : ${jeuCourant}`);
        debugLog(`Catégorie courante dans le stockage : ${categorieCourante}`);

        // Vérifier les conditions et rediriger selon les cas
        if (jeuCourant && categorieCourante) {
            //alert('JEU et CATEGORIE : ' + jeuCourant + ' - ' + categorieCourante);
            if (categorieCourante !== 'random' ) {
                window.location.href = `jeux/${jeuCourant}/index.html`;
            } else {
                if (jeuCourant === 'tt') {
                    window.location.href = `jeux.html`;
                }
            }
            
        } else if (jeuCourant) {
            //alert('JEU : ' + jeuCourant);
            window.location.href = 'categorie.html';
        } else if (categorieCourante) {
            //alert('CATEGORIE :' + categorieCourante);
            window.location.href = 'jeux.html';
        } else {
            //alert('JEU et CATEGORIE : ' + jeuCourant + ' - ' + categorieCourante);
            debugLog('Aucun paramètre défini, redirection vers l\'accueil...');
            window.location.href = 'index.html';
        }
    }, 1000); // ⬅️ Délai de 100ms pour laisser le temps au stockage
}


  // Message initial
  debugLog('Gestion des utilisateurs prête !');

  // Expose les fonctions globalement si besoin
  window.setUserInfo = setUserInfo;
  window.addMot = addMot;
  window.updateMot = updateMot;
  window.removeMot = removeMot;
  window.resetUser = resetUser;
  window.showUser = showUser;
  window.userLink = userLink;  // ⬅️ Expose la fonction userLink globalement !
  window.setJeu = setJeu;
  window.setCategorie = setCategorie;
  window.resetJeu = resetJeu;
  window.resetCategorie = resetCategorie;
  window.afficherCategorie = afficherCategorie;
});
