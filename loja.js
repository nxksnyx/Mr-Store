
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

let userEmail = localStorage.getItem('usuario_logado');
if (!userEmail) {
  window.location.href = 'index.html';
} else {
  document.getElementById('nome-usuario').innerText = userEmail;
}

let moedas = 0;
let estoqueAtual = {};

const produtos = [
  { id: 'bola-nike', nome: 'Bola da Nike', preco: 5000, img: 'https://static.netshoes.com.br/produtos/bola-de-futebol-campo-nike-merlin-cbf/14/HZM-2881-114/HZM-2881-114_zoom2.jpg' },
  { id: 'jogos', nome: 'Aula com jogos e brincadeiras', preco: 1000, img: 'https://2.bp.blogspot.com/-c68QkhR3hRc/UFcYdZ8ezrI/AAAAAAAACAQ/8nrWUMt3_iI/s1600/P%C3%A1tio+-+flores+(5).JPG' },
  { id: 'educacao', nome: 'Aula extra de Educação física', preco: 1000, img: 'https://jundiai.sp.gov.br/noticias/wp-content/uploads/sites/32/2018/11/emeb_marcos_gasparian-166.jpg' },
  { id: 'horta', nome: 'Aula interativa na horta', preco: 1000, img: 'https://2.bp.blogspot.com/-Lj4wkphotVI/U9Gf68lVWRI/AAAAAAAAAog/6DV5vfqTe4U/s1600/DSC08998.JPG' },
  { id: 'jogos-virtuais', nome: 'Aula com jogos virtuais', preco: 1000, img: 'https://img.freepik.com/fotos-gratis/criancas-da-escola-usando-tablet-digital-em-sala-de-aula_107420-57955.jpg?size=626&ext=jpg' },
  { id: 'balas', nome: 'Balas', preco: 10, img: 'https://a-static.mlcdn.com.br/800x560/pacote-bala-7-belo-framboesa-600g-arcor/produtosdemaquiagem/10761p/370cbc11ef578c1c36f9c6bc2996a45b.jpg' },
  { id: 'pirulito', nome: 'Pirulito', preco: 20, img: 'https://cdn.awsli.com.br/2500x2500/1957/1957771/produto/1047748409ee2f58d9d.jpg' },
  { id: 'cinema', nome: 'Cinema com pipoca na sala', preco: 1000, img: 'https://2.bp.blogspot.com/-goes4lu3wsQ/VTl7mzY2lpI/AAAAAAAAGR0/By2X6yTVvZk/s1600/crian%C3%A7as-filmes.jpg' }
];

async function carregarProdutos() {
  const container = document.getElementById('product-list');
  const estoqueRef = db.collection('estoque').doc('global');
  const moedasRef = db.collection('usuarios').doc(userEmail);

  const [estoqueSnap, moedasSnap] = await Promise.all([
    estoqueRef.get(),
    moedasRef.get()
  ]);

  estoqueAtual = estoqueSnap.exists ? estoqueSnap.data() : {};
  moedas = moedasSnap.exists ? moedasSnap.data().mrcoin || 0 : 0;

  atualizarTela();
  container.innerHTML = '';
  produtos.forEach(prod => {
    const est = estoqueAtual[prod.id] ?? 0;
    const desativado = est <= 0 || moedas < prod.preco ? 'disabled' : '';
    container.innerHTML += `
      <div class="product">
        <img src="${prod.img}" alt="${prod.nome}" />
        <h4>${prod.nome}</h4>
        <p>Preço: ${prod.preco} Mrcoin</p>
        <p id="estoque-${prod.id}">Estoque: ${est}</p>
        <button id="btn-${prod.id}" onclick="comprarProduto('${prod.id}', ${prod.preco})" ${desativado}>Comprar</button>
      </div>
    `;
  });
}

async function comprarProduto(id, preco) {
  if (estoqueAtual[id] <= 0) {
    alert('Produto fora de estoque!');
    return;
  }
  if (moedas < preco) {
    alert('Você não tem Mrcoin suficiente!');
    return;
  }

  estoqueAtual[id]--;
  moedas -= preco;

  await db.collection('estoque').doc('global').set(estoqueAtual);
  await db.collection('usuarios').doc(userEmail).set({ mrcoin: moedas });

  alert('Compra realizada com sucesso!');
  carregarProdutos();
}

async function ganharMoeda() {
  moedas++;
  await db.collection('usuarios').doc(userEmail).set({ mrcoin: moedas });
  atualizarTela();
}

function atualizarTela() {
  document.getElementById('total-moedas').innerText = moedas;
}

function logout() {
  localStorage.removeItem('usuario_logado');
  window.location.href = 'index.html';
}

window.onload = carregarProdutos;
