// main.js
import { DragAndDropGame } from './DragAndDropGame.js';

// Par exemple, si tu souhaites charger les mots d'une catégorie particulière,
// tu peux passer un identifiant de catégorie. Sinon, passe null ou omets le paramètre.
const game = new DragAndDropGame(1);
game.init();
