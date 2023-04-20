/* eslint-disable @typescript-eslint/no-floating-promises */
const { Composer, Markup, Scenes, Telegraf } = require('telegraf');
const { enter } = Scenes.Stage;
// const RedisSession = require('telegraf-session-redis');
// const LocalSession = require('telegraf-session-local');
const RedisSession = require('telegraf-session-redis');
const env = require('../.env');

const session = new RedisSession({
	store: {
		host: '127.0.0.1',
		port: 6379,
	},
});

if (env.uToken === undefined) {
	throw new Error('BOT_TOKEN must be provided!');
}

const stepHandler = new Composer();

stepHandler.action('next', async (ctx) => {
	await ctx.reply('Step 2. Via inline button');
	return ctx.wizard.next();
});

stepHandler.command('next', async (ctx) => {
	await ctx.reply('Step 2. Via command');
	return ctx.wizard.next();
});

stepHandler.use((ctx) =>
	ctx.replyWithMarkdownV2('Press `Next` button or type /next'),
);

const superWizard = new Scenes.WizardScene(
	'super_wiz',
	async (ctx) => {
		await ctx.reply(
			'Step 1',
			Markup.inlineKeyboard([
				Markup.button.url('❤️', 'http://telegraf.js.org'),
				Markup.button.callback('➡️ Next', 'next'),
			]),
		);
		return ctx.wizard.next();
	},
	stepHandler,
	async (ctx) => {
		await ctx.reply('Step 3');
		return ctx.wizard.next();
	},
	async (ctx) => {
		await ctx.reply('Step 4');
		return ctx.wizard.next();
	},
	async (ctx) => {
		await ctx.reply('Done');
		// OR IMPORT leave from Stage and do `leave()(ctx)`
		return await ctx.scene.leave();
	},
);
superWizard.leave((ctx) => ctx.reply('Leaving . . . '));

const bot = new Telegraf(env.uToken);
bot.use(session);
bot.catch((e) => console.log('Bot error\n' + `${e}`));

const stage = new Scenes.Stage([superWizard]);

// bot.use(local_session.middleware());
bot.use(stage.middleware());

bot.start((ctx) => {
	ctx.reply('Hello press /test');
});
bot.command('test', enter('super_wiz'));

bot.launch().then(() => console.log(`Bot running . . .`));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
