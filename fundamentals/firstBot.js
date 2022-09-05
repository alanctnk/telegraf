const { Telegraf } = require("telegraf")
const env = require("../.env")

const bot = new Telegraf(env.token)

bot.start(ctx => {
    const { from } = ctx.update.message
    console.log(from)
    if (from.id == env.userID) {
        return ctx.reply(`Olá Mestre 😎`)
    }
    ctx.reply(`Seja bem vindo, ${from.first_name} 👽`)
})

bot.on("text", ctx => {
    ctx.reply(`Texto [${ctx.update.message.text}] recebido com sucesso!`)})

bot.on("location", ctx => {
    const { location } = ctx.update.message
    console.log(location)
    ctx.reply(`Entendido, você está em
        Lat: ${location.latitude}
        Lon: ${location.longitude}
    `)
})

bot.on("contact", ctx => {
    const { contact } = ctx.update.message
    console.log(contact)
    ctx.reply(`Dados do contato:
        ${contact.first_name} (${contact.phone_number})`)
})

bot.on("voice", ctx => {
    const { voice } = ctx.update.message
    console.log(voice)
    ctx.reply(`Audio recebido. Duração: ${voice.duration} segundos `)
})

bot.on("photo", ctx => {
    const { photo } = ctx.update.message
    console.log(photo)
    photo.forEach((ph, i) => {
        ctx.reply(`Photo ${i+1} tem resolução de ${ph.width}x${ph.height}`)
    })
})

bot.on("sticker", ctx => {
    const { sticker }= ctx.update.message
    console.log(sticker)
    ctx.reply(sticker.emoji)
})

bot.launch()