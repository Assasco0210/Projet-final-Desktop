   const API_URL = "https://upbeat-vagarious-casen.ngrok-free.dev/api/student-login";

   // Vérification immédiate d'Axios global au chargement du script (pour débogage)
   if (typeof axios === 'undefined') {
     console.error("❌ Axios n'est pas chargé ! Vérifiez le script CDN dans le HTML.");
     alert("Erreur : Axios non disponible. Rechargez l'app.");
   } else {
     console.log("✅ Axios global chargé avec succès (version:", axios.VERSION || "inconnue", ")");
   }

   // Fonction de login pour les étudiants (mise à jour pour stocker en localStorage)
   async function loginStudent() {
     const email = document.getElementById("email").value.trim();
     const password = document.getElementById("password").value.trim();

     // Validation des entrées
     if (!email || !password) {
       alert("⚠️ Veuillez remplir tous les champs !");
       return;
     }

     // Vérification Axios avant l'appel (redondante mais sûre)
     if (typeof axios === 'undefined') {
       console.error("❌ Axios non disponible dans loginStudent.");
       alert("Erreur : Axios non chargé. Vérifiez la console.");
       return;
     }

     try {
       console.log("Tentative de connexion étudiant pour l'email:", email); // Log de débogage
       console.log("URL API utilisée:", API_URL); // Confirme le serveur distant

       const response = await axios.post(API_URL, {
         email: email,
         password: password,
       });

       console.log("Réponse API login reçue:", response.data); // Log de la réponse (CRUCIAL pour vérifier la structure)

       if (response.data.success) {
         // STOCKAGE EN LOCALSTORAGE (NOUVEAU !)
         const student = response.data.student; // Ou response.data.eleve si différent
         if (student && student.id) { // Vérifiez les champs exacts via le log ci-dessus
           localStorage.setItem('studentId', student.id); // ID pour fetchSeances
           localStorage.setItem('studentName', student.nom || student.name); // Nom pour affichage
           console.log("✅ Données étudiant stockées :", {
             studentId: student.id,
             studentName: student.nom || student.name
           });
         } else {
           console.error("❌ Structure réponse inattendue : pas de student.id");
           alert("⚠️ Erreur : Données étudiant incomplètes dans la réponse API.");
           return;
         }

         alert("Connexion réussie ✅ Bienvenue " + (student.nom || "Étudiant"));
         // Redirection vers la page d'accueil étudiant
         window.location.href = "AcceuilE.html";
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

   // Fonction logout (si pas déjà présente ; sinon, gardez-la dans EmploiE.js)
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
   