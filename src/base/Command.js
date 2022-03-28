class Command {
	constructor(client, options) {
		Object.assign(this, options);
		
		Object.defineProperty(this, "client", { value: client });
		
		Object.defineProperty(this, "colors", { value: require("../assets/color.json") });
		
		Object.defineProperty(this, "command", { value: null, writable: true });
	}
	
	async args(options) {
		if (this.slash) {
			var optionsArray = [];
			var get_options = this.command.options.get(options.name);
			
			if (get_options) {
				var type = {
					"CHANNEL": "channel",
					"ROLE": "role",
					"BOOLEAN": "value",
					"INTEGER": "value",
					"NUMBER": "value",
					"STRING": "value",
					"USER": get_options.user ? "user" : "member"
				}
				
				let value = this.command.options._getTypedOption(options.name, get_options.type, [type[get_options.type]]);
				optionsArray.push(value[type[get_options.type]]);
			}
			
			return optionsArray;
		} else {
			if (options.mentions) {
				optionsArray = [...this.command.mentions[options.mentions].values()]
				
				if (optionsArray.length < 1) {
					for (let item of this.command.args) {
						try {
							const res = await this.client[options.mentions].fetch(item, { force: true, allowUnknownGuild: true });
							
							optionsArray.push(res)
						} catch(err) {
							console.log(err)
						}
					}
				}
				
				return optionsArray;
			}
			
			if (options.join) {
				return [this.command.args.slice(0).join(" ")]
			}
			
			return this.command.args;
		}
	}
	
	execute() {}
	
	async reply(options) {
		if (this.slash) {
			if (this.command.deferred) {
				return await this.command.editReply(options);
			}
			
			return await this.command.reply(options);
		} else if (this.command.type === "DEFAULT") {
			if (options.inline) {
			  delete options.inline;
			
			  return this.command.reply(options);
		  }
		  
		  return this.command.channel.send(options);
		}
	}
	
	props(command) {
		this.command = command;
		this.slash = this.command.type === "APPLICATION_COMMAND";
		return this.execute(this.command);
	}
}

module.exports = Command;
