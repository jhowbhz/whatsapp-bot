const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const get = require('got')
const fetch = require('node-fetch')
const color = require('./lib/color')
const { randomNimek, fb, sleep } = require('./lib/functions')
const { help } = require('./lib/help')
const nsfw_ = JSON.parse(fs.readFileSync('./lib/NSFW.json'))
const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'))
const gify = require('gify')

moment.tz.setDefault('America/Sao_Paulo').locale('id')

module.exports = msgHandler = async (client, message) => {
    try {

        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const falas = commands.toLowerCase()
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')

        const msgs = (message) => {
            if (command.startsWith('!')) {
                if (message.length >= 10){
                    return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const mess = {
            wait: '⏳ Espera porra, já to fazendo a figurinha...',
            error: {
                St: '[❗] Envie uma imagem com uma legenda *!s* ou marque a imagem que já foi enviada',
            }
        }
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const ownerNumber = ["5531984928178@c.us","5531984928178"] // replace with your whatsapp number
        const isOwner = ownerNumber.includes(sender.id)
        const isBlocked = blockNumber.includes(sender.id)
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
        //if (!isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
        if (isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return
        //if (!isOwner) return

        console.log(color('ARGS ===>'), args)
        console.log(color('FALAS ====>'), falas)
        console.log(color('COMANDO ====>'), command)

        switch(falas) {
            case '!berrante':
            case 'toca o berrante':
            case 'toca o berrante bot':
            case 'toca o berrante savio':
                await client.sendFile(from, './media/berrante.mpeg', 'Toca o berrante seu moço', 'AAAAAAAAAUHHH', id)
                break

            case 'sexto':
            case 'sextô':
                await client.reply(from, 'ôpa, bora??', id)
                const gif1 = await fs.readFileSync('./media/sexto.webp', { encoding: "base64" })
                await client.sendImageAsSticker(from, `data:image/gif;base64,${gif1.toString('base64')}`)
                break
                    
            case 'bot gay':
            case 'bot viado':
            case 'bot otario':
            case 'bot lixo':
                await client.reply(from, 'É pra esculachar?...', id)
                const gif2 = await fs.readFileSync('./media/xingping.webp', { encoding: "base64" })
                await client.sendImageAsSticker(from, `data:image/gif;base64,${gif2.toString('base64')}`)
                break

            case 'bom dia bot':
                await client.reply(from, 'Bom dia? so se for pra você que dormiu a noite toda...', id)
                const gif3 = await fs.readFileSync('./media/tudosobcontrole.webp', { encoding: "base64" })
                await client.sendImageAsSticker(from, `data:image/gif;base64,${gif3.toString('base64')}`)
                break
    
            case 'boa tarde bot':
                await client.reply(from, `Boa tarde, são ${moment().format('HH:mm')} e vc ta ai atoa ne? ligando pro seu chefe...`, id)
                break
    
            case 'boa noite bot':
                await client.reply(from, `Boa noite pra você também! já são ${moment().format('HH:mm')} to indo nessa também...`, id)
                break
    
            case 'oi bot':
                await client.reply(from, 'Fala? que ta pegando? sei fazer algumas coisas, digite: !ajuda', id)
                break
    
            case 'fala bot':
                await client.reply(from, 'Fala você... ou digite: !ajuda', id)
                const gif4 = await fs.readFileSync('./media/pensando.webp', { encoding: "base64" })
                await client.sendImageAsSticker(from, `data:image/gif;base64,${gif4.toString('base64')}`)
                break
        }

        switch(command) {

        case '!eununca':
        case '!jododavelha':
        case '!verdadeouconsequencia':

            await client.reply(from, 'Meu criador ainda não me ensinou a fazer isso... Volta mais tarde!', id)

            break

        case '!teste':

            //client.sendFile(from, './media/berrante.mpeg', 'Toca o berrante seu moço', 'AAAAAAAAAUHHH', id)

            const gif = await fs.readFileSync('./media/rizada.gif', { encoding: "base64" })
            await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)

            break

        case '!meunumero':

            let chatNumber = sender.id.split('-')
            let ddd = chatNumber[0].substring(2, 4)
            let number = chatNumber[0].substring(4, 12)

            dddPermitidos = [31, 32, 33, 34, 35, 37, 38]

            if( dddPermitidos.includes(parseInt(ddd)) ){

                //console.log('from ===>', from, 'id ====> ', id)
                client.reply(from, `Seu numero é: *${number}* seu ddd é: *${ddd}*`, id)

            }else{

                client.reply(from, `*NUMERO NÃO PERMITIDO!* 👋 Tchauu...`, id)
                await client.removeParticipant(groupId, sender.id)

            }

            break
            
        case '!kickme':

            client.reply(from, 'Agooora! kkkk', id)

            await client.removeParticipant(groupId, sender.id)

            break
        case '!sticker':
        case '!stiker':
        case '!s':
            if (isMedia && type === 'image') {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (args.length === 2) {
                const url = args[1]
                if (url.match(isUrl)) {
                    await client.sendStickerfromUrl(from, url, { method: 'get' })
                        .catch(err => console.log('Caught exception: ', err))
                } else {
                    client.reply(from, mess.error.Iv, id)
                }
            } else {
                    client.reply(from, mess.error.St, id)
            }
            break
        case '!stickergif':
        case '!stikergif':
        case '!sg':
        case '!sgif':
            if (isMedia) {

                if (mimetype === 'video/mp4' && message.duration < 30 || mimetype === 'image/gif' && message.duration < 30) {
                    const mediaData = await decryptMedia(message, uaOverride)
                    client.reply(from, '⏳ Pera porra, já to fazendo a figurinha!', id)
                    const filename = `./media/aswu.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)

                    let opts = {
                        rate: 20,
                        delay: 0
                    };

                    await gify(`${filename}`, './media/output.gif', opts, async (error) => {
                        if (error) {
                            
                            client.reply(from, '[❗] Pera ai que deu merda... Tente novamente mais tarde', id)

                        };
                            
                        const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                        await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                        
                    });

                } else (
                    client.reply(from, '[❗] Envie o vídeo com a legenda *!sg* máx. 30 segundos!', id)
                )
            }
            break

        case '!modoadm':
        case '!autoadm':
            if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id)
            if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado pelo grupo Admin!', id)
            if (args.length === 1) return client.reply(from, 'Escolha habilitar ou desabilitar!', id)

            if (args[1].toLowerCase() === 'enable') {

                welkom.push(chat.id)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                await client.reply(from, 'O modo auto-adm foi ativado com sucesso neste grupo!', id)
            
            } else if (args[1].toLowerCase() === 'disable') {

                welkom.splice(chat.id, 1)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                await client.reply(from, 'O recurso de auto-adm foi desabilitado com sucesso neste grupo!', id)

            } else {
                await client.reply(from, 'Selecione habilitar ou desabilitar!', id)
            }
            break

        case '!linkdogrupo':
        case '!lg':

            if (!isBotGroupAdmins) return client.reply(from, 'Este comando só pode ser usado quando o bot se torna administrador', id)
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink do grupo: *${name}*`)
            } else {
            	client.reply(from, 'Este comando só pode ser usado em grupos!', id)
            }
            break
        case '!adminlista':
            if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await client.sendTextWithMentions(from, mimin)
            break

        case '!donodogrupo':

            if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `Dono do grupo: @${Owner_}`)
            break

        case '!mencionartodos':

            if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id)
            if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe = '╔══✪〘 Aviso geral 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 Bot do Jhon 〙'
            await client.sendTextWithMentions(from, hehe)
            break

        case '!deixartudo':

            if (!isOwner) return client.reply(from, 'Este comando é apenas para o bot Proprietário', id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `Os bots estão limpando, o bate-papo total está ativo: ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, 'Sucesso!', id)
            break

        case '!limpartudo':

            if (!isOwner) return client.reply(from, 'Este comando é apenas para o bot Proprietário', id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Sucesso!', id)
            break

        case '!adicionar':
        case '!add':

            const orang = args[1]
            if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id)
            if (args.length === 1) return client.reply(from, 'Para usar este recurso, envie o comando *!adicionar* 55319xxxxx', id)
            if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Este comando só pode ser usado quando o bot se torna administrador', id)
            try {
                await client.addParticipant(from,`${orang}@c.us`)
            } catch {
                client.reply(from, mess.error.Ad, id)
            }
            break
        case '!ban':

            if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id)
            if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Este comando só pode ser usado quando o bot se torna administrador', id)
            
            if (mentionedJidList.length === 0) return client.reply(from, 'Para usar este comando, envie o comando *!ban* @tagmember', id)
            await client.sendText(from, `Pronto! removido \n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)

                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            
            break
        case '!sair':

            if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos', id)
            if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id)
            await client.sendText(from,'Sayonara').then(() => client.leaveGroup(groupId))
            break
        case '!promover':

            if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id)
            if (!isGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado por administradores de grupo', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado quando o bot se torna administrador', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Para usar este recurso, envie o comando *!promover* @tagmember', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Desculpe, este comando só pode ser usado por 1 usuário.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Desculpe, o usuário já é um administrador.', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
            break
        case '!rebaixar':

            if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id)
            if (!isGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado por administradores de grupo', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado quando o bot se torna administrador', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Para usar este recurso, envie o comando *!rebaixar* @tagadmin', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Desculpe, este comando só pode ser usado com 1 pessoa.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Pedido recebido, excluir trabalho @${mentionedJidList[0]}.`)
            break
        case '!apagar':
            if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id)
            if (!isGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado por administradores de grupo', id)
            if (!quotedMsg) return client.reply(from, 'Errado !!, envie o comando *!apagar [marqueamensagem] *', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Errado !!, o bot não pode deletar o chat de outro usuário!', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break

        case '!ajuda':
            client.sendText(from, help)
            break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        client.kill().then(a => console.log(a))
    }
}
