const { create, Client, decryptMedia, ev, SimpleListener, smartUserAgent, NotificationLanguage } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const msgHandler = require('./msgHndlr')
const options = require('./options')

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
        
        client.onAnyMessage(message=>{
            console.log('chegou mensagem ====>', message.body);
        })

        client.onAddedToGroup(((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 30) { 
            	client.sendText(chat.id, `Ei, os membros são apenas ${totalMem}, se você quiser convidar bots, o número mínimo de mem é 30`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
            } else {
                client.sendText(chat.groupMetadata.id, `Olá membros do grupo *${chat.contact.name} * obrigado por convidar este bot, para ver o menu envie *me ajuda*`)
            }
        }))

        client.onGlobalParticipantsChanged((async (message) => {

            await welcome(client, message)
            //left(client, heuh)

        }))


        /* //client.onAck((data) => console.log(data.id,data.body,data.ack));
        client.onAck( async (msg) => {

            
        })
 */
        //client.registerWebhook('OK', WEBHOOK_ADDRESS, `${data?.event}`, 1 )
        await client.registerWebhook(`https://dialogflow.clients6.google.com/v2/projects/apigratis-uueh/agent/sessions/7b3f38a1-f880-b174-f4c8-45a7caba3901:detectIntent`, 'onAck', {
            /* data: {
                text: 'Ola',
                languageCode:'pt-br'
            }, */
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ya29.a0AfH6SMCjwEE1njE6EtjIeIY7PZVF32XbuwPzlKMHVrY3sbZKnk4wjYFtKirRUhxjxCFtjnOxSC6IJGjgNyd9ndM1PKtyGnXQ2QSkVca3aMeFd72cd8IAVXbLz5dUS3O4Ixzm8RlDVScZgkCeWBMwEbRBAJl0z0l0HttX1DQPKYk9IpHnWGD7JWqNNpptMgL_uSUS5wEuaAOIZC10DIl9fSI_7PswSnXm99kC3QD5VVjaIQ'
            },
            //data: 'text=Ola&languageCode=pt-br',
            method:'POST',
            params: {
                'text': 'Ola',
                'languageCode': 'pt-br',
            },
            transformResponse: [(data) => {
                console.log(JSON.stringify(data));
            }],
            responseType: 'json',
            responseEncoding: 'utf8', // default
            validateStatus: (status) => {
                console.log(status);
            }}, 5)

        client.onIncomingCall( call => {
            console.log('ALGUEM ESTÁ LIGANDO ===>',call)
        });
        
}

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
