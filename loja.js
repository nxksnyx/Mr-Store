const firebaseConfig = {
  apiKey: "AIzaSyBFiGU-blNt7XFO9cjYPoWaPP-c5EEItfc",
  authDomain: "mrstore-d429f.firebaseapp.com",
  projectId: "mrstore-d429f",
  storageBucket: "mrstore-d429f.appspot.com",
  messagingSenderId: "310913725702",
  appId: "1:310913725702:web:22775b2fa034b0697e1a87"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let usuarioAtual = null;
let moedas = 0;
let estoque = {};
let produtos = [
  { nome: 'bolaNike', preco: 5000 },
  { nome: 'jogos', preco: 1000 },
  { nome: 'educacao', preco: 1000 },
  { nome: 'horta', preco: 1000 },
  { nome: 'jogosVirtuais', preco: 1000 },
  { nome: 'balas', preco: 10 },
  { nome: 'pirulito', preco: 20 },
  { nome: 'cinema', preco: 1000 }
];

auth.onAuthStateChanged(user => {
  if (user) {
    usuarioAtual = user;
    document.getElementById('nome-usuario').innerText = user.email || 'Usuário';

    // Carrega dados do Firestore
    db.collection('usuarios').doc(user.uid).onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        moedas = data.moedas || 0;
        estoque = data.estoque || {};

        if (Object.keys(estoque).length === 0) {
          estoque = {
            bolaNike: 1,
            jogos: 1,
            educacao: 1,
            horta: 1,
            jogosVirtuais: 1,
            balas: 300,
            pirulito: 100,
            cinema: 1
          };
          salvarDados();
        }

        carregarProdutos();
        atualizarTela();
      }
    });

  } else {
    window.location.href = 'index.html';
  }
});

function salvarDados() {
  db.collection('usuarios').doc(usuarioAtual.uid).set({
    moedas: moedas,
    estoque: estoque
  });
}

function ganharMoeda() {
  moedas++;
  salvarDados();
}

function atualizarTela() {
  document.getElementById('total-moedas').innerText = moedas;

  produtos.forEach(prod => {
    const btn = document.getElementById('btn-' + prod.nome);
    if (btn) {
      const disponivel = estoque[prod.nome] || 0;
      btn.disabled = moedas < prod.preco || disponivel <= 0;
    }
  });
}

function comprarProduto(preco, produto) {
  const disponivel = estoque[produto] || 0;
  if (moedas >= preco && disponivel > 0) {
    moedas -= preco;
    estoque[produto] = disponivel - 1;
    salvarDados();
    alert('Você comprou ' + produto);
  } else {
    alert('Não há moedas suficientes ou estoque insuficiente');
  }
}

function carregarProdutos() {
  const container = document.getElementById('product-list');
  container.innerHTML = '<h3>Produtos disponíveis</h3>';
  produtos.forEach(prod => {
    const disponivel = estoque[prod.nome] || 0;

    const div = document.createElement('div');
    div.classList.add('product');
    div.innerHTML = `
      <h4>${prod.nome}</h4>
      <p>Preço: ${prod.preco} Mrcoin</p>
      <p>Estoque: ${disponivel}</p>
      <button id="btn-${prod.nome}" onclick="comprarProduto(${prod.preco}, '${prod.nome}')">Comprar</button>
    `;
    container.appendChild(div);
  });
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
}
