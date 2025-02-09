const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const TOKEN = "benjamin";  // Insira seu token de acesso aqui
const VERIFY_TOKEN = "EAAwFv30HgJYBO5gXxVyNMSnwkd7lcSUlMAxSFKu2fGxVMjMJsJ7PZAuItnjch61LWEYA5w6E4mLD6cjZCIH227GpOViG7OgYm4LGbfnDzQj2x4hihZA42Q5eIJwgXZCoQtbncgFg45CZChoncYWyooSOZBe2hEroTb7ZBQyGN21NB1Fj86ZC5wKH628M5zxKBnpxSpV7phI4vtIfRtm66LdGvX9WUaTI";  // Escolha um token de verificação
const PHONE_NUMBER_ID = "532180333320069";  // Seu ID do número do WhatsApp

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
