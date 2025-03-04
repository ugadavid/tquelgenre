// Charger le modal depuis un fichier externe
fetch('modal.html')
.then(response => response.text())
.then(html => document.body.insertAdjacentHTML('beforeend', html))
.catch(error => console.error('Erreur lors du chargement du modal:', error));

function openModal(page) {

    // Générer un paramètre unique basé sur le timestamp
    const timestamp = new Date().getTime();
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        fetch(`${page}?t=${timestamp}`)
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
                fetch("api/api/api.php?action=login", {
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
                            window.location.href = data.user.admin == 1 ? "tableau_de_bord.html" : "tableau_de_bord.html";
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
                
                fetch("api/api.php?action=register", {
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