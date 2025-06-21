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
  bola_nike: { nome: "Bola da Nike", imagem: "https://i.imgur.com/TLMAfb6.jpeg" },
  bola_volei: { nome: "Bola de Volei", imagem: "https://i.imgur.com/utdBdq1.png" },
  bola_basquete: { nome: "Bola de Basquete", imagem: "https://i.imgur.com/hxSv0Ts.png" },
  teclado_standart: { nome: "Teclado Standart Keyboard", imagem: "https://i.imgur.com/6OBX0iK.jpeg" },
  teclado_knup: { nome: "Teclado Knup", imagem: "https://i.imgur.com/NXXeWFR.jpeg" },
  teclado_mouse: { nome: "Teclado e Mouse Maxtro", imagem: "https://i.imgur.com/UBqi1ni.jpeg" },
  mouse_gamer: { nome: "Mouse Gamer", imagem: "https://i.imgur.com/kpcOYTX.jpeg" },
  mouse: { nome: "Mouse", imagem: "https://i.imgur.com/p0Gkdpk.jpeg" },
  auto_falante: { nome: "Mini auto-falante", imagem: "https://i.imgur.com/pUWfBP2.jpeg" },
  webcam: { nome: "Mini Webcam Maxtro", imagem: "https://i.imgur.com/tALZOlC.jpeg" },
  estojo_stitch: { nome: "Estojo escolar Stitch", imagem: "https://i.imgur.com/ui2Bz8P.jpeg" },
  estojo_bichinhos: { nome: "Estojo escolar bichinhos", imagem: "https://i.imgur.com/jNSvsUA.jpeg" },
  estojo_roxo: { nome: "Estojo escolar roxo", imagem: "https://i.imgur.com/G4s45ee.jpeg" },
  kit_aranha: { nome: "Kit escolar, caderno Homem Aranha, régua e tesoura", imagem: "https://i.imgur.com/9K1e5VI.jpeg" },
  kit_kitty: { nome: "Kit escolar, caderno Hello Kitty, régua e tesoura", imagem: "https://i.imgur.com/fSAluqF.jpeg" },
  kit_bobbie: { nome: "Kit copo bobbie goods e lápis de cor", imagem: "https://i.imgur.com/THsU3gP.jpeg" },
  kit_escolar: { nome: "Kit escolar", imagem: "https://i.imgur.com/hJ6WOdw.jpeg" },
  kit_caderno_caneta: { nome: "Kit caderno, caneta e lápis", imagem: "https://i.imgur.com/wceuyD4.jpeg" },
  kit_palavras_cor: { nome: "Kit caça palavras e lápis de cor", imagem: "https://i.imgur.com/6SzNhfH.jpeg" },
  kit_palavras_regua: { nome: "Kit caça palavras e régua", imagem: "https://i.imgur.com/3SSIhmY.jpeg" },
  kit_desenho_regua: { nome: "Kit caderno de desenho e régua", imagem: "https://i.imgur.com/rI2hb1O.jpeg" },
  kit_postit_caneta: { nome: "Kit post-it e caneta", imagem: "https://i.imgur.com/JjToXZP.jpeg" },
  kit_doces: { nome: "Kit doces", imagem: "https://i.imgur.com/rpIGmVB.jpeg" },
  kit_doces2: { nome: "Kit doces", imagem: "https://i.imgur.com/UTKPOGL.jpeg" },
  kit_lixa_gloss: { nome: "Kit lixa e gloss", imagem: "https://i.imgur.com/UJgE0gL.jpeg" },
  caderno_noturno: { nome: "Caderno de desenho noturno", imagem: "https://i.imgur.com/WrRDhqX.jpeg" },
  cadernos: { nome: "Cadernos", imagem: "https://i.imgur.com/t76notB.jpeg" },
  caderno_pato: { nome: "Caderno pequeno patinhos", imagem: "https://i.imgur.com/dX6B626.jpeg" },
  caderno_gato: { nome: "Caderno pequeno gatinho", imagem: "https://i.imgur.com/HFqrUw9.jpeg" },
  canetinha: { nome: "Canetinha 12 cores", imagem: "https://i.imgur.com/vkjuWe0.jpeg" },
  caneta_colorida: { nome: "Canetas coloridas Bic", imagem: "https://i.imgur.com/QwW2LMQ.jpeg" },
  fini: { nome: "Fini", imagem: "https://i.imgur.com/8Nwj3tF.jpeg" },
  prestigio: { nome: "Prestígio", imagem: "https://i.imgur.com/OeSiuBi.jpeg" },
  truco: { nome: "Truco", imagem: "https://i.imgur.com/Tv4biLS.jpeg" },
  abaco: { nome: "Ábaco", imagem: "https://i.imgur.com/Uqj19CY.jpeg" },
  pega_varetas: { nome: "Pega varetas", imagem: "https://i.imgur.com/d040WoV.jpeg" },
  lixa_decorativa: { nome: "Lixa decorativa", imagem: "https://i.imgur.com/zfedsdd.jpeg" },
  chaveiro_emoji: { nome: "Chaveiro emoji", imagem: "https://i.imgur.com/K58KA63.jpeg" },
  aula_jogos: { nome: "Aula com jogos e brincadeiras na área externa", imagem: "https://i.imgur.com/rRKueT4.jpeg" },
  aula_ping: { nome: "Aula com jogos e brincadeiras no pátio", imagem: "https://i.imgur.com/o48S1TL.jpeg" },
  aula_fisica: { nome: "Aula extra de educação física", imagem: "https://jundiai.sp.gov.br/noticias/wp-content/uploads/sites/32/2018/11/emeb_marcos_gasparian-166.jpg" },
  aula_cinema: { nome: "Aula de Cinema com Pipoca na sala", imagem: "https://2.bp.blogspot.com/-goes4lu3wsQ/VTl7mzY2lpI/AAAAAAAAGR0/By2X6yTVvZk/s1600/crian%C3%A7as-filmes.jpg" },
  aula_horta: { nome: "Aula na Horta", imagem: "https://i.imgur.com/EDqWAVf.jpeg" },
  jogos_virtuais: { nome: "Aula com Jogos Virtuais", imagem: "https://img.freepik.com/fotos-gratis/criancas-da-escola-usando-tablet-digital-em-sala-de-aula_107420-57955.jpg" },
  harry_potter: { nome: "Harry Potter e a Ordem da Fênix", imagem: "https://i.imgur.com/u39XPhX.jpeg" },
  fone: { nome: "Fones de ouvido preto", imagem: "https://i.imgur.com/wv0WJpZ.jpeg" },
  fone_latam: { nome: "Fones de ouvido Latam", imagem: "https://i.imgur.com/Ze441oH.jpeg" },
  narizinho: { nome: "Reinações de Narizinho", imagem: "https://i.imgur.com/XKfNUFl.jpeg" },
  resta1: { nome: "Resta 1", imagem: "https://i.imgur.com/s8GRLNb.jpeg" },
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
    document.getElementById("total-moedas").innerText = moedas;

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

    // Carregar todos os rankings
    carregarRankingPeriodo("semana", "aluno");
    carregarRankingPeriodo("semana", "sala");
    carregarRankingPeriodo("mes", "aluno");
    carregarRankingPeriodo("mes", "sala");
  });
});

function logout() {
  auth.signOut().then(() => window.location.href = "index.html");
}

function irParaGerenciarNotas() {
  window.location.href = "gerenciar_notas.html";
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

    const input = prompt(`Quanto você quer investir?`);

    if (!input) return; // Cancelado
    const valorInvestido = parseInt(input);

    if (isNaN(valorInvestido) || valorInvestido <= 0) {
      return alert("Valor inválido. Digite um número positivo.");
    }

    if (valorInvestido > moedas) {
      return alert("Você não tem moedas suficientes.");
    }

    if (valorInvestido > faltaPara5000) {
      return alert("Esse valor ultrapassa o necessário para completar o investimento.");
    }

    const novoTotal = investimentoAtual + valorInvestido;

    // Atualiza Firestore
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
    // Produto individual
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


function carregarRankingPeriodo(tipo, escopo) {
  const dias = tipo === "semana" ? 7 : 30;
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - dias);
  const limiteTimestamp = firebase.firestore.Timestamp.fromDate(dataLimite);

  const containerId = `ranking-${tipo}-${escopo === "aluno" ? "alunos" : "salas"}`;
  const container = document.getElementById(containerId);
  if (!container) return;

  db.collection("logs")
    .where("data", ">=", limiteTimestamp)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = "<p>Nenhum dado encontrado.</p>";
        return;
      }

      const acumulado = {};

      snapshot.forEach(doc => {
        const log = doc.data();
        const chave = escopo === "aluno" ? log.nome || "Desconhecido" : log.sala || "Sem Sala";
        acumulado[chave] = (acumulado[chave] || 0) + 1;
      });

      const rankingArray = Object.entries(acumulado)
        .sort((a, b) => b[1] - a[1])  // ordena decrescente por quantidade
        .slice(0, 10);               // top 10

      let html = "<ol>";
      rankingArray.forEach(([nomeOuSala, count]) => {
        html += `<li>${nomeOuSala}: ${count} compra${count > 1 ? "s" : ""}</li>`;
      });
      html += "</ol>";

      container.innerHTML = html;
    })
    .catch(error => {
      console.error("Erro ao carregar ranking:", error);
      container.innerHTML = "<p>Erro ao carregar ranking.</p>";
    });
}
