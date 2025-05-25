const dotenv = require('dotenv');
dotenv.config();  // Carrega as variáveis do arquivo .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Certifique-se de importar o cors

// Verifique se a variável de ambiente está sendo carregada corretamente
console.log("MONGODB_URI:", process.env.MONGODB_URI);  // Exibe a variável MONGODB_URI no console

// Conectando ao MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err));

// Criando a aplicação Express
const app = express();

// Usando o middleware CORS para permitir requisições do seu frontend
app.use(cors({
  origin: 'https://nxksnyx-github-io.vercel.app', // Altere conforme necessário para o seu frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Usando o middleware para interpretar requisições JSON
app.use(express.json());

// Definindo o modelo de usuário
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

// Rota para o cadastro de usuário
app.post('/cadastro', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o e-mail já está cadastrado
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }

    // Criando um novo usuário
    const novoUsuario = new Usuario({ email, password });
    await novoUsuario.save();

    return res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao cadastrar o usuário.', details: error.message });
  }
});

// Rota para o login do usuário
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificando se o usuário existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    // Verificando a senha
    if (usuario.password !== password) {
      return res.status(400).json({ error: 'Senha incorreta.' });
    }

    // Login bem-sucedido
    return res.status(200).json({ message: 'Login bem-sucedido!' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao fazer login.', details: error.message });
  }
});

// Definindo a porta em que o servidor irá rodar
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
