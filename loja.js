// ====== CONFIG FIREBASE ======
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBFiGU-blNt7XFO9cjYPoWaPP-c5EEItfc",
    authDomain: "mrstore-d429f.firebaseapp.com",
    projectId: "mrstore-d429f",
    storageBucket: "mrstore-d429f.appspot.com",
    messagingSenderId: "310913725702",
    appId: "1:310913725702:web:22775b2fa034b0697e1a87"
  });
}

const db = firebase.firestore();

// ====== VARIÁVEIS GLOBAIS ======
let userId = null;
let userEmail = null;
let userSala = null;
let userNome = null;
let moedas = 0;
let estoqueGlobal = {};
let precosGlobal = {};
let investimentosSala = {};

const produtosColetivos = [
  "aula_jogos", "aula_ping", "aula_fisica", "aula_cinema", "aula_horta", "jogos_virtuais"
];

const produtosInfo = {
  fone_natal: { nome: "Fone de natal", imagem: "https://imgur.com/pEXKElj.jpeg" },
  kit_caderno: { nome: "Kit caderno", imagem: "https://imgur.com/onYlyeW.jpeg" },
  kit_mouse_fone: { nome: "Kit mouse e fone", imagem: "https://imgur.com/tHwYvf1.jpeg" },
  kit_pulseira: { nome: "Kit pulseira", imagem: "https://imgur.com/Olxwu5V.jpeg" },
  livro: { nome: "Livro", imagem: "https://imgur.com/DONpY3Y.jpeg" },
  teclado_mouse: { nome: "Teclado e Mouse Maxtro", imagem: "https://i.imgur.com/UBqi1ni.jpeg" },
  mouse_gamer: { nome: "Mouse Gamer", imagem: "https://i.imgur.com/kpcOYTX.jpeg" },
  kit_bobbie: { nome: "Kit copo bobbie goods e lápis de cor", imagem: "https://i.imgur.com/THsU3gP.jpeg" },
  kit_escolar: { nome: "Kit escolar", imagem: "https://i.imgur.com/hJ6WOdw.jpeg" },
  kit_caderno_caneta: { nome: "Kit caderno, caneta e lápis", imagem: "https://i.imgur.com/wceuyD4.jpeg" },
  kit_palavras_regua: { nome: "Kit caça palavras e régua", imagem: "https://i.imgur.com/3SSIhmY.jpeg" },
  kit_doces: { nome: "Kit doces", imagem: "https://i.imgur.com/rpIGmVB.jpeg" },
  fini: { nome: "Fini", imagem: "https://i.imgur.com/8Nwj3tF.jpeg" },
  pipoca: { nome: "Pipoca Doce", imagem: "https://i.imgur.com/3mn1jWo.jpeg" },
  harry_potter: { nome: "Harry Potter e a Ordem da Fênix", imagem: "https://i.imgur.com/u39XPhX.jpeg" },
  narizinho: { nome: "Reinações de Narizinho", imagem: "https://i.imgur.com/XKfNUFl.jpeg" },
};

// ====== LOGIN POR RA ======

const raLogado = localStorage.getItem("usuarioLogado");

if (!raLogado) {
  alert("Nenhum usuário logado.");
  window.location.href = "index.html";
}

// Buscar documento do usuário pelo RA
db.collection("users").where("ra", "==", raLogado).get().then(snapshot => {

  if (snapshot.empty) {
    alert("Usuário não encontrado.");
    window.location.href = "index.html";
    return;
  }

  const doc = snapshot.docs[0];
  userId = doc.id;
  const data = doc.data();

  userEmail = data.email;
  userNome = data.nome || raLogado;
  moedas = data.moedas || 0;
  userSala = data.sala || null;

  const nomeUsuarioEl = document.getElementById("nome-usuario");
  if (nomeUsuarioEl) nomeUsuarioEl.innerText = userNome;

  const gerenciarBtn = document.getElementById("btn-gerenciar-notas");
  if (gerenciarBtn && userEmail === "sandrachefa@gmail.com") {
    gerenciarBtn.style.display = "inline-block";
  }

  document.getElementById("total-moedas").innerText = moedas;
  document.getElementById("nota-projeto1").innerText = data.projeto1 ?? "-";
  document.getElementById("nota-projeto2").innerText = data.projeto2 ?? "-";
  document.getElementById("nota-tecnologia").innerText = data.tecnologia ?? "-";
  document.getElementById("nota-paulista").innerText = data.paulista ?? "-";

  iniciarLoja();
});


// ====== INICIAR LOJA ======
function iniciarLoja() {

  if (!userSala) {
    alert("Sala não definida.");
    return;
  }

  // Estoque e preços
  db.collection("loja").doc("config").onSnapshot(lojaDoc => {
    if (lojaDoc.exists) {
      const lojaData = lojaDoc.data();
      estoqueGlobal = lojaData.estoque || {};
      precosGlobal = lojaData.preco || {};
      renderizarProdutos();
    }
  });

  // Investimentos
  db.collection("salas").doc(userSala).onSnapshot(salaDoc => {
    if (salaDoc.exists) {
      investimentosSala = salaDoc.data().investimentos || {};
      renderizarProdutos();
    }
  });

  // Médias da sala
  db.collection("users").where("sala", "==", userSala).get().then(snapshot => {
    let somas = [0, 0, 0, 0];
    let cont = [0, 0, 0, 0];

    snapshot.forEach(doc => {
      const aluno = doc.data();
      if (aluno.projeto1 != null) { somas[0] += aluno.projeto1; cont[0]++; }
      if (aluno.projeto2 != null) { somas[1] += aluno.projeto2; cont[1]++; }
      if (aluno.tecnologia != null) { somas[2] += aluno.tecnologia; cont[2]++; }
      if (aluno.paulista != null) { somas[3] += aluno.paulista; cont[3]++; }
    });

    document.getElementById("media-projeto1").innerText = cont[0] ? (somas[0] / cont[0]).toFixed(1) : "-";
    document.getElementById("media-projeto2").innerText = cont[1] ? (somas[1] / cont[1]).toFixed(1) : "-";
    document.getElementById("media-tecnologia").innerText = cont[2] ? (somas[2] / cont[2]).toFixed(1) : "-";
    document.getElementById("media-paulista").innerText = cont[3] ? (somas[3] / cont[3]).toFixed(1) : "-";

    renderizarProdutos();
  });

  // Ranking
  carregarRankingPeriodo("semana", "aluno");
  carregarRankingPeriodo("semana", "sala");
  carregarRankingPeriodo("mes", "aluno");
  carregarRankingPeriodo("mes", "sala");
}


// ====== LOGOUT ======
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

function irParaGerenciarNotas() {
  window.location.href = "gerenciar_notas.html";
}


// ====== RENDERIZAR PRODUTOS ======
function renderizarProdutos() {
  const lista = document.getElementById("product-list");
  lista.innerHTML = "";

  Object.keys(produtosInfo).forEach(produtoId => {
    const info = produtosInfo[produtoId];
    const preco = precosGlobal[produtoId] || 0;
    const estoque = estoqueGlobal[produtoId] ?? 0;
    const investimento = investimentosSala[produtoId] || 0;

    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <h4>${info.nome}</h4>
      <img src="${info.imagem}" alt="${info.nome}">
      <p>
        ${produtosColetivos.includes(produtoId)
          ? `Investimento da Sala: ${investimento}/1000<br>Estoque: ${estoque}`
          : `Preço: ${preco} moedas<br>Estoque: ${estoque}`}
      </p>
      <button ${(!produtosColetivos.includes(produtoId) && moedas < preco) ? "disabled" : ""}
        onclick="comprarProduto('${produtoId}')">
        ${produtosColetivos.includes(produtoId) ? "Investir" : "Comprar"}
      </button>
    `;

    lista.appendChild(div);
  });
}


// ====== COMPRAR PRODUTO ======
function comprarProduto(produtoId) {
  const preco = precosGlobal[produtoId] || 0;

  // -------- PRODUTO COLETIVO --------
  if (produtosColetivos.includes(produtoId)) {

    if (moedas <= 0) return alert("Você não tem moedas suficientes para investir.");

    const investimentoAtual = investimentosSala[produtoId] || 0;
    const falta = 1000 - investimentoAtual;

    if (falta <= 0) return alert("Produto coletivo já concluído!");

    const input = prompt(`Quanto deseja investir? (máx: ${falta})`);
    if (!input) return;

    const valor = parseInt(input);
    if (isNaN(valor) || valor <= 0) return alert("Valor inválido.");
    if (valor > moedas) return alert("Você não tem moedas suficientes.");
    if (valor > falta) return alert("Esse valor ultrapassa o necessário.");

    const novoTotal = investimentoAtual + valor;

    db.collection("salas").doc(userSala).update({
      [`investimentos.${produtoId}`]: novoTotal
    });

    moedas -= valor;
    investimentosSala[produtoId] = novoTotal;

    db.collection("users").doc(userId).update({ moedas });
    document.getElementById("total-moedas").innerText = moedas;

    if (novoTotal >= 1000) {
      const estoqueAtual = estoqueGlobal[produtoId] || 0;

      if (estoqueAtual > 0) {
        estoqueGlobal[produtoId] = estoqueAtual - 1;

        db.collection("loja").doc("config").update({
          [`estoque.${produtoId}`]: estoqueGlobal[produtoId]
        });

        db.collection("salas").doc(userSala).update({
          [`investimentos.${produtoId}`]: 0
        });

        db.collection("logs").add({
          nome: userNome,
          sala: userSala,
          produto: produtoId,
          data: firebase.firestore.Timestamp.now()
        });

        alert("A sala concluiu a compra do produto coletivo!");
      } else {
        alert("O produto coletivo está esgotado.");
      }
    } else {
      alert(`Investimento de ${valor} moedas realizado.`);
    }

    renderizarProdutos();
    return;
  }

  // -------- PRODUTO INDIVIDUAL --------

  if (moedas < preco) return alert("Você não tem moedas suficientes.");
  if ((estoqueGlobal[produtoId] || 0) <= 0) return alert("Produto esgotado.");

  moedas -= preco;
  estoqueGlobal[produtoId]--;

  db.collection("users").doc(userId).update({ moedas });
  db.collection("loja").doc("config").update({
    [`estoque.${produtoId}`]: estoqueGlobal[produtoId]
  });

  db.collection("logs").add({
    nome: userNome,
    sala: userSala,
    produto: produtoId,
    data: firebase.firestore.Timestamp.now()
  });

  document.getElementById("total-moedas").innerText = moedas;

  alert("Compra realizada!");
  renderizarProdutos();
}


// ====== RANKING ======
function carregarRankingPeriodo(tipo, escopo) {
  const dias = tipo === "semana" ? 7 : 30;
  const limite = new Date();
  limite.setDate(limite.getDate() - dias);
  const timestamp = firebase.firestore.Timestamp.fromDate(limite);

  const containerId = `ranking-${tipo}-${escopo === "aluno" ? "alunos" : "salas"}`;
  const container = document.getElementById(containerId);
  if (!container) return;

  db.collection("logs")
    .where("data", ">=", timestamp)
    .get()
    .then(snapshot => {

      if (snapshot.empty) {
        container.innerHTML = "<p>Nenhum dado.</p>";
        return;
      }

      const acumulado = {};

      snapshot.forEach(doc => {
        const log = doc.data();
        const chave = escopo === "aluno" ? log.nome : log.sala;
        acumulado[chave] = (acumulado[chave] || 0) + 1;
      });

      const ranking = Object.entries(acumulado)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      let html = "<ol>";
      ranking.forEach(([nome, count]) => {
        html += `<li>${nome}: ${count} compra${count > 1 ? "s" : ""}</li>`;
      });
      html += "</ol>";

      container.innerHTML = html;
    });
}
