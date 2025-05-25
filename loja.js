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

// Função para ganhar moedas
function ganharMoeda() {
  moedas++;
  atualizarTela();
}

// Função para atualizar a tela de saldo
function atualizarTela() {
  document.getElementById('moedas').innerText = moedas;
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

// Produtos disponíveis
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
