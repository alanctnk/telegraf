const { Telegraf } = require("telegraf")
const env = require("../.env")
const moment = require("moment")

const bot = new Telegraf(env.token)

bot.hears("Tigre", ctx => ctx.reply("tigre tigre que flamejas"))
bot.hears(["pera", "uva"], ctx => ctx.reply("Quero!"))
bot.hears("🐷", ctx => ctx.reply("Bacon ❤️"))
bot.hears(/burguer/i, ctx => ctx.reply("Estou de dieta!"))
bot.hears(/(\d{2}\/\d{2}\/\d{4})/, ctx => {
    moment.locale("pt-BR")
    const date = moment(ctx.match[1], 'DD/MM/YYYY')
    ctx.reply(`${ctx.match[1]} cai em ${date.format('dddd')}`)
})

bot.launch()