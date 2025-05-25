// Importando dependências
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();  // Carregar variáveis do arquivo .env

// Criando o aplicativo Express
const app = express();

// Configuração do CORS para aceitar requisições do seu frontend
const corsOptions = {
  origin: 'https://nxksnyx-github-io.vercel.app',  // URL do seu site hospedado
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type',
};
app.use(cors(corsOptions));  // Usando o CORS configurado

// Middleware para parsear o corpo das requisições
app.use(bodyParser.json());

// Conectando ao MongoDB usando Mongoose
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/lojaDB';  // Mongo URI do .env
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err));

// Definindo o schema do usuário
const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
});

// Criando o modelo do usuário
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Rota para cadastro de usuário
app.post('/cadastro', async (req, res) => {
  const { email, senha } = req.body;
  
  // Verificar se o usuário já existe
  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) {
    return res.status(400).json({ message: "Este e-mail já está cadastrado." });
  }

  // Criar novo usuário
  const novoUsuario = new Usuario({ email, senha });
  try {
    await novoUsuario.save();
    res.status(201).json({ message: "Cadastro realizado com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao salvar o usuário." });
  }
});

// Rota para login de usuário
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  
  // Verificar se o usuário existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    return res.status(400).json({ message: "Usuário não encontrado." });
  }

  // Verificar a senha
  if (usuario.senha !== senha) {
    return res.status(400).json({ message: "Senha incorreta." });
  }

  res.status(200).json({ message: "Login bem-sucedido!", usuario });
});

// Rota de testes (para garantir que o backend está funcionando)
app.get('/teste', (req, res) => {
  res.send("Servidor está funcionando!");
});

// Iniciando o servidor na porta 5000
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
