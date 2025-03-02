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
            .then(html => document.getElementById('form-container').innerHTML = html)
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