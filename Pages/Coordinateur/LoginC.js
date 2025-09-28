const API_URL = "https://upbeat-vagarious-casen.ngrok-free.dev/api/coordinator-login";

// Vérification immédiate d'Axios global au chargement du script (pour débogage)
if (typeof axios === 'undefined') {
  console.error("❌ Axios n'est pas chargé ! Vérifiez le script CDN dans le HTML.");
  alert("Erreur : Axios non disponible. Rechargez l'app.");
} else {
  console.log(" Axios global chargé avec succès (version:", axios.VERSION || "inconnue", ")");
}

// Fonction de login pour les coordinateurs (appelée depuis le formulaire HTML)
async function loginCoordinator() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validation des entrées
  if (!email || !password) {
    alert("⚠️ Veuillez remplir tous les champs !");
    return;
  }

  // Vérification Axios avant l'appel (redondante mais sûre)
  if (typeof axios === 'undefined') {
    console.error("❌ Axios non disponible dans loginCoordinator.");
    alert("Erreur : Axios non chargé. Vérifiez la console.");
    return;
  }

  try {
    console.log("Tentative de connexion coordinateur pour l'email:", email); // Log de débogage
    console.log("URL API utilisée:", API_URL); // Confirme le serveur distant

    const response = await axios.post(API_URL, {
      email: email,
      password: password,
    });

    console.log("Réponse API reçue:", response.data); // Log de la réponse

    if (response.data.success) {
      alert("Connexion réussie  Bienvenue " + response.data.coordinator); // Adapté pour 'coordinator.nom' (ajustez si différent)
      // Redirection vers la page d'accueil coordinateur
      window.location.href = "AcceuilC.html";
    } else {
      alert("❌ Identifiants incorrects");
    }
  } catch (error) {
    console.error("Erreur API détaillée :", error); // Log complet pour débogage
    if (error.response) {
      // Erreur du serveur (ex. : 4xx/5xx)
      alert("❌ Erreur serveur : " + (error.response.data.message || "Identifiants invalides"));
    } else if (error.request) {
      // Pas de réponse (réseau/timeout)
      alert("❌ Impossible de se connecter au serveur (vérifiez votre internet ou l'URL)");
    } else {
      // Erreur locale (ex. : syntaxe)
      alert("❌ Erreur inattendue : " + error.message);
    }
  }
}
function logout() {
  console.log("🔄 Tentative de déconnexion...");

  if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
    localStorage.clear(); // Efface tout, y compris studentId et studentName
    console.log("✅ Session effacée (localStorage cleared).");
    window.location.href = "index.html";
  } else {
    console.log("❌ Déconnexion annulée par l'utilisateur.");
  }
}

