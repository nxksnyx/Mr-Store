let moedas = 0;
let estoqueBola = 1;
let estoqueAula = 100;
let estoqueDias = 50;
let estoqueBala = 200;

// Função para verificar se o usuário está logado
function verificarLogin() {
    const user = firebase.auth().currentUser;

    if (!user) {
        alert("Você precisa estar logado!");
        window.location.href = "index.html";  // Se não estiver logado, redireciona para o login
    } else {
        document.getElementById("nome-usuario").innerText = user.email;
        carregarEstado();
    }
}

// Função de logout
async function logout() {
    try {
        await firebase.auth().signOut();
        alert("Logout bem-sucedido!");
        localStorage.removeItem("usuario_logado");
        window.location.href = "index.html";  // Redireciona para o login
    } catch (error) {
        alert("Erro ao sair: " + error.message);
    }
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
