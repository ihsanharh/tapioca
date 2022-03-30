const { Collection } = require('discord.js');
const { readFileSync } = require('fs');
const md5 = require('md5');
const superagent = require('superagent');
const colors = require("../assets/color.json");
const channels = require("../config/channel.json");

let cookies, cbsid, xai, lastResponse;
let lastCookieUpdate = 0;
let ctx = [];
let useragent = "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_6_3) AppleWebKit/5362 (KHTML, like Gecko) Chrome/39.0.826.0 Mobile Safari/5362";

/**
 * get reply from cleverbot
 * modified version of https://github.com/IntriguingTiles/cleverbot-free
 */
async function reply(user, stimulus, context = [], language) {
	const _context = context.slice();
	
	if (cookies == null || Date.now() - lastCookieUpdate >= 86400000) {
		const date = new Date();
    const req = await superagent.get(`https://www.cleverbot.com/extras/conversation-social-min.js?${date.getFullYear()}${date.getMonth().toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`).set("User-Agent", useragent);
		cookies = req.header["set-cookie"];
    lastCookieUpdate = Date.now();
  }
  
  let payload = `stimulus=${encodeURI(stimulus)}&`;
  const reverseContext = _context.reverse();
  
  for (let i = 0; i < _context.length; i++) {
    payload += `vText${i + 2}=${encodeURI(reverseContext[i])}&`;
  }
  
  payload += `${language ? `cb_settings_language=${language}&` : ""}cb_settings_scripting=no&islearning=1&icognoid=wsf&icognocheck=`;
  payload += md5(payload.substring(7, 33));
  
  for (let i = 0; i < 15; i++) {
  	try {
  		const req = await superagent.post(`https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI${cbsid ? `&out=${encodeURIComponent(lastResponse)}&in=${encodeURIComponent(stimulus)}&bot=c&cbsid=${cbsid}&xai=${xai}&ns=2&al=ru&dl=ru&flag=&user=${encodeURI(user)}&mode=1&alt=0&reac=&emo=&sou=website&xed=&` : ""}`)
  		.timeout({
  			response: 120000,
  			deadline: 60000,
      })
      .set("Cookie", `${cookies[0].split(";")[0]}; _cbsid=-1`)
      .set("User-Agent", useragent)
      .type("text/plain")
      .send(payload);
      
      cbsid = req.text.split("\r")[1];
      xai = `${cbsid.substring(0, 3)},${req.text.split("\r")[2]}`;
      lastResponse = req.text.split("\r")[0];
      
      return lastResponse;
  	} catch (err) {
      if (err.status === 503) {
      	await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
      	throw err;
      }
    }
  }
  
  throw "Failed to get a response after 15 tries";
}

module.exports = async (message) => {
	if (message.author.bot) return;
	if (message.channel.id !== channels["talk"]) return;
	
	reply(message.author.username, message.content, ctx).then((response) => {
		response = response.toLowerCase().replace(/cleverbot|clever bot/g, "tapioca");
		
		ctx.push(message.content);
		ctx.push(response);
		
		message.channel.sendTyping();
		
		setTimeout(() => {
			var MessagePayload = { content: `${response}` };
			
			if (message.channel.lastMessageId !== message.id) Object.assign(MessagePayload, { reply: { messageReference: message } });
			
			message.channel.send(MessagePayload).then(async (Message) => {
				const pm = readFileSync(__dirname.replace("plugins", "") + "/assets/messages/promote.txt", "utf8");
				if (Math.random() < 10/100) {
					Message.edit({
						embeds: [
							{
								description: `${pm}`,
								color: colors['rr']
							}
						]
					});
				}
			});
		}, response.length * 250);
	}).catch((err) => {
		console.log(err)
		return message.reply({ content: `\`\`\`\nOh no! Something went wrong. Please try again in a few minutes.\`\`\`` });
	});
}
