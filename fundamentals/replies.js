const { Telegraf } = require('telegraf');
const env = require('../.env');

const bot = new Telegraf(env.token);

bot.start(async (ctx) => {
	const { from } = ctx.update.message;
	await ctx.reply(`Seja bem vindo, ${from.first_name}`);
	await ctx.replyWithHTML(`
        Destacando mensagem <b>HTML</b> com <i>diferentes</i> <code>formas</code> <pre>possíveis</pre>
        <a href="https://www.google.com">Google</a>
    `);
	await ctx.replyWithMarkdownV2(
		'Destacando mensagem *Markdown* ' +
			'_de várias_ `formas` ```possíveis``` ' +
			'[Google](https://www.google.com)',
	);

	await ctx.replyWithPhoto({ source: `${__dirname}/assets/braz.png` });
	await ctx.replyWithPhoto(
		'https://cdn.imgbin.com/14/16/23/imgbin-sports-association-boxing-computer-icons-brazilian-jiu-jitsu-boxing-5KMQfAir5MvSSEtaWmja2Ueux.jpg',
		{
			caption: 'Bom treino!',
		},
	);
	await ctx.replyWithPhoto({
		url: 'https://thumbs.dreamstime.com/b/mascot-icon-illustration-brazilian-jiu-jitsu-gracie-jujutsu-master-arms-folded-viewed-font-isolated-183890261.jpg',
	});

	await ctx.replyWithLocation(-3.75234496847403, -38.5264936538391);
	await ctx.replyWithVideo(
		'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
	);
});

bot.launch();
