const { readFileSync } = require('fs');
const channels = require("../../config/channel.json");
const welcomeAssets = require("../../assets/gifs/welcome.json");
const color = require("../../assets/color.json");
const welcomeRole = require("../../assets/role/welcome.json");

module.exports = async (member, client) => {
	
	/**
	 * @return {GuildMemberUserBot}
	 * @return {Role}
	 * will triggered if the user who joined is a bot
	 */
	if (member.user.bot) {
		member.guild.fetchAuditLogs({ limit: 1 }).then(logs => {
			const info = logs.first();
			
			if (info.action === "BOT_ADD") {
				const staffChannel = member.guild.channels.cache.get(channels["staff"]);
				const botRole = member.guild.roles.cache.get(welcomeRole["bot"]);
				
				if (botRole) member.roles.add(botRole);
				if (staffChannel) {
					return staffChannel.send({
						content: `${executor} added bot ${target} to the server.`
					})
				}
			}
		});
	}
	
	/**
	 * @return {GuildMember}
	 * @return {Role}
	 * Welcome message for normal user
	 */
	const welcomeMessage_file = __dirname.replace("listeners/Guild", "") + "/assets/messages/welcome.txt";
	const welcomeChannel = member.guild.channels.cache.get(channels["welcome"]);
	
	welcomeRole["roles"].forEach(roleId => {
		const roleToAdd = member.guild.roles.cache.get(roleId);
		
		if (roleToAdd) member.roles.add(roleToAdd);
	})
	
	if (welcomeChannel) {
		let message = readFileSync(welcomeMessage_file, "utf8");
		message = message.replace(/(?:\r\n|\r|\n)/g, "\n");
		
		welcomeChannel.send({
			content: `${member.user}`,
			embeds: [
				{
					description: message,
					color: color["welcome"],
					image: {
						url: welcomeAssets["welcome"]
					}
				}
			]
		});
	}
}
