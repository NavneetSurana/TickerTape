const axios = require("axios");
const spawn = require("child_process").spawn;

module.exports = {
	getData: async (req) => {
		let res;
		try {
			res = await axios(req);

			await require("fs").appendFile("./errorlogs.json", res.data, (err) => {
				if (err) console.log("Error writing file:", err);
			});
		} catch (error) {
			if (error.response) {
				// Request made and server responded
				res = {
					status: error.response.status,
					data: error.response.data,
				};
			} else if (error.request) {
				// The request was made but no response was received
				res = { status: 400, request: error.request };
			} else {
				// Something happened in setting up the request that triggered an Error
				res = { status: "ERROR", message: error.message };
				//console.log(res);
			}
			res.url = req;
			await require("fs").appendFile(
				"./errorlogs.json",
				`ERROR---------------\n${JSON.stringify(
					res,
					function replacer(key, value) {
						return value;
					},
					4
				)}\n`,
				(err) => {
					if (err) console.log("Error writing file:", err);
				}
			);
		}
		//return res;
	},
	spawnProcess: async (cmd, cmdOptions, options) => {
		const output = spawn(cmd, cmdOptions, options);
		// output.stdout.on("data", (data) => {
		// 	console.log("data");
		// });

		// output.stderr.on("data", (data) => {
		// 	console.error("error");
		// });

		const exitCode = await new Promise((resolve) => {
			output.on("close", resolve);
		});
		return exitCode;
	},
};
