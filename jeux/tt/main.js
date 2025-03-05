// main.js
import { FillInTheBlanksGame } from './FillInTheBlanksGame.js';


//  Récupérer le categorieId depuis sessionManager
let user = sessionStorage.getItem('user');
if (user) {
    user = JSON.parse(user);
}
let categorieId = user.categorieCouranteId;

console.log('TOTO');

let file = 'text.txt';
switch (categorieId) {
    case 2:
        file = 'text_2.txt';
        break;
    case 3:
        file = 'text_3.txt';
        break;
    case 6:
        file = 'text_6.txt';
        break;
    case 7:
        file = 'text_7.txt';
        break;
    case 9:
        file = 'text_9.txt';
        break;
    case 14:
        file = 'text_14.txt';
        break;
    case 22:
        file = 'text_22.txt';
        break;
    case 26:
        file = 'text_26.txt';
        break;
    default:
        file = 'text.txt';
        break;
    
}


// Assure-toi que le chemin vers ton fichier texte est correct
const game = new FillInTheBlanksGame(file);
game.init();
