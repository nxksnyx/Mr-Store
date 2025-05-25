const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');  // Importando o CORS

// Conectando ao MongoDB
mongoose.connect('mongodb://localhost:27017/mrstore', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err));

const app = express();
app.use(bodyParser.json());  // Middleware para lidar com JSON no corpo da requisição

// Configuração do CORS - permite requisições de seu frontend no GitHub
const corsOptions = {
  origin: 'https://nxksnyx-github-io.vercel.app',  // Coloque aqui o domínio do seu frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));  // Usando o CORS no servidor

// Definição do schema do usuário
const usuarioSchema = new mongoose.Schema({
  email: String,
  senha: String,
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Rota para cadastro de usuário
app.post('/cadastro', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
  }

  // Verifica se o usuário já existe
  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) {
    return res.status(400).json({ message: "Este e-mail já está cadastrado." });
  }

  // Criptografa a senha
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  // Cria o novo usuário
  const novoUsuario = new Usuario({ email, senha: senhaCriptografada });
  await novoUsuario.save();

  res.status(201).json({ message: "Cadastro bem-sucedido!" });
});

// Rota para login de usuário
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
  }

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    return res.status(400).json({ message: "Usuário não encontrado." });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(400).json({ message: "Senha incorreta." });
  }

  res.json({ message: "Login bem-sucedido!" });
});

// Inicia o servidor na porta 5000
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
