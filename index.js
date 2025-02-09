const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const TOKEN = "SEU_TOKEN_DE_ACESSO";  // Insira seu token de acesso aqui
const VERIFY_TOKEN = "SEU_TOKEN_DE_VERIFICACAO";  // Escolha um token de verificação
const PHONE_NUMBER_ID = "SEU_PHONE_NUMBER_ID";  // Seu ID do número do WhatsApp

// Rota de verificação do webhook
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.status(403).send('Falha na verificação');
    }
});

// Rota para receber mensagens
app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.object) {
        const message = body.entry[0]?.changes[0]?.value?.messages?.[0];
        if (message) {
            const phone = message.from;
            const text = message.text.body;

            console.log(`Mensagem recebida de ${phone}: ${text}`);

            // Responder automaticamente
            await sendMessage(phone, "Olá! Bem-vindo ao salão. Como posso ajudar?");
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Função para enviar mensagens no WhatsApp
async function sendMessage(phone, text) {
    await axios.post(
        `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
        {
            messaging_product: "whatsapp",
            to: phone,
            text: { body: text }
        },
        {
            headers: { Authorization: `Bearer ${TOKEN}` }
        }
    );
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
