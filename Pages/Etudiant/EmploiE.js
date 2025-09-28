const API_URL = "https://upbeat-vagarious-casen.ngrok-free.dev/api/seances  ";

// Vérification immédiate d'Axios global au chargement du script (pour débogage)
if (typeof axios === 'undefined') {
  console.error("❌ Axios n'est pas chargé ! Vérifiez le script CDN dans le HTML.");
  alert("Erreur : Axios non disponible. Rechargez l'app.");
} else {
  console.log("✅ Axios global chargé avec succès (version:", axios.VERSION || "inconnue", ")");
}

// Fonction pour récupérer et afficher l'emploi du temps
async function fetchSeances() {
  const studentId = localStorage.getItem('studentId');
  const studentName = localStorage.getItem('studentName');

  // Vérification de la session
  if (!studentId) {
    console.error("❌ Aucun studentId trouvé dans localStorage. Redirection vers login.");
    alert("Session expirée. Veuillez vous reconnecter.");
    window.location.href = "LoginE.html";
    return;
  }

  // Affichage du nom de l'étudiant
  const studentNameElement = document.getElementById('student-name');
  if (studentNameElement) {
    studentNameElement.textContent = studentName || "Étudiant";
  }

  console.log("Récupération des séances pour studentId:", studentId);

  try {
    const response = await axios.get(API_URL, {
      params: {
        studentId: studentId,
      },
    });

    console.log("Réponse API seances reçue:", response.data);

    if (response.data.success) {
      const emploiDuTemps = response.data.emploiDuTemps; // Structure basée sur le code PHP
      populateTimetable(emploiDuTemps);
    } else {
      alert("❌ Erreur : " + (response.data.message || "Impossible de récupérer l'emploi du temps"));
    }
  } catch (error) {
    console.error("Erreur API seances :", error);
    if (error.response) {
      alert("❌ Erreur serveur : " + (error.response.data.message || "Problème de récupération des données"));
    } else if (error.request) {
      alert("❌ Impossible de se connecter au serveur (vérifiez votre internet)");
    } else {
      alert("❌ Erreur inattendue : " + error.message);
    }
  } finally {
    // Masquer l'indicateur de chargement
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
  }
}

// Fonction pour peupler le tableau avec les données
function populateTimetable(emploiDuTemps) {
  const timetable = document.getElementById('timetable');
  const thead = timetable.querySelector('thead tr');
  const rowMatin = document.getElementById('row-matin');
  const rowSoir = document.getElementById('row-soir');

  // Vider les colonnes dynamiques existantes (sauf la première)
  while (thead.children.length > 1) {
    thead.removeChild(thead.lastChild);
  }
  while (rowMatin.children.length > 1) {
    rowMatin.removeChild(rowMatin.lastChild);
  }
  while (rowSoir.children.length > 1) {
    rowSoir.removeChild(rowSoir.lastChild);
  }

  // Trier les dates
  const dates = Object.keys(emploiDuTemps).sort();

  // Ajouter les colonnes pour chaque date
  dates.forEach(date => {
    const th = document.createElement('th');
    th.textContent = formatDate(date);
    thead.appendChild(th);

    // Cellule matin
    const tdMatin = document.createElement('td');
    const matinSeances = emploiDuTemps[date].matin;
    tdMatin.innerHTML = matinSeances.length > 0 ? matinSeances.map(seance => formatSeance(seance)).join('<br>') : '<span class="empty-course">Aucun cours</span>';
    rowMatin.appendChild(tdMatin);

    // Cellule soir
    const tdSoir = document.createElement('td');
    const soirSeances = emploiDuTemps[date].soir;
    tdSoir.innerHTML = soirSeances.length > 0 ? soirSeances.map(seance => formatSeance(seance)).join('<br>') : '<span class="empty-course">Aucun cours</span>';
    rowSoir.appendChild(tdSoir);
  });
}

// Fonction pour formater une date (JJ/MM)
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

// Fonction pour formater une séance
function formatSeance(seance) {
  const moduleName = seance.module ? seance.module.nom : 'Module inconnu';
  const enseignantName = seance.enseignant ? seance.enseignant.nom : 'Enseignant inconnu';
  return `<strong>${moduleName}</strong><br>${enseignantName}`;
}

// Fonction logout (même que dans LoginE.js)
function logout() {
  console.log("🔄 Tentative de déconnexion...");

  if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
    localStorage.clear(); // Efface tout, y compris studentId et studentName
    console.log("✅ Session effacée (localStorage cleared).");
    window.location.href = "LoginE.html";
  } else {
    console.log("❌ Déconnexion annulée par l'utilisateur.");
  }
}

// Appeler fetchSeances au chargement de la page
document.addEventListener('DOMContentLoaded', fetchSeances);
