const { nanoid } = require('nanoid');

class Ticket {
	constructor(interaction) {
		this.id = nanoid();
		this.user = interaction.user
	}
	
	static create(interaction) {
		new this(interaction);
	}
}

module.exports = Ticket;
