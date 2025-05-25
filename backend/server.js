// Importando dependências
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Inicializando o dotenv para carregar variáveis de ambiente
dotenv.config();

// Criando uma instância do servidor Express
const app = express();

// Permitindo CORS para requisições de qualquer origem
app.use(cors());

// Definindo o corpo das requisições como JSON
app.use(express.json());

// Conectando ao MongoDB usando a URI definida no .env
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mrstore';  // Se não encontrar a variável, usa localhost como fallback

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado ao MongoDB com sucesso!"))
  .catch((error) => console.error("Erro ao conectar ao MongoDB: ", error));

// Definindo o modelo de Usuário
const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Rota para cadastrar usuários
app.post('/cadastro', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send({ message: "E-mail e senha são obrigatórios!" });
  }

  try {
    // Verificando se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).send({ message: "Este e-mail já está cadastrado." });
    }

    // Criando um novo usuário
    const novoUsuario = new Usuario({ email, senha });

    // Salvando o novo usuário no MongoDB
    await novoUsuario.save();

    // Respondendo com sucesso
    res.status(201).send({ message: "Cadastro realizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar usuário: ", error);
    res.status(500).send({ message: "Erro interno no servidor. Tente novamente mais tarde." });
  }
});

// Rota para login (opcional, se quiser adicionar futuramente)
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send({ message: "E-mail e senha são obrigatórios!" });
  }

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).send({ message: "Usuário não encontrado." });
    }

    if (usuario.senha !== senha) {
      return res.status(400).send({ message: "Senha incorreta." });
    }

    res.status(200).send({ message: "Login bem-sucedido!" });
  } catch (error) {
    console.error("Erro ao fazer login: ", error);
    res.status(500).send({ message: "Erro interno no servidor. Tente novamente mais tarde." });
  }
});

// Definindo uma rota simples para testar
app.get('/', (req, res) => {
  res.send('Servidor rodando na porta 5000');
});

// Iniciando o servidor na porta 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
