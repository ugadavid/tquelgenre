//import { addBadge } from './user.js';

class UserHardCode {
  // 🛠 URL de l'API (hardcodée)
  static API_URL = 'https://tqgapi.skys.fr/api/api/api2.php?action=updatebadge';


  // 🛠 Fonction statique pour ajouter un badge
  static async addBadgeToUser(email, badgeName) {
    // Construire les données à envoyer
    const data = JSON.stringify({
        email: email,
        badge: badgeName  // 🛠 On envoie directement le badgeName
    });

    try {
      // 🛠 Appel à l'API en mode POST
      const response = await fetch(UserHardCode.API_URL, {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json'
        },
        body: data
      });

      // 🛠 Vérifier la réponse
      const result = await response.json();
      if (result.success) {
        console.log(`✅ Badge '${badgeName}' ajouté avec succès pour ${email} !`);
        addBadge(badgeName);
      } else {
        console.error(`❌ Erreur lors de l'ajout du badge :`, result.error);
      }
    } catch (error) {
        console.error(`❌ Erreur réseau ou API :`, error);
    }
  }
  

}