document.addEventListener('DOMContentLoaded', function() {
  // Crée et insère le conteneur pour le debug
  const debugContainer = document.createElement('div');
  debugContainer.id = 'debug-container';
  debugContainer.style.position = 'fixed';
  debugContainer.style.bottom = '10px';
  debugContainer.style.right = '10px';
  debugContainer.style.width = '450px';
  debugContainer.style.maxHeight = '300px';
  debugContainer.style.overflowY = 'auto';
  debugContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  debugContainer.style.color = '#fff';
  debugContainer.style.padding = '10px';
  debugContainer.style.fontFamily = 'monospace';
  debugContainer.style.fontSize = '12px';
  debugContainer.style.borderRadius = '5px';
  debugContainer.style.zIndex = '9999';
  debugContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  debugContainer.style.transition = 'opacity 0.5s';
  debugContainer.style.opacity = '0.8';

  // Ajoute un bouton pour fermer le debug
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '5px';
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.color = '#fff';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '16px';
  closeButton.onclick = () => debugContainer.style.display = 'none';
  debugContainer.appendChild(closeButton);

  document.body.appendChild(debugContainer);

  // Fonction pour ajouter un message dans le debug
  window.debugLog = function(message) {
      const log = document.createElement('div');
      log.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      debugContainer.appendChild(log);

      // Scrolle vers le bas pour voir le dernier message
      debugContainer.scrollTop = debugContainer.scrollHeight;

      // Limite le nombre de messages visibles
      if (debugContainer.childElementCount > 20) {
          debugContainer.removeChild(debugContainer.children[1]); // On enlève les plus anciens
      }
  };

  // Optionnel : message initial
  debugLog('Debug ready!');
});
