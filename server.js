const express = require('express');
const app = express();

// Seu token de verificação do Facebook
const VERIFY_TOKEN = "benjamin";  // Substitua por um token que você escolheu

// Rota GET para validar o webhook
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = req.query['hub.verify_token'];

  // Verificando se o token de verificação enviado pelo Facebook é o mesmo que você configurou
  if (mode && verifyToken === VERIFY_TOKEN) {
    res.status(200).send(challenge);  // Se o token for válido, envia o challenge de volta
  } else {
    res.status(403).send('Error, invalid token');  // Caso contrário, retorna um erro
  }
});

// A porta em que o servidor vai ouvir, o Railway vai usar a porta especificada pela variável de ambiente
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
