const { Telegraf, Markup } = require("telegraf")
const env = require("../.env")

const bot = new Telegraf(env.token)

let list = []

const buttons = () => Markup.inlineKeyboard(
    list.map(item => Markup.button.callback(item, `del ${item}`)),
    { columns: 3 }
)

bot.start( async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo, ${name}`)
    await ctx.reply("Escreva os itens que você deseja adicionar ...")
})

bot.on("text", ctx => {
    const item = ctx.update.message.text
    list.push(item)
    ctx.reply(`Item ${item} adicionado!`, buttons())
})

bot.action(/del (.+)/, ctx => {
    list = list.filter(item => item !== ctx.match[1])
    ctx.reply(`Item ${ctx.match[1]} deletado!`, buttons())
})

bot.launch()