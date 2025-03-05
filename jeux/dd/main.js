// main.js
import { DragAndDropGame } from './DragAndDropGame.js';

//  Récupérer le categorieId depuis sessionManager
let user = sessionStorage.getItem('user');
if (user) {
    user = JSON.parse(user);
}
let categorieId = user.categorieCouranteId || 2;

// Par exemple, si tu souhaites charger les mots d'une catégorie particulière,
// tu peux passer un identifiant de catégorie. Sinon, passe null ou omets le paramètre.
const game = new DragAndDropGame(categorieId);
game.init();
