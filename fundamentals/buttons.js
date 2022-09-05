const { Telegraf, Markup  } = require("telegraf")
const moment = require("moment")
const env = require("../.env")

const bot = new Telegraf(env.token)

let count = 0

const buttons = Markup.inlineKeyboard([
    Markup.button.callback("+1", "add 1"),
    Markup.button.callback("+10", "add 10"),
    Markup.button.callback("+100", "add 100"),
    Markup.button.callback("Zerar", "reset"),
    Markup.button.callback("Resultado", "result"),
], { columns: 3 })

bot.start(async ctx => {
    const name =  ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo, ${name}`)
    await ctx.reply(`A contagem atual está em ${count}`, buttons)
})

bot.action(/add (\d+)/, ctx => {
    count += +ctx.match[1]
    ctx.reply(`A contagem atual está em ${count}`, buttons )
})

bot.action("reset", ctx => {
    count = 0
    ctx.reply(`A contagem atual está em ${count}`, buttons )
})

bot.action("result", ctx => {
    ctx.answerCbQuery(`A contagem atual está em ${count}`)
})

bot.launch()