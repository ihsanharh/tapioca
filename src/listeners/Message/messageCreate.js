const config = require("../../config/config.json");

module.exports = async (message, client) => {
	if (!message.guild) return;
	
	message.prefix = config.default_prefix;
	
	if (message.author.bot) return;
	if (!message.content.startsWith(message.prefix)) return;
	
	message.args = message.content.slice(message.prefix.length).trim().split(/[ ?]+/g);
	
  var commandName = message.args.shift().toLowerCase();
  var command = client.commands.get(commandName)
  
	if (command) {
		if (command.private) {
			if (message.author.id !== process.env.OWNER_ID) return;
		}
		
		if (command.permission.author.length >= 1 && message.author.id !== process.env.BOT_OWNER_ID) {
			var check_permission = message.channel.permissionsFor(message.member).missing(command.permission.author);
			
			if (check_permission.length >= 1) {
				return message.channel.send({ content: `**You can't use that.**` });
			}
		}
		
		try {
			return command.props(message);
		} catch(error) {
			console.log(error);
		}
	}
}
