import { Word } from './Word.js';

// Classe gérant une liste de mots
export class WordManager {
    constructor() {
        this.mots = [];
    }
  
    // Ajouter un mot à la liste
    ajouterMot(mot) {
        if (mot instanceof Word) {
            this.mots.push(mot);
        } else {
            console.error("L'objet doit être une instance de Mot.");
        }
    }
  
    // Supprimer un mot de la liste
    supprimerMot(texte) {
        this.mots = this.mots.filter(mot => mot.texte !== texte);
    }
  
    // Récupérer un mot aléatoire
    obtenirMotAleatoire() {
        if (this.mots.length === 0) return null;
        const index = Math.floor(Math.random() * this.mots.length);
        return this.mots[index];
    }
  
    // Filtrer les mots par catégorie
    filtrerParCategorie(id_categorie) {
        return this.mots.filter(mot => mot.id_categorie === id_categorie);
    }
  
    async loadWordsFromFile() {
        try {
            const response = await fetch('words.txt');
            const text = await response.text();
            const words = text.split('\n').map(line => {
                const [texte, article] = line.split(',').map(item => item.trim());
                return texte && article ? new Word(texte, article) : null;
            }).filter(Boolean);
            return words; // Retourne une promesse avec les mots
        } catch (error) {
            console.error('Erreur lors du chargement des mots :', error);
            return []; // Retourne une liste vide en cas d'erreur
        }
    }


    // Charger les mots depuis l'API
    async loadWordsFromAPI(id_categorie) {
        try {
            alert("Appel de l'API->loadWordsFromAPI("+id_categorie+")")
            const response = await fetch(`https://tqgapi.skys.fr/api/getWords.php?categorieId=${encodeURIComponent(id_categorie)}`);
            const wordsData = await response.json();
        
            if (wordsData.error) {
                console.error("Erreur API :", wordsData.error);
                return [];
            }
        
            this.mots = wordsData.map(data => new Word(data.mot, data.article, data.id_categorie, data.id_mot));
            return this.mots; // Retourne la liste des mots chargés
        } catch (error) {
            console.error('Erreur lors du chargement des mots :', error);
            return [];
        }
    }
}
