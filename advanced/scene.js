const { Telegraf, Scenes } = require('telegraf');
const { Stage, BaseScene } = Scenes;
const RedisSession = require('telegraf-session-redis');
const { enter, leave } = Stage;
const env = require('../.env');

const bot = new Telegraf(env.uToken);

const session = new RedisSession({
	store: {
		host: '127.0.0.1',
		port: 6379,
	},
});
bot.use(session);

bot.start(async (ctx) => {
	const name = ctx.update.message.from.first_name;
	await ctx.reply(`Seja bem vindo, ${name}!`);
	await ctx.reply('Entre com /echo ou /soma para iniciar . . .');
	ctx.session.sum = 0;
});

const echoScene = new BaseScene('echo');
echoScene.enter((ctx) => ctx.reply('Entrando em Echo Scene'));
echoScene.leave((ctx) => ctx.reply('Saindo de Echo Scene'));
echoScene.command('sair', leave());

echoScene.on('text', (ctx) => ctx.reply(ctx.message.text));
echoScene.on('message', (ctx) => ctx.reply('Apenas mensagens de texto.'));

const sumScene = new BaseScene('sum');

sumScene.enter((ctx) => ctx.reply('Entrando em Soma Scene'));
sumScene.leave((ctx) => ctx.reply('Saindo de Soma Scene'));

sumScene.use(async (ctx, next) => {
	await ctx.reply('Você está em Soma Scene, escreva números para somar.');
	await ctx.reply('Outros comandos: /zerar /sair');
	next();
});

sumScene.command('sair', leave());
sumScene.hears(/(\d+)/, (ctx) => {
	ctx.session.sum += +ctx.match[1];
	ctx.reply(`Valor: ${ctx.session.sum}`);
});

sumScene.on('message', (ctx) => {
	ctx.reply('Apenas números, por favor.');
});

const stage = new Stage([echoScene, sumScene]);

bot.use(stage.middleware()); // Através desse método o bot tem acesso as cenas
bot.command('soma', enter('sum'));
bot.command('echo', enter('echo'));
bot.on('message', (ctx) =>
	ctx.reply('Entre com /echo ou /soma para iniciar . . .'),
);

bot.launch();
