// Fonction pour mettre à jour la barre de progression
function updateProgressBar() {
  const progress = ((currentTextIndex + 1) / texts.length) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
  document.getElementById('progress-bar').setAttribute('aria-valuenow', progress);
}
