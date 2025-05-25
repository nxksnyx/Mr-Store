let moedas = 0;
let estoqueBola = 1;
let estoqueAula = 100;
let estoqueDias = 50;
let estoqueBala = 200;

// Função para verificar se o usuário está logado
function verificarLogin() {
    const usuarioLogado = localStorage.getItem("usuario_logado");

    if (!usuarioLogado) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";  // Se não estiver logado, redireciona para o login
    } else {
        document.getElementById("nome-usuario").innerText = usuarioLogado;
        carregarEstado();
    }
}

// Função de logout
function logout() {
    localStorage.removeItem("usuario_logado");
    alert("Logout bem-sucedido!");
    window.location.href = "login.html";  // Redireciona para o login
}

window.onload = verificarLogin;

// Funções de compra e gerenciamento de estoque
function carregarEstado() {
    estoqueBola = parseInt(localStorage.getItem("estoqueBola")) || 1;
    estoqueAula = parseInt(localStorage.getItem("estoqueAula")) || 100;
    estoqueDias = parseInt(localStorage.getItem("estoqueDias")) || 50;
    estoqueBala = parseInt(localStorage.getItem("estoqueBala")) || 200;
    moedas = parseInt(localStorage.getItem("moedas")) || 0;
    atualizarTotal();
}

function salvarEstado() {
    localStorage.setItem("moedas", moedas);
    localStorage.setItem("estoqueBola", estoqueBola);
    localStorage.setItem("estoqueAula", estoqueAula);
    localStorage.setItem("estoqueDias", estoqueDias);
    localStorage.setItem("estoqueBala", estoqueBala);
}

function atualizarTotal() {
    document.getElementById('total-moedas').innerText = moedas;
}
