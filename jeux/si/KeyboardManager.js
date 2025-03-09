export class KeyboardManager {
    constructor(game, controlsMapping, controlDrawing) {
        this.game = game;
        this.controlsMapping = controlsMapping || this.getDefaultMapping();
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
        this.toggleButton = document.getElementById("toggle-keyboard-layout");
        this.closeButton = document.getElementById("close-layer");
        this.layout = sessionStorage.getItem("keyboardLayout") || "azerty";

        this.init();
    }

    // Renvoie le mapping par défaut en fonction du clavier
    getDefaultMapping() {
        if (sessionStorage.getItem("keyboardLayout") === "qwerty") {
            return {
                up: "w",
                down: "s",
                left: "a",
                right: "d",
                shootBlue: "k",
                shootPink: "m",
            };
        } else {
            return {
                up: "z",
                down: "s",
                left: "q",
                right: "d",
                shootBlue: "k",
                shootPink: "m",
            };
        }
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

        // Gestion du changement de clavier
        this.toggleButton.addEventListener("click", () => this.toggleKeyboardLayout());

        // Écoute des touches clavier
        document.addEventListener("keydown", (event) => this.handleKeyPress(event));

        // Gestion du bouton croix pour fermer le layer
        this.closeButton.addEventListener("click", () => {
            const layer = document.getElementById("controls-config");
            layer.style.display = "none";
        });
    }

    // Change de layout (AZERTY <-> QWERTY)
    toggleKeyboardLayout() {
        if (this.layout === "azerty") {
            this.layout = "qwerty";
            sessionStorage.setItem("keyboardLayout", "qwerty");
            this.controlsMapping = {
                up: "w",
                down: "s",
                left: "a",
                right: "d",
                shootBlue: "k",
                shootPink: "m",
            };
            this.toggleButton.textContent = "Passer en AZERTY";
        } else {
            this.layout = "azerty";
            sessionStorage.setItem("keyboardLayout", "azerty");
            this.controlsMapping = {
                up: "z",
                down: "s",
                left: "q",
                right: "d",
                shootBlue: "k",
                shootPink: "m",
            };
            this.toggleButton.textContent = "Passer en QWERTY";
        }
        this.displayControls();
        this.game.player.setControls(this.controlsMapping);
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
