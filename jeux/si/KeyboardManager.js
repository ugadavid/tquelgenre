export class KeyboardManager {
  constructor(game, controlsMapping, controlDrawing) {
      this.game = game;
      this.controlsMapping = controlsMapping || {
          up: "z",
          down: "s",
          left: "q",
          right: "d",
          shootBlue: "k",
          shootPink: "m",
      };
      this.controlDrawing = controlDrawing || {
          up: "▲",
          down: "▼",
          left: "◀",
          right: "▶",
          shootBlue: "Tire Bleu",
          shootPink: "Tire Rose",
      };
      this.controlButtons = {
          up: document.getElementById("up-control"),
          down: document.getElementById("down-control"),
          left: document.getElementById("left-control"),
          right: document.getElementById("right-control"),
          shootBlue: document.getElementById("shootBlue-control"),
          shootPink: document.getElementById("shootPink-control"),
      };
      this.awaitingKey = null;
      this.errorMessage = document.getElementById("error-message");

      this.init();
  }

  // Initialise les boutons et les événements
  init() {
      this.displayControls();

      // Ajouter les événements aux boutons
      Object.keys(this.controlButtons).forEach((action) => {
          this.controlButtons[action].addEventListener("click", () => {
              this.awaitingKey = action;
              this.controlButtons[action].textContent = "Appuyez sur une touche...";
          });
      });

      // Écoute des touches clavier
      document.addEventListener("keydown", (event) => this.handleKeyPress(event));
  }

  // Affiche les touches actuelles
  displayControls() {
      Object.keys(this.controlsMapping).forEach((action) => {
          this.controlButtons[action].textContent = `${this.controlDrawing[action]} (${this.controlsMapping[action]})`;
      });
  }

  // Gère l'appui sur une touche
  handleKeyPress(event) {
      if (this.awaitingKey) {
          const action = this.awaitingKey;

          // Vérifie si la touche est déjà utilisée
          if (Object.values(this.controlsMapping).includes(event.key)) {
              this.showError(`La touche "${event.key}" est déjà assignée à une autre action.`);
              return;
          }

          // Assigne la nouvelle touche
          this.controlsMapping[action] = event.key;
          this.controlButtons[action].textContent = `${this.controlDrawing[action]} (${event.key})`;
          this.awaitingKey = null;

          // Met à jour les contrôles du joueur via Game
          this.game.player.setControls(this.controlsMapping);
      }
  }

  // Affiche un message d'erreur
  showError(message) {
      this.errorMessage.textContent = message;
      this.errorMessage.classList.remove("hidden");
      setTimeout(() => this.errorMessage.classList.add("hidden"), 3000); // Cache après 3 secondes
  }
}
