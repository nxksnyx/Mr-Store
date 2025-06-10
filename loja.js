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

const auth = firebase.auth();
const db = firebase.firestore();

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
  bola: { nome: "Bola de Futebol", imagem: "https://i.imgur.com/W72fkUd.png" },
  bola_nike: { nome: "Bola da Nike", imagem: " " },
  bola_volei: { nome: "Bola de Volei", imagem: "https://i.imgur.com/utdBdq1.png" },
  bola_basquete: { nome: "Bola de Basquete", imagem: "https://i.imgur.com/hxSv0Ts.png" },
  aula_jogos: { nome: "Aula com jogos e brincadeiras na área externa", imagem: "https://i.imgur.com/rRKueT4.jpeg" },
  aula_ping: { nome: "Aula com jogos e brincadeiras no pátio", imagem: "https://i.imgur.com/o48S1TL.jpeg" },
  aula_fisica: { nome: "Aula extra de educação física", imagem: "https://jundiai.sp.gov.br/noticias/wp-content/uploads/sites/32/2018/11/emeb_marcos_gasparian-166.jpg" },
  aula_cinema: { nome: "Aula de Cinema com Pipoca na sala", imagem: "https://2.bp.blogspot.com/-goes4lu3wsQ/VTl7mzY2lpI/AAAAAAAAGR0/By2X6yTVvZk/s1600/crian%C3%A7as-filmes.jpg" },
  aula_horta: { nome: "Aula na Horta", imagem: "https://i.imgur.com/EDqWAVf.jpeg" },
  jogos_virtuais: { nome: "Aula com Jogos Virtuais", imagem: "https://img.freepik.com/fotos-gratis/criancas-da-escola-usando-tablet-digital-em-sala-de-aula_107420-57955.jpg" },
  balas: { nome: "Balas", imagem: "https://a-static.mlcdn.com.br/800x560/pacote-bala-7-belo-framboesa-600g-arcor/produtosdemaquiagem/10761p/370cbc11ef578c1c36f9c6bc2996a45b.jpg" },
  tesoura: { nome: "Tesoura", imagem: "https://i.imgur.com/3ncFBwQ.jpeg" },
  harry_potter: { nome: "Harry Potter e a Ordem da Fênix", imagem: "https://i.imgur.com/u39XPhX.jpeg" },
  fone: { nome: "Fone", imagem: "https://i.imgur.com/WnqnNQt.jpeg" },
  fone_2: { nome: "Fone", imagem: "https://i.imgur.com/Fmhf6YQ.jpeg" },
  narizinho: { nome: "Reinações de Narizinho", imagem: "https://i.imgur.com/XKfNUFl.jpeg" },
  stylus: { nome: "Stylus (Caneta para mexer no celular)", imagem: "https://i.imgur.com/xL7fptw.jpeg" },
  resta1: { nome: "Resta 1", imagem: "https://i.imgur.com/s8GRLNb.jpeg" },
  pirulito: { nome: "Pirulito", imagem: "https://cdn.awsli.com.br/2500x2500/1957/1957771/produto/1047748409ee2f58d9d.jpg" }
};

auth.onAuthStateChanged(user => {
  if (!user) return;

  userId = user.uid;
  userEmail = user.email;

  db.collection("users").doc(userId).get().then(doc => {
    const data = doc.data();
    userNome = data.nome || userEmail;
    moedas = data.moedas || 0;
    userSala = data.sala;

    if (!userSala) throw new Error("Sala não definida para este usuário.");

    document.getElementById("nota-projeto1").innerText = data.projeto1 ?? "-";
    document.getElementById("nota-projeto2").innerText = data.projeto2 ?? "-";
    document.getElementById("nota-tecnologia").innerText = data.tecnologia ?? "-";
    document.getElementById("nota-paulista").innerText = data.paulista ?? "-";
    document.getElementById('total-moedas').innerText = moedas;

    if (userEmail === "sandrachefa@gmail.com") {
      const btnNotas = document.getElementById("btn-gerenciar-notas");
      if (btnNotas) btnNotas.style.display = "inline-block";
    }

    return Promise.all([
      db.collection("loja").doc("config").get(),
      db.collection("salas").doc(userSala).get(),
      db.collection("users").where("sala", "==", userSala).get()
    ]);
  }).then(([lojaDoc, salaDoc, alunosSnapshot]) => {
    if (lojaDoc.exists) {
      const lojaData = lojaDoc.data();
      estoqueGlobal = lojaData.estoque || {};
      precosGlobal = lojaData.preco || {};
    }

    if (salaDoc.exists) {
      const salaData = salaDoc.data();
      investimentosSala = salaData.investimentos || {};
    }

    let somas = [0, 0, 0, 0];
    let cont = [0, 0, 0, 0];

    alunosSnapshot.forEach(doc => {
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
});

function logout() {
  auth.signOut().then(() => window.location.href = "index.html");
}

function irParaGerenciarNotas() {
  window.location.href = "gerenciar_notas.html";
}

function ganharMoeda() {
  moedas++;
  document.getElementById("total-moedas").innerText = moedas;
  db.collection("users").doc(userId).update({ moedas });
}

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
      <img src="${info.imagem}" alt="${info.nome}"/>
      <p>
        ${produtosColetivos.includes(produtoId)
          ? `Investimento da Sala: ${investimento}/5000<br>Estoque: ${estoque}`
          : `Preço: ${preco} moedas<br>Estoque: ${estoque}`}
      </p>
      <button ${moedas < preco && !produtosColetivos.includes(produtoId) ? "disabled" : ""} onclick="comprarProduto('${produtoId}')">
        ${produtosColetivos.includes(produtoId) ? "Investir" : "Comprar"}
      </button>
    `;

    lista.appendChild(div);
  });
}

function comprarProduto(produtoId) {
  const preco = precosGlobal[produtoId] || 0;

  if (produtosColetivos.includes(produtoId)) {
    if (moedas <= 0) return alert("Você não tem moedas suficientes para investir.");

    const investimentoAtual = investimentosSala[produtoId] || 0;
    const faltaPara5000 = 5000 - investimentoAtual;

    if (faltaPara5000 <= 0) return alert("Este produto coletivo já foi comprado pela sala.");

    const valorInvestido = Math.min(moedas, faltaPara5000);
    const novoTotal = investimentoAtual + valorInvestido;

    db.collection("salas").doc(userSala).update({
      [`investimentos.${produtoId}`]: novoTotal
    });

    moedas -= valorInvestido;
    investimentosSala[produtoId] = novoTotal;
    document.getElementById("total-moedas").innerText = moedas;

    db.collection("users").doc(userId).update({ moedas });

    if (novoTotal >= 5000) {
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

        alert("Parabéns! A sala comprou o produto coletivo.");
      } else {
        alert("Produto coletivo esgotado.");
      }
    } else {
      alert(`Investimento de ${valorInvestido} moedas realizado com sucesso!`);
    }

    renderizarProdutos();

  } else {
    if (moedas < preco) return alert("Você não tem moedas suficientes.");
    if ((estoqueGlobal[produtoId] || 0) <= 0) return alert("Produto esgotado.");

    estoqueGlobal[produtoId]--;
    moedas -= preco;

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

    alert("Compra realizada com sucesso!");
    renderizarProdutos();
  }
}
