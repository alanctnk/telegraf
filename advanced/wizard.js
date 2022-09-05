/* eslint-disable @typescript-eslint/no-floating-promises */
const { Composer, Markup, Scenes, session, Telegraf } = require('telegraf')
const RedisSession = require('telegraf-session-redis')
const env = require("../.env")

const redis_session = new RedisSession({
	store: {
		host: '127.0.0.1',
		port: 6379
	}
})

if (env.token === undefined) {
	throw new Error('BOT_TOKEN must be provided!')
}

const stepHandler = new Composer()
stepHandler.action('next', async (ctx) => {
	await ctx.reply('Step 2. Via inline button')
	return ctx.wizard.next()
})

stepHandler.command('next', async (ctx) => {
	await ctx.reply('Step 2. Via command')
	return ctx.wizard.next()
})

stepHandler.use((ctx) =>
	ctx.replyWithMarkdown('Press `Next` button or type /next')
)

const superWizard = new Scenes.WizardScene(
	'super_wiz',
	async (ctx) => {
	await ctx.reply(
		'Step 1',
		Markup.inlineKeyboard([
		Markup.button.url('❤️', 'http://telegraf.js.org'),
		Markup.button.callback('➡️ Next', 'next'),
		])
	)
	return ctx.wizard.next()
	},
	stepHandler,
	async (ctx) => {
		await ctx.reply('Step 3')
		return ctx.wizard.next()
	},
	async (ctx) => {
		await ctx.reply('Step 4')
		return ctx.wizard.next()
	},
	async (ctx) => {
		await ctx.reply('Done')
		return await ctx.scene.leave()
	}
)

const bot = new Telegraf(env.token)

bot.catch(() => console.log("Bot error"))

const stage = new Scenes.Stage([superWizard], {	default: 'super_wiz',})

// TODO: implement redis session or similar to avoid this deprecated method.
bot.use(session())
bot.use(stage.middleware())
bot.launch().then(() => console.log(`Bot running . . .`))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
