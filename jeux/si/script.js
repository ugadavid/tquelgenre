import { Game } from './game.js';
import { KeyboardManager } from './KeyboardManager.js';

alert("start");

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();

    const keyboardManager = new KeyboardManager(game);
});

