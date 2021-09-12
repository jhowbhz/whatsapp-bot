const { create, Client, decryptMedia, ev, SimpleListener, smartUserAgent, NotificationLanguage } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const msgHandler = require('./msgHndlr')
const options = require('./options')
const { help } = require('./lib/help')

const WEBHOOK_ADDRESS = 'https://en6p3ti7f72f9jz.m.pipedream.net'

const start = async (client = new Client()) => {

        console.log('[SERVER] Servidor iniciado!')

        client.onStateChanged((state) => {
            console.log('[Status do cliente]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        })

        // listening on message
        client.onMessage((async (message) => {

            client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 3000) {
                    client.cutMsgCache()
                }
            })

            msgHandler(client, message)

        }))
        
        client.onButton((async (chat ) => {
            switch (chat?.body) {
                case 'Menu do bot':
                        await client.sendText(chat?.chatId, help)
                    break;

                case 'Quem sou eu?':
                        await client.sendText(chat?.chatId, `Eu sou um bot, me chamo Chuck, foi desenvolvido pelo Jhon, meu código está disponível para download em https://github.com/jhowbhz/bot-whatsapp`)
                    break;

                default:
                        await client.sendText(chat?.chatId, `Blz... Até a próxima ✌🏽`)
                    break;
            }
        }))

        client.onAddedToGroup(((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 30) {
                
            	client.sendText(chat.id, `Opa, sou um bot, aqui só tem ${totalMem} membros?, se você quiser convidar bots fica a vontade, se precisar de ajuda basta escrever: *me ajuda*`)
            
            } else {
                client.sendText(chat.groupMetadata.id, `Olá membros do grupo *${chat.contact.name} * obrigado por convidar este bot, para ver o menu envie *me ajuda*`)
            }
        }))

        client.onGlobalParticipantsChanged((async (message) => {

            await welcome(client, message)
            //left(client, heuh)

        }))

        client.onIncomingCall( async (call) => {
            console.log('ALGUEM ESTÁ LIGANDO ===>',call)

            await client.sendText(call.peerJid, "Não consigo receber chamadas. Ligou novamente= bock!")
                    .then(() => client.contactBlock(call.peerJid))
        });
        
        
}

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
