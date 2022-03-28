const Ticket = require("../structures/database/ticket.js");
const channels = require("../config/channel.json");
const colors = require("../assets/color.json");

const { readFileSync } = require('fs');
const { nanoid } = require('nanoid');

module.exports = async (interaction, client) => {
	const log_channel = interaction.guild.channels.cache.get(channels["ticket-log"]);
	const button = interaction;
	
	if (button.customId === "create_ticket") {
		await interaction.deferReply({ ephemeral: true });
		
		const findOpen = await Ticket.find({ userId: interaction.user.id });
		
		if (findOpen.length >= 1) {
			const filterIt = findOpen.filter(ticket => !ticket.closedAt);
			
			if (filterIt.length >= 1) {
				return interaction.editReply({
					content: `You already have ticket opened at <#${filterIt[0].channelId}>`,
					ephemeral: true
				});
			}
		}
		
		const ticket_id = nanoid();
		
		interaction.guild.channels.create(`t-${ticket_id}`, {
			type: "GUILD_TEXT",
			topic: `Ticket for ${interaction.user}`,
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: ["VIEW_CHANNEL"]
				},
				{
					id: interaction.user.id,
					allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
				}
			]
		}).then(async (ticketChannel) => {
			interaction.editReply({ content: `Ticket created! ${ticketChannel}`, ephemeral: true });
			
			const message = (readFileSync(__dirname.replace("plugins", "") + "assets/messages/ticket.txt", "utf8")).split("GAP")[1];
			
			const thanks_message = await ticketChannel.send({
				embeds: [
					{
						description: message,
						timestamp: new Date(),
						color: colors["ticket"],
						footer: {
							text: `Ticket ID: ${ticket_id}`,
							icon_url: interaction.user.displayAvatarURL({ dynamic: true })
						},
						author: {
							name: interaction.guild.name,
							icon_url: interaction.guild.iconURL({ dynamic: true })
						}
					}
				],
				components: [
					{
						type: 1,
						components: [
							{
								type: 2,
								style: 4,
								label: "Close Ticket",
								custom_id: "close_ticket"
							}
						]
					}
				]
			})
			
			new Ticket({
				userId: interaction.user.id,
				ticketId: ticket_id,
				channelId: ticketChannel.id,
				message: {
					thanks: thanks_message.id
				}
			}).save();
			
			ticketChannel.send({ content: `<@&954440824240873525> <@&954440824240873522> <@&954440824240873524>` }).then(msg => {
				setTimeout(() => { msg.delete() }, 1000)
			});
			
			if (log_channel) {
				log_channel.send({
					embeds: [
						{
							title: "Click here!",
							url: thanks_message.url,
							timestamp: new Date(),
							color: colors["ticket"],
							footer: {
								text: `Requested by ${interaction.user.tag}`,
								icon_url: interaction.user.displayAvatarURL({ dynamic: true })
							},
							author: {
								name: "New Ticket",
								url: `https://discord.com/users/${interaction.user.id}`,
								icon_url: interaction.guild.iconURL({ dynamic: true })
							},
							fields: [
								{
									name: "Ticket ID",
									value: `${ticket_id}`,
									inline: true
								},
								{
									name: "Status",
									value: "Waiting for staff",
									inline: true
								}
							]
						}
					]
				})
			}
		});
	}
	
	if (button.customId === "close_ticket") {
		const ticket_data = (await Ticket.find({ userId: interaction.user.id })).filter(data => data.ticketId.toLowerCase() === interaction.channel.name.replace("t-", ""))[0];
		
		return interaction.reply({
			fetchReply: true,
			ephemeral: true,
			content: `Are you sure you want to close this Ticket?`,
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							style: 4,
							label: "Close this Ticket",
							custom_id: "close_confirmed"
						},
						{
							type: 2,
							style: 4,
							label: "Cancel",
							custom_id: "close_cancelled"
						}
					]
				}
			]
		}).then(confirmation_message => {
			confirmation_message.createMessageComponentCollector()
			.on('collect', async i => {
				if (i.customId === "close_cancelled") {
					i.update({ content: "Action cancelled.", components: [], ephemeral: true });
				}
				
				if (i.customId === "close_confirmed") {
					const thanks_message = i.channel.messages.cache.get(ticket_data.message.thanks);
					
					i.update({ content: "Ticket closed.", components: [], ephemeral: true });
					i.channel.edit({
						permissionOverwrites: [
							{
								id: i.user.id,
								allow: ["VIEW_CHANNEL"],
								deny: ["SEND_MESSAGES"]
							},
							{
								id: i.guild.id,
								deny: ["VIEW_CHANNEL"]
							}
						]
					})
					
					if (thanks_message) thanks_message.edit({
						content: `This ticket has been closed by ${i.user}`,
						embeds: [
							{
								color: colors["red"],
								footer: {
									text: `Closed at`
								},
								timestamp: new Date()
							}
						],
						components: [
							{
								type: 1,
								components: [
									{
										type: 2,
										style: 4,
										label: "Delete this ticket",
										custom_id: "delete_ticket"
									}
								]
							}
						]
					});
					
					await Ticket.updateOne({ ticketId: ticket_data.ticketId }, {
						$set: {
							closedAt: new Date()
						}
					})
				}
			})
		})
	}
	
	if (button.customId === "delete_ticket") {
		interaction.channel.delete();
	}
}
