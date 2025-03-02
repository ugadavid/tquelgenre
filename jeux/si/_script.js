import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    // Game instancie Player et EnemyManager
    const game = new Game();
    game.init();

    // L'interface pour configurer les touches
    const controlsMapping = {
        up: "z",
        down: "s",
        left: "q",
        right: "d",
        shootBlue: "k",
        shootPink: "m",
    };

    const controlDrawing = {
        up: "▲",
        down: "▼",
        left: "◀",
        right: "▶",
        shootBlue: "Tire Bleu",
        shootPink: "Tire Rose",
    }


    const controlButtons = {
        up: document.getElementById("up-control"),
        down: document.getElementById("down-control"),
        left: document.getElementById("left-control"),
        right: document.getElementById("right-control"),
        shootBlue: document.getElementById("shootBlue-control"),
        shootPink: document.getElementById("shootPink-control"),
    };

    

      
      let awaitingKey = null;
      
      // Initial display of controls
      Object.keys(controlsMapping).forEach((action) => {
        controlButtons[action].textContent += ` (${controlsMapping[action]})`;
      });
      
      // Handle button click for remapping
      Object.keys(controlButtons).forEach((action) => {
        controlButtons[action].addEventListener("click", () => {
          awaitingKey = action;
          controlButtons[action].textContent = "Appuyez sur une touche...";
        });
      });
      
      // Capture keyboard input for remapping
      document.addEventListener("keydown", (event) => {
        const errorMessage = document.getElementById("error-message");

        if (awaitingKey) {
          const action = awaitingKey;

            // Vérifie si la touche est déjà utilisée
            if (Object.values(controlsMapping).includes(event.key)) {
            // Affiche un message d'erreur
            errorMessage.textContent = `La touche "${event.key}" est déjà assignée à une autre action.`;
            errorMessage.classList.remove("hidden");
            setTimeout(() => errorMessage.classList.add("hidden"), 3000); // Cache après 3 secondes
            return;
        }

        


          controlsMapping[action] = event.key;
          controlButtons[action].textContent = `${controlDrawing[action]} (${event.key})`;
          awaitingKey = null;
      
          // Update player's controls via Game
          game.player.setControls(controlsMapping);
        }
      });


});


