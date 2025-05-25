// Exibir a tela de cadastro
function mostrarCadastro() {
    document.getElementById('cadastro-container').style.display = 'block';
    document.getElementById('login-container').style.display = 'none';
}

// Exibir a tela de login
function mostrarLogin() {
    document.getElementById('cadastro-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

// Fazer login do usuário
function fazerLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const usuario = JSON.parse(localStorage.getItem(username));

    if (usuario && usuario.senha === password) {
        alert("Login bem-sucedido!");
        localStorage.setItem("usuario_logado", username);
        window.location.href = "loja.html";
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

// Fazer cadastro de um novo usuário
function fazerCadastro() {
    const username = document.getElementById('cadastro-username').value;
    const password = document.getElementById('cadastro-password').value;

    if (localStorage.getItem(username)) {
        alert("Usuário já existe. Tente outro nome.");
        return;
    }

    const novoUsuario = {
        username: username,
        senha: password
    };

    localStorage.setItem(username, JSON.stringify(novoUsuario));
    alert("Cadastro realizado com sucesso!");
    localStorage.setItem("usuario_logado", username);
    window.location.href = "loja.html";
}
