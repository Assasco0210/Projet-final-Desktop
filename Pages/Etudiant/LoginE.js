// 🔹 Mets ici l'adresse de ton API
// Si ton serveur est local sur ton PC : "http://127.0.0.1:8000/api"
// Si ton serveur est sur un autre PC du réseau : "http://192.168.X.X:8000/api"
// Si ton serveur est en ligne : "https://monapi.monsite.com/api"
const API_BASE = "http://192.168.1.100/api";

async function studentLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Vérifier si email/mdp sont remplis
  if (!email || !password) {
    alert("⚠️ Veuillez entrer votre email et votre mot de passe.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/student-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    // Vérifier si la réponse est bien du JSON
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Réponse invalide du serveur.");
    }

    if (response.ok) {
      // ✅ Connexion réussie
      alert("Connexion réussie ✅");

      // Sauvegarder le token s’il existe
      if (data.token) {
        localStorage.setItem("student_token", data.token);
      }

      // Redirection vers la page accueil
      window.location.href = "AcceuilE.html";
    } else {
      // ❌ Erreur côté API
      alert(data.message || "Identifiants incorrects.");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("❌ Impossible de se connecter au serveur.\nVérifiez que l'API est bien démarrée et accessible.");
  }
}
