const Command = require("../../base/Command.js");
const { cutString } = require("../../controllers/Function.js");
const util = require('util');

class evalCommand extends Command {
	constructor(client) {
		super(client, {
			name: "eval",
			description: "evaluate something",
			active: true,
			private: true,
			slash: true,
			options: [
				{
					type: 3,
					name: "code",
					description: "code to evaluate",
					required: true
				}
			],
			usages: [
				"{prefix}eval this.reply({ content: \"hi\" })",
				"{prefix}eval console.log(\"log!\")"
			],
			permission: {
				author: [],
				me: []
			}
		});
	}
	
	async execute(command) {
		let code = (await this.args({ name: 'code', join: true }))[0];
		
    if (!code) return this.reply({ content: "give something to evaluate!" });
    
    var clean = async (text) => {
      if (text && text.constructor.name == "Promise") text = await text;
      if (typeof text !== "string") text = util.inspect(text, { depth: 1 });
      
      text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      text = text.replaceAll(this.client.token, "Bot");
      
      return cutString(text, 1950);
    }
    
    try {
      var evaled = eval(code);
      var cleaned_result = await clean(evaled);
      
      return this.reply({ content: `\`\`\`js\n${cleaned_result}\n\`\`\`` });
    } catch (err) {
    	var cleaned_error = await clean(err);
    	
      return this.reply({ content: `\`\`\`js\n${cleaned_error}\n\`\`\`` });
    }
	}
}

module.exports = evalCommand;
