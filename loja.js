let moedas = 0;
let estoqueBola = 1;
let estoqueAula = 100;
let estoqueDias = 50;
let estoqueBala = 200;

// Funções para manipulação de cookies
function setCookie(nome, valor, dias) {
    const dataExpiracao = new Date();
    dataExpiracao.setTime(dataExpiracao.getTime() + (dias * 24 * 60 * 60 * 1000)); // Definir o tempo de expiração
    const expires = "expires=" + dataExpiracao.toUTCString();
    document.cookie = nome + "=" + valor + ";" + expires + ";path=/";
}

function getCookie(nome) {
    const nomeEQ = nome + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nomeEQ) === 0) return c.substring(nomeEQ.length, c.length);
    }
    return null;
}

function deleteCookie(nome) {
    document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

// Carregar estado a partir dos cookies
function carregarEstado() {
    estoqueBola = parseInt(getCookie("estoqueBola")) || 1;
    estoqueAula = parseInt(getCookie("estoqueAula")) || 100;
    estoqueDias = parseInt(getCookie("estoqueDias")) || 50;
    estoqueBala = parseInt(getCookie("estoqueBala")) || 200;
    moedas = parseInt(getCookie("moedas")) || 0;
    atualizarTotal();
}

// Salvar estado nos cookies
function salvarEstado() {
    setCookie("moedas", moedas, 7); // Expira em 7 dias
    setCookie("estoqueBola", estoqueBola, 7);
    setCookie("estoqueAula", estoqueAula, 7);
    setCookie("estoqueDias", estoqueDias, 7);
    setCookie("estoqueBala", estoqueBala, 7);
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
    deleteCookie("usuario_logado");
    window.location.href = "index.html";
}

window.onload = () => {
    const user = getCookie("usuario_logado");
    if (!user) {
        alert("Você precisa estar logado!");
        window.location.href = "index.html";
    } else {
        document.getElementById("nome-usuario").innerText = user;
        carregarEstado();
    }
};
