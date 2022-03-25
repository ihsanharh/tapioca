const channels = require("../../config/channel.json");

module.exports = async (member, client) => {
	const farewellChannel = member.guild.channels.cache.get(channels["goodbye"]);
	let message = `**${member.user.tag}** just left the server :c`
	
	const fetch_logs = await member.guild.fetchAuditLogs({
		limit: 1
	});
	
	if (fetch_logs) {
		const logs = fetch_logs.entries.first();
		
		if (logs.action === "MEMBER_KICK" || logs.action === "MEMBER_BAN_ADD") {
			const at = logs.createdTimestamp + 10000;
			
			if (logs.target.id === member.id && at > Date.now()) {
				const actions = {
					"MEMBER_KICK": "has been kicked by",
					"MEMBER_BAN_ADD": "has been banned by"
				}
				
				message = `**${member.user.tag}** ${actions[logs.action]} **${logs.executor.tag}**.`
				
				if (logs.reason) message += ` With reason ${logs.reason}`
			}
		}
	}
	
	if (farewellChannel) {
		farewellChannel.send({
			content: message
		});
	}
}
