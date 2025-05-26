// Inicializa Firebase (mesma config do index.html)
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

let moedas = 0;
let estoque = {
  bolaNike: 1,
  jogos: 1,
  educacao: 1,
  horta: 1,
  jogosVirtuais: 1,
  balas: 300,
  pirulito: 100,
  cinema: 1
};

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

// Verifica se o usuário está logado ao carregar a página
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('nome-usuario').innerText = user.email || 'Usuário';
    carregarProdutos();
    atualizarTela();
  } else {
    // Se não estiver logado, redireciona para login
    window.location.href = 'index.html';
  }
});

// Função para logout
function logout() {
  auth.signOut().then(() => {
    localStorage.removeItem('usuario_logado');
    window.location.href = 'index.html';
  });
}

// Função para ganhar moedas
function ganharMoeda() {
  moedas++;
  atualizarTela();
}

// Função para atualizar a tela de saldo e atualizar botões
function atualizarTela() {
  document.getElementById('total-moedas').innerText = moedas;

  // Atualiza os botões de compra: ativa/desativa conforme moedas e estoque
  produtos.forEach(prod => {
    const btn = document.getElementById('btn-' + prod.nome);
    if (btn) {
      btn.disabled = moedas < prod.preco || estoque[prod.nome] <= 0;
    }
  });
}

// Função para comprar um produto
function comprarProduto(preco, produto) {
  if (moedas >= preco && estoque[produto] > 0) {
    moedas -= preco;
    estoque[produto]--;
    atualizarTela();
    alert('Você comprou ' + produto);
  } else {
    alert('Não há moedas suficientes ou estoque insuficiente');
  }
}

// Função para carregar produtos na tela
function carregarProdutos() {
  const container = document.getElementById('product-list');
  produtos.forEach(prod => {
    const div = document.createElement('div');
    div.classList.add('product');
    div.innerHTML = `
      <h4>${prod.nome}</h4>
      <p>Preço: ${prod.preco} Mrcoin</p>
      <p>Estoque: ${estoque[prod.nome]}</p>
      <button id="btn-${prod.nome}" onclick="comprarProduto(${prod.preco}, '${prod.nome}')">Comprar</button>
    `;
    container.appendChild(div);
  });
}
