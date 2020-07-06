const axios = require("axios");
const { spawn } = require("child_process");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const readAsync = util.promisify(require("fs").readFile);
const writeAsync = util.promisify(require("fs").writeFile);

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
		output.stdout.on("data", (data) => {
			//console.log(data.toString());
		});

		output.stderr.on("data", (data) => {
			//console.log(data.toString());
		});

		const exitCode = await new Promise((resolve) => {
			output.on("close", resolve);
		});
		return exitCode;
	},
	execProcess: async (cmd) => {
		try {
			console.log(cmd);
			const { stdout, stderr } = await exec(cmd);
			return stdout;
		} catch (err) {
			console.log(err);
		}
	},
	getFmtDate: (diff = 0) => {
		const date = new Date(Date.now() + diff * 24 * 60 * 60 * 1000);
		const dateStr = date.toISOString().split("T")[0].split("-");
		const fmtDate = `${dateStr[2]}-${dateStr[1]}-${dateStr[0]}`;
		return fmtDate;
	},
	readFile: async (file) => {
		let data;
		try {
			data = await readAsync(file, { encoding: "utf-8" });
			return data;
		} catch (err) {
			console.log(err);
		}
	},
	writeFile: async (file, data) => {
		try {
			await writeAsync(file, data);
		} catch (err) {
			console.log(err);
		}
	},
}
// TODO: @critical

