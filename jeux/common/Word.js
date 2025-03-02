// Classe représentant un mot
export class Word {
  constructor(texte, article = null, id_categorie = null, id_mot = null) {
    this.id_mot = id_mot;  
    this.texte = texte;
    this.article = article;
    this.id_categorie = id_categorie;
  }
}