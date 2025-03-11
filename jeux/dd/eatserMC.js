function showMinecraftAchievement() {
  let achievement = document.getElementById("minecraft-achievement");

  // Jouer le son XP de Minecraft
  let audio = new Audio("../common/achievement.mp3");
  audio.play();

  // Afficher l'achievement
  achievement.style.right = "20px";

  // Animer la barre d'XP
  setTimeout(() => {
      achievement.querySelector(".xp-bar::after").style.width = "100%";
  }, 100);

  // 🎮💥 Particules vertes au centre de l’écran
  spawnParticles(window.innerWidth / 2, window.innerHeight / 2);

  // Cacher après 4 secondes
  setTimeout(() => {
      achievement.style.right = "-300px";
      achievement.querySelector(".xp-bar::after").style.width = "0%";
  }, 4000);
}

function spawnParticles(x, y) {
  const container = document.getElementById("particle-container");

  for (let i = 0; i < 10; i++) {  // Génère 10 particules
      let particle = document.createElement("div");
      particle.classList.add("particle");

      // Position de départ
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      // Mouvement aléatoire
      let xMove = (Math.random() - 0.5) * 60;  // Mouvement horizontal aléatoire
      let yMove = Math.random() * -80;  // Monte plus ou moins haut
      particle.style.transform = `translate(${xMove}px, ${yMove}px)`;

      // Ajout au DOM
      container.appendChild(particle);

      // Suppression après animation
      setTimeout(() => {
          particle.remove();
      }, 1000);
  }
}