let moedas = 0;
let estoqueBola = 1;
let estoqueAula = 100;
let estoqueDias = 50;
let estoqueBala = 200;

// Função para obter o cookie
// Função para pegar o cookie de login
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

window.onload = () => {
    const user = getCookie("usuario_logado");

    if (!user) {
        // Se não estiver logado, redireciona para a página de login
        alert("Você precisa estar logado!");
        window.location.href = "index.html";
    } else {
        // Exibe o nome de usuário na loja
        document.getElementById("nome-usuario").innerText = user;
        carregarEstado();
    }
};

// O restante do código para manipular o estado, compras, etc., permanece o mesmo.


// Carregar estado (moedas e estoque)
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

function ganharMoeda() {
    moedas += 1;
    atualizarTotal();
    salvarEstado();
}

function comprarProduto(preco, tipo) {
    if (moedas < preco) {
        alert("Você não tem Mrcoin suficiente!");
        return;
    }

    switch (tipo) {
        case 'bola':
            if (estoqueBola <= 0) return alert("Produto fora de estoque!");
            estoqueBola--;
            document.getElementById('estoque-bola').innerText = "Estoque: " + estoqueBola;
            break;
        case 'aula':
            if (estoqueAula <= 0) return alert("Produto fora de estoque!");
            estoqueAula--;
            document.getElementById('estoque-aula').innerText = "Estoque: " + estoqueAula;
            break;
        case 'dias':
            if (estoqueDias <= 0) return alert("Produto fora de estoque!");
            estoqueDias--;
            document.getElementById('estoque-dias').innerText = "Estoque: " + estoqueDias;
            break;
        case 'bala':
            if (estoqueBala <= 0) return alert("Produto fora de estoque!");
            estoqueBala--;
            document.getElementById('estoque-bala').innerText = "Estoque: " + estoqueBala;
            break;
    }

    moedas -= preco;
    atualizarTotal();
    salvarEstado();
    alert("Compra realizada com sucesso!");
}

function logout() {
    // Limpa o cookie de login
    document.cookie = "usuario_logado=; path=/; max-age=0";  // Apaga o cookie
    localStorage.removeItem("usuario_logado");
    window.location.href = "index.html";  // Redireciona para a página de login
}


window.onload = () => {
    const user = getCookie("usuario_logado");  // Verifica se o usuário está logado com o cookie
    if (!user) {
        alert("Você precisa estar logado!");
        window.location.href = "index.html";  // Se não estiver logado, redireciona para o login
    } else {
        document.getElementById("nome-usuario").innerText = user;
        carregarEstado();
    }
};
