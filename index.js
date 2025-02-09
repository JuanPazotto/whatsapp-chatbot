const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Substitua com seus dados reais
const TOKEN = "EAAwFv30HgJYBO6KJluIdWdXw9wRSdSym2QnzfIZCnZBTIZA7LDbqhXnR0AvkZBeLB0FvwIjKoicPH5eVXWIq6bkuX6bQgJnhWmzAp0DcK8cFVPVFT85dy0J9bWxMo7fSngAZAjChr3jesWZCNZAVabzgmg6XBiLd0OyjvqbB76tCQR0hpKKKxHU9ZCs56kX6mpaSeI004VkkKZCk7eu9DCIRwy40ljQYZD";  // Token de acesso à API do Facebook (deve ser gerado no Facebook Developer)
const VERIFY_TOKEN = "benjamin";  // Token de verificação (você escolhe esse valor, por exemplo, 'meu_token')
const PHONE_NUMBER_ID = "532180333320069";  // O ID do número de WhatsApp que você obteve ao configurar o WhatsApp Business API

// Rota de verificação do webhook (GET)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Verifica se o token de verificação fornecido no Facebook Developer Console é o mesmo que o do código
    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);  // Retorna o desafio se a verificação for bem-sucedida
    } else {
        res.status(403).send('Falha na verificação');  // Se os tokens não coincidirem, retorna erro 403
    }
});

// Rota para receber mensagens do WhatsApp (POST)
app.post('/webhook', async (req, res) => {
    const body = req.body;

    // Log para depuração
    console.log('Corpo recebido:', body);

    if (body.object) {
        const message = body.entry[0]?.changes[0]?.value?.messages?.[0];
        if (message) {
            const phone = message.from;
            const text = message.text.body;

            console.log(`Mensagem recebida de ${phone}: ${text}`);

            // Responder automaticamente
            await sendMessage(phone, "Olá! Bem-vindo ao salão. Como posso ajudar?");
        }
        res.sendStatus(200);  // Responde com sucesso (código 200)
    } else {
        res.sendStatus(404);  // Se não encontrar a estrutura esperada, responde com erro 404
    }
});

// Função para enviar mensagens no WhatsApp
async function sendMessage(phone, text) {
    try {
        await axios.post(
            `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: phone,
                text: { body: text },
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
}

// Inicia o servidor na porta 3000 ou na porta configurada no ambiente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
