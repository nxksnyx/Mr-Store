let moedas = 0;
let estoqueBola = 1;
let estoqueAula = 100;
let estoqueDias = 50;
let estoqueBala = 200;

// Função para obter o cookie
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

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
    document.cookie = "usuario_logado=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Remover o cookie
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
