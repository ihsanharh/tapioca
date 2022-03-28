const { model, Schema } = require('mongoose');

module.exports = model("ticket", new Schema({
	userId: { type: String, default: null },
	channelId: { type: String, default: null },
	ticketId: { type: String, default: null },
	closedAt: { type: String, default: null },
	message: {
		thanks: { type: String, default: null }
	}
}));
