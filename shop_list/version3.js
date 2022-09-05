const { Telegraf, Markup } = require("telegraf")
const RedisSession = require('telegraf-session-redis')
const env = require("../.env")

const bot = new Telegraf(env.token)

// telegraf-session-redis: https://github.com/telegraf/telegraf-session-redis
// docker run -d --name redis_session -p 6379:6379 redis:7.0.4-alpine
const session = new RedisSession({
    store: {
        host: '127.0.0.1',
        port: 6379
    }
})  

const buttons = list => Markup.inlineKeyboard(
    list.map(item => Markup.button.callback(item, `del ${item}`)),
    { columns: 3 }
)

bot.use(session)

const checkUser = (ctx, next) => {
    const sameIDmsg = ctx.update.message
        && ctx.update.message.from.id === env.userID

    const sameIDCallback = ctx.update.callback_query
        && ctx.update.callback_query.from.id === env.userID

    if(sameIDmsg || sameIDCallback) {
        return next()
    }
    return ctx.reply("No momento disponível apenas para meu Mestre!")
}

const process = (ctx, next) => ctx.reply("Processando . . . ").then(() => next())

bot.start(checkUser, process, async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo, ${name}`)
    await ctx.reply("Escreva os itens que você deseja adicionar ...")
    ctx.session.list = []
})

bot.on("text", checkUser, process, ctx => {
    const item = ctx.update.message.text
    ctx.session.list.push(item)
    ctx.reply(`Item ${item} adicionado!`, buttons(ctx.session.list))
})

bot.action(/del (.+)/, checkUser, ctx => {
    ctx.session.list = ctx.session.list.filter(item => item !== ctx.match[1])
    ctx.reply(`Item ${ctx.match[1]} deletado!`, buttons(ctx.session.list))
})

bot.launch()