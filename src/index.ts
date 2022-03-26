require('dotenv').config({ path: __dirname.replace("src", "") + `.env.development` });
require('http').createServer(function(req, res) {
	res.write("Hello World!");
	res.end();
}).listen(process.env.PORT);
new (require("./base/Client"))().start();
