const { create, Client } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const msgHandler = require('./msgHndlr')
const options = require('./options')

const start = async (client = new Client()) => {

        console.log('[SERVER] Servidor iniciado!')

        // Force it to keep the current session
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
        
}

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
