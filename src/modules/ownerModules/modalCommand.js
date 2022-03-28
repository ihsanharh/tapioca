const Command = require("../../base/Command.js");

const { showModal } = require("../../../lib/discord-modals");
const { cutString } = require("../../controllers/Function.js");
const util = require('util');

class modalCommand extends Command {
	constructor(client) {
		super(client, {
			name: "modal",
			description: "evaluate something",
			active: true,
			private: true,
			slash: true,
			options: [],
			usages: [],
			permission: {
				author: [],
				me: []
			}
		});
	}
	
	async execute(command) {
		showModal({
			title: "test",
			custom_id: "odod",
			components: [
				{
					type: 1,
					components: [
						{
							type: 4,
							label: "hey",
							custom_id: "hey",
							style: 1
						}
					]
				}
			]
		}, { client: this.client, interaction: command });
	}
}

module.exports = modalCommand;
