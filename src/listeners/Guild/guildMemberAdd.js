const { readFileSync } = require('fs');
const channels = require("../../config/channel.json");
const welcomeAssets = require("../../assets/gifs/welcome.json");
const color = require("../../assets/color.json");

module.exports = async (member, client) => {
	const welcomeMessage_file = __dirname.replace("listeners/Guild", "") + "/assets/messages/welcome.txt";
	const welcomeChannel = member.guild.channels.cache.get(channels["welcome"]);
	
	if (welcomeChannel) {
		let message = readFileSync(welcomeMessage_file, "utf8");
		message = message.replace(/(?:\r\n|\r|\n)/g, "\n")
		
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
