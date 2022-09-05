const { Telegraf } = require("telegraf")
const env = require("../.env")
const moment = require("moment")

const bot = new Telegraf(env.token)

bot.start(ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Seja bem vindo, ${name}!\nAvise se precisar de /ajuda.`)
})

bot.command("ajuda", ctx => ctx.reply("Acionado pelo command /ajuda 👍."))
bot.launch()