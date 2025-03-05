// Charger le modal depuis un fichier externe
fetch('/modal.html')
.then(response => response.text())
.then(html => document.body.insertAdjacentHTML('beforeend', html))
.catch(error => console.error('Erreur lors du chargement du modal:', error));

function openModal(page) {

    // Générer un paramètre unique basé sur le timestamp
    const timestamp = new Date().getTime();
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        fetch(`/${page}?t=${timestamp}`)
    .then(response => response.text())
    .then(html => {
        document.getElementById('form-container').innerHTML = html;

        // 🛠️ Réattacher les événements après le chargement dynamique
        // 🛠️ Gérer dynamiquement les événements pour chaque formulaire
        const formLogin = document.getElementById("loginForm");
        const formInscription = document.getElementById("inscriptionForm");
        const formModifProfil = document.getElementById("modifProfilForm");
        

        if (formLogin) {
            formLogin.addEventListener("submit", function (e) {
                e.preventDefault(); // ❌ Bloque l'envoi classique du formulaire
                
                let email = document.getElementById("email").value;
                let password = document.getElementById("password").value;

                // 🛠️ Appel à l'API avec les identifiants
                fetch("https://tqgapi.skys.fr/api/api/api.php?action=login", {
                    method: "POST",
                    body: JSON.stringify({ email, password }), // ✅ Envoie des données en JSON
                    headers: { "Content-Type": "application/json" },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(data.user);
                        //alert("Connexion réussie !");
                        setTimeout(() => {
                            console.log("Contenu de data reçu :", JSON.stringify(data, null, 2));
                            updateUser(data.user);  // 🔄 Met à jour l'objet user dans sessionStorage
                            console.log("Utilisateur sauvegardé dans sessionStorage :", sessionStorage.getItem('user'));
                            showUser();  // 🔄 Affiche les informations de l'utilisateur

                            // 🔄 Attendre 100ms avant la redirection
                        setTimeout(() => {
                            window.location.href = data.user.admin == 1 ? "categorie.html" : "categorie.html";
                        }, 300);



                        }, 300);
                        
                        
                    } else {
                        alert("Erreur : " + data.error);
                    }
                })
                .catch(error => console.error("Erreur :", error));
            });
        }


        // 🔄 Gestion du formulaire d'inscription
        if (formInscription) {
            formInscription.addEventListener("submit", function (e) {
                e.preventDefault();

                let prenom = document.getElementById("prenom").value;
                let nom = document.getElementById("nom").value;
                let mail = document.getElementById("mail").value;
                let pwd = document.getElementById("pwd").value;
                
                fetch("https://tqgapi.skys.fr/api/api/api.php?action=register", {
                    method: "POST",
                    body: JSON.stringify({ prenom, nom, mail, pwd }),
                    headers: { "Content-Type": "application/json" },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Inscription réussie !");
                        closeModal();
                        openModal('popup_connexion.html');  // 🔄 Ouvrir la modale de connexion
                    } else {
                        alert("Erreur : " + data.error);
                    }
                })
                .catch(error => console.error("Erreur :", error));
            });
        }


        
        if (formModifProfil) {
            // 🔄 Remplir les champs du formulaire avec les données de sessionStorage
            const user = sessionStorage.getItem('user');
            if (user) {
                const profile = JSON.parse(user);
                document.querySelector('input[name="email"]').value = profile.email || '';
                document.querySelector('input[name="prenom"]').value = profile.prenom || '';
                document.querySelector('input[name="nom"]').value = profile.nom || '';
                document.querySelector('input[name="pwd"]').value = profile.pwd || '';
                console.log(profile.email);
                
                // 🔄 Sélectionner le genre si disponible
                if (profile.avatar) {
                    const genreInput = document.querySelector(`input[name="genre"][value="${profile.avatar}"]`);
                    if (genreInput) genreInput.checked = true;
                }
            }
        
            // 🔄 Gérer l'envoi du formulaire
            formModifProfil.addEventListener("submit", function (e) {
                e.preventDefault();  // ❌ Bloque l'envoi classique du formulaire
        
                const email = document.querySelector('input[name="email"]').value.trim();
                const prenom = document.querySelector('input[name="prenom"]').value.trim();
                const nom = document.querySelector('input[name="nom"]').value.trim();
                const pwd = document.querySelector('input[name="pwd"]').value.trim();
                const genre = document.querySelector('input[name="genre"]:checked')?.value || '';
        
                
                // 🔄 Appel à l'API pour modifier le profil
                fetch("https://tqgapi.skys.fr/api/api/api.php?action=updateProfile", {
                    method: "POST",
                    body: JSON.stringify({ prenom, nom, pwd, genre, email }),
                    headers: { "Content-Type": "application/json" },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Profil mis à jour avec succès !");
                        updateUser(data.user);  // 🔄 Met à jour les infos utilisateur dans sessionStorage
                        showUser();  // 🔄 Actualiser l'affichage du profil
                        closeModal();
                    } else {
                        alert("Erreur : " + data.error);
                    }
                })
                .catch(error => console.error("Erreur :", error));
            });
        }



    })
    .catch(error => console.error('Erreur lors du chargement:', error));

    }
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.getElementById('form-container').innerHTML = 'Chargement...';
    }
}

function closeOpenModal(page) {
    closeModal();
    openModal(page);
}