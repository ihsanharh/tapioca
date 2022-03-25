const { readFileSync, writeFileSync } = require('fs');
const Command = require("../../base/Command.js");
const colors = require("../../assets/color.json");
const rrOptions = require("../../assets/match/rr.json");
const rrImages = require("../../assets/images/rr.json");

class rrCommand extends Command {
	constructor(client) {
		super(client, {
			name: "sendrr",
			description: "send rr",
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
		let rrMessages = __dirname.replace("modules/adminModules", "") + "/assets/messages/rr.txt";
		let messages = readFileSync(rrMessages, "utf8");
		messages = messages.split("GAP");
		const messageArray = [];
		
		const separate = (item) => {
			return item.replace(/<|>|@|&/g, "").split(":").filter(item => item);
		}
		
		messages.forEach(message => {
			command.channel.send({
				embeds: [
					{
						color: colors["rr"],
						image: {
							url: rrImages[messages.indexOf(message)]
						}
					}
				]
			}).then(Message => messageArray.push(Message.url));
			
			command.channel.send({
				embeds: [
					{
					  description: message,
					  color: colors["rr"],
					  footer: {
					  	text: rrOptions[messages.indexOf(message)]["question"]
					  }
					}
				],
				components: [
					{
						type: 1,
						components: [
							{
								type: 3,
								custom_id: `${messages.indexOf(message)}_rr`,
								options: [
									...(Object.keys(rrOptions[messages.indexOf(message)]).map((key, index) => {
										if (key === "question") return []
										
										const role = command.guild.roles.cache.get(separate(rrOptions[messages.indexOf(message)][key])[0]);
										
										return [
											{
												label: `${role.name}`,
												value: `${role.id}`,
												emoji: {
													name: separate(key)[0],
													id: separate(key)[1]
												}
											}
										]
									}))
								],
								max_values: Object.keys(rrOptions[messages.indexOf(message)]).length - 1
							}
						]
					}
				]
			}).then(Message => {
				messageArray.push(Message.url);
				
				if (messageArray.length >= 10) return command.channel.send({
					embeds: [
						{
							color: colors["rr"],
							image: {
								url: rrImages[5]
							}
						}
					],
					components: [
						{
							type: 1,
							components: [
								{
									type: 2,
									style: 5,
									label: "Scroll to the Top",
									url: "https://discord.com/channels/954440824127643698/954440825167835146/956975811364282388"
								}
							]
						}
					]
				}).then(Msg => {
					messageArray.push(Msg.url)
					
					writeFileSync(__dirname.replace("modules/adminModules", "") + "/assets/messages/storedrr.txt", messageArray.join(" "));
				})
			});
		});
	}
}

module.exports = rrCommand;
