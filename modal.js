// Charger le modal depuis un fichier externe
fetch('modal.html')
.then(response => response.text())
.then(html => document.body.insertAdjacentHTML('beforeend', html))
.catch(error => console.error('Erreur lors du chargement du modal:', error));

function openModal(modName) {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        fetch(modName)
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

function closeOpenModal(modName) {
    closeModal();
    openModal(modName);
}