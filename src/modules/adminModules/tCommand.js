const { readFileSync } = require('fs');
const Command = require("../../base/Command.js");

class tCommand extends Command {
	constructor(client) {
		super(client, {
			name: "sendst",
			description: "send st",
			active: true,
			private: true,
			slash: false,
			options: [],
			usages: [],
			permission: {
				author: ["ADMINISTRATOR"],
				me: []
			}
		});
	}
	
	async execute(command) {
		let ticketMessages = __dirname.replace("modules/adminModules", "") + "/assets/messages/ticket.txt";
		let message = readFileSync(ticketMessages, "utf8").split("GAP")[0];
		
		return command.channel.send({
			embeds: [
				{
					description: message,
					color: this.colors["ticket"],
					thumbnail: {
						url: command.guild.iconURL({ dynamic: true })
					}
				}
			],
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							style: 1,
							label: "Create a ticket",
							custom_id: "create_ticket",
							emoji: "📩"
						}
					]
				}
			]
		})
	}
}

module.exports = tCommand;
