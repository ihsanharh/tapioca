const { readFileSync } = require('fs');
const { nanoid } = require('nanoid');
const colors = require("../../assets/color.json");
const channels = require("../../config/channel.json")
const rrOptions = require("../../assets/match/rr.json");

const TicketManager = require("../../plugins/TicketManager.js");

const separate = (item) => {
	return item.replace(/<|>|@|&/g, "").split(":").filter(item => item);
}

module.exports = async (interaction, client) => {
	if (interaction.user.bot) return interaction.reply({ content: "You're bot.", ephemeral: true });
	
	if (interaction.isCommand()) {
		/**
		 * Slash Command handler
		 * @return {Interaction}
		 */
		interaction.prefix = "/";
		var command = client.commands.get(interaction.commandName);
		
		if (command) {
			if (command.private) {
				if (interaction.user.id !== process.env.OWNER_ID) return interaction.reply({ content: "no.", ephemeral: true });
			}
			
			if (command.permission.author.length >= 1 && interaction.user.id !== process.env.OWNER_ID) {
				if (interaction.channel.permissionsFor(interaction.member).missing(command.permission.author).length >= 1) {
					return interaction.reply({ content: `**You can't use that.**` });
				}
			}
			
			try {
				return command.props(interaction);
			} catch(error) {
				console.log(error);
			}
		}
	}
	
	if (interaction.isSelectMenu()) {
		/**
		 * Selection Roles
		 * 
		 */
		if (interaction.customId.includes("_rr")) {
			let added = [];
			let removed = [];
			
			interaction.values.forEach(async selected => {
				const role = interaction.guild.roles.cache.get(selected);
				
				if (!role) {
					return interaction.reply({ content: "This role does not exist anymore:/ Please contact staff to fix it.", ephemeral: true });
				}
				
				if (!interaction.member.roles.cache.has(role.id)) {
					added.push(role);
					await interaction.member.roles.add(role);
				} else {
					removed.push(role);
					await interaction.member.roles.remove(role);
				}
			});
			
			added = added.map(role => { return role }).join(", ");
			removed = removed.map(role => { return role }).join(", ");
			
			let message = " "
			if (added.length >= 1 && removed.length < 1) {
				message += "Added {aroles} to you. ";
			} else if (removed.length >= 1 && added.length < 1) {
				message += "Removed {rroles} from you. ";
			} else if (added.length >= 1 && removed.length >= 1) {
				message += "Added {aroles} to you and removed {rroles} from you."
			}
			
			return interaction.reply({ content: message.replace(/{aroles}/g, added).replace(/{rroles}/g, removed), ephemeral: true });
		}
	}
	
	if (interaction.isButton()) {
		TicketManager(interaction, client);
	}
}
