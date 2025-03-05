document.addEventListener('DOMContentLoaded', function() {
  
  // 🔄 Fonction pour récupérer l'objet user depuis sessionStorage
    function getUser() {
        const storedUser = sessionStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : {
            nom: '',
            prenom: 'dd',
            email: '',
            jeuCourant: '',
            categorieCourante: '',
            categorieCouranteId: '',
            avatar: '',
            mots: []  // Tableau de tableau [id_mot, 'mot', 'genre', nb_correct, nb_incorrect]
        };
    }

// 🔄 Fonction pour vérifier si l'utilisateur est connecté
function isConnected() {
    const user = getUser();
    return user.nom !== '' && user.prenom !== '' && user.email !== '';
}

function checkConnection() {
    if (!isConnected()) {
        window.location.href = 'index.html';
    }
}

   // user = getUser();

  // 🔄 Charge l'objet depuis sessionStorage s'il existe
  if (sessionStorage.getItem('user')) {
      user = JSON.parse(sessionStorage.getItem('user'));
  }

  // 🔄 Sauvegarde automatique dans sessionStorage
  function saveUser() {
    const user = getUser();  // 🔄 Récupère l'utilisateur à jour depuis sessionStorage
    sessionStorage.setItem('user', JSON.stringify(user));
  }
  function saveThisUser(thisuser) {
    sessionStorage.setItem('user', JSON.stringify(thisuser));  // 🔄 Sauvegarde l'objet complet dans sessionStorage
    //alert('saveThisUser(thisuser)');
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

  function updateUser(data) {
    let user = getUser();  // 🔄 Récupère l'utilisateur à jour
    user.prenom = data.prenom || user.prenom;
    user.nom = data.nom || user.nom;
    user.email = data.email || data.mail || user.email;
    user.jeuCourant = data.jeuCourant || user.jeuCourant;
    user.categorieCourante = data.categorieCourante || user.categorieCourante;
    user.categorieCouranteId = data.categorieCouranteId || user.categorieCouranteId;
    user.avatar = data.avatar || user.avatar;
    user.mots = data.mots || user.mots || [];
    //  user.mots = data.mots || user.mots;

    saveThisUser(user);  // 🔄 Sauvegarde l'objet mis à jour dans sessionStorage
    debugLog('Utilisateur mis à jour dans sessionStorage.');
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
      let user = {
          nom: '',
          prenom: '',
          email: '',
          jeuCourant: '',
          categorieCourante: '',
          categorieCouranteId: '',
          avatar: '',
          mots: []
      };
      saveThisUser(user);
      debugLog('Utilisateur réinitialisé.');
      // Ajoute un léger délai pour assurer le stockage avant la redirection
    setTimeout(() => {
        window.location.href = '/index.html';
    }, 500); // ⬅️ Délai de 100ms pour laisser le temps au stockage
  }

  function vireTout() {
    resetUser();
    sessionStorage.clear();
  }

  // 🛠️ Fonction pour afficher l'objet utilisateur dans la fenêtre de debug
  function showUser() {
    let user = getUser();
      debugLog('--- Détails de l\'utilisateur ---');
      debugLog(`Nom : ${user.nom}`);
      debugLog(`Prénom : ${user.prenom}`);
      debugLog(`Email : ${user.email}`);
      debugLog(`Jeu courant : ${user.jeuCourant}`);
      debugLog(`Catégorie courante : ${user.categorieCourante}`);
      debugLog(`Catégorie courante id : ${user.categorieCouranteId}`);
      debugLog(`Avatar : ${user.avatar}`);
      debugLog(`Mots : ${user.mots.length} mots enregistrés`);
      user.mots.forEach(m => debugLog(`Mot: ${m[1]}, Genre: ${m[2]}, Correct: ${m[3]}, Incorrect: ${m[4]}`));
  }

  
  

  function afficherCategorie(game) {
    user = getUser();
    const categorieCourante = user.categorieCourante;
    
    const categorieElement = document.getElementById('affichage-categorie');

    if (categorieCourante) {
        categorieElement.textContent = `${game} : ${categorieCourante}`;
        debugLog(`Catégorie affichée : ${categorieCourante}`);
    } else {
        categorieElement.textContent = 'Space Invader : Non définie';
        debugLog('Aucune catégorie définie.');
    }
}

function getCategorieId() {
    user = getUser();
    const categorieId = user.categorieCouranteId;

    if (categorieId > 0) {
        return categorieId;
    } else {
        return 3;
    }
}


  function userLink(jeu = null, categorie = null, categorieId = null) {
    let user = getUser();
    // Vérifier si le jeu ou la catégorie est passé en paramètre
    if (jeu) {
        //sessionStorage.setItem('jeuCourant', jeu);
        //setJeu(jeu);
        
        user.jeuCourant = jeu;
        debugLog(`Jeu courant mis à jour : ${jeu}`);
        
        console.log('jeu : ' + jeu);
    }
    if (categorie) {
        //sessionStorage.setItem('categorieCourante', categorie);
        //setCategorie(categorie);
        user.categorieCourante = categorie;
        user.categorieCouranteId = categorieId;
        debugLog(`Catégorie courante mise à jour : ${categorie}`);
        console.log('categorie : ' + categorie);
    }
    saveThisUser(user);
    
    // Ajoute un léger délai pour assurer le stockage avant la redirection
    setTimeout(() => {

        // Récupérer les valeurs depuis le sessionStorage
        const jeuCourant = user.jeuCourant;
        const categorieCourante = user.categorieCourante;
        //const categorieCouranteId = user.categorieCouranteId;
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
    }, 300); // ⬅️ Délai de 100ms pour laisser le temps au stockage
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
  window.isConnected = isConnected;
  window.getUser = getUser;
  window.checkConnection = checkConnection;
  window.updateUser = updateUser;
  window.saveThisUser = saveThisUser;
  window.saveUser = saveUser;
  window.vireTout = vireTout;
  window.getCategorieId = getCategorieId;
});
