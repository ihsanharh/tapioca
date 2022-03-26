const { Client, Collection, Intents } = require('discord.js');
const { readdirSync } = require('fs');
const textInput = require("../../lib/discord-modals");

class Tapioca extends Client {
	constructor() {
		super({
      allowedMentions: {
        parse: [
          "roles",
          "users",
          "everyone"
        ],
        repliedUser: false
      },
      partials: [
        "MESSAGE",
        "GUILD_MEMBER",
        "CHANNEL",
        "REACTION",
        "USER"
      ],
      intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
				Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.GUILD_MESSAGE_TYPING,
				Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS
			]
		});
		
		this.commands = new Collection();
	}
	
	start() {
		this.prepare();
		
		this.login(process.env.TOKEN);
	}
	
	prepare() {
		const basePath = __dirname.replace("base", "");
		
		textInput(this);
		
		readdirSync(basePath + "/listeners/").forEach(folder => {
			readdirSync(basePath + `/listeners/${folder}`).forEach(file => {
				const event = require(`../listeners/${folder}/${file}`);
				
				this.on(file.replace(".js", ""), (...args) => {
					event(...args, this);
				});
			});
		});
		
		readdirSync(basePath + "/modules/").forEach(folder => {
			readdirSync(basePath + `/modules/${folder}/`).forEach(file => {
				const command = new (require(`../modules/${folder}/${file}`))(this);
				
				this.commands.set(command.name, command);
			});
		});
	}
}

module.exports = Tapioca;
