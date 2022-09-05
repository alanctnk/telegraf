const { Telegraf, Markup } = require("telegraf")
const env = require("../.env")
const moment = require("moment")

const bot = new Telegraf(env.token)

const optKeyboard = Markup.keyboard([
    ["op1", "op2", "op3" ],
    ["option4", "option5"],
    ["myOption6"]
]).resize()

bot.start(async ctx => {
    await ctx.reply(`Seja bem vindo, ${ctx.update.message.from.first_name}`)
    await ctx.reply("Qual bebida vc prefere?", Markup.keyboard(["Coca", "Pepsi"]).resize().oneTime())
})

bot.hears(["Coca", "Pepsi"], async ctx => {
    await ctx.reply(`Nossa eu também gosto de ${ctx.match}!`)
    await ctx.reply("Qual a sua opção?", optKeyboard)
})

bot.hears("option4", ctx => ctx.reply("Opa dessa eu gostei rs"))
bot.on("text", ctx => ctx.reply("Hmm"))

bot.launch()