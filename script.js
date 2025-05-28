<!-- Coloque no topo do seu HTML -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
  import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

  const firebaseConfig = {
  apiKey: "AIzaSyBFiGU-blNt7XFO9cjYPoWaPP-c5EEItfc",
  authDomain: "mrstore-d429f.firebaseapp.com",
  projectId: "mrstore-d429f",
  storageBucket: "mrstore-d429f.firebasestorage.app",
  messagingSenderId: "310913725702",
  appId: "1:310913725702:web:22775b2fa034b0697e1a87"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Função de Cadastro
  async function fazerCadastro() {
    const email = document.getElementById('cadastro-username').value;
    const senha = document.getElementById('cadastro-password').value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        mrcoins: 100,
        admin: false // Por padrão, não é admin
      });

      alert("Cadastro realizado com sucesso!");
      window.location.href = "loja.html";
    } catch (error) {
      alert("Erro no cadastro: " + error.message);
    }
  }

  // Função de Login
  async function fazerLogin() {
    const email = document.getElementById('login-username').value;
    const senha = document.getElementById('login-password').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const dados = userSnap.data();

        if (dados.admin === true) {
          window.location.href = "painel.html";
        } else {
          window.location.href = "loja.html";
        }
      } else {
        alert("Usuário não encontrado no banco de dados.");
      }
    } catch (error) {
      alert("Erro no login: " + error.message);
    }
  }

  // Funções para exibir telas
  window.mostrarCadastro = function () {
    document.getElementById('cadastro-container').style.display = 'block';
    document.getElementById('login-container').style.display = 'none';
  }

  window.mostrarLogin = function () {
    document.getElementById('cadastro-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
  }

  // Expor funções no escopo global
  window.fazerCadastro = fazerCadastro;
  window.fazerLogin = fazerLogin;
</script>
