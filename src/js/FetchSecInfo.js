const axios = require("axios");
const Security = require("./Security.js");
const csv = require("csvtojson");
module.exports = class FetchSecInfo {
	constructor(
		BSEurl = `https://www.bseindia.com/corporates/List_Scrips.aspx`,
		NSEurl = `https://archives.nseindia.com/content/equities/EQUITY_L.csv`
	) {
		this.BSEurl = BSEurl;
		this.NSEurl = NSEurl;
		this.Securities = new Map();
	}
	async getData(req) {
		try {
			const res = await axios(req);
			return res;
		} catch (err) {
			console.log(err);
		}
	}
	async getFromNSE() {
		try {
			//const res = await this.getData(this.NSEurl);
			// const data = await csv({ output: "json" }).fromString(res.data);
			const data = await csv().fromFile("src/assets/nseEquity.csv");
			data.forEach((val) => {
				const name = val["NAME OF COMPANY"];
				const id = val["SYMBOL"];
				const dol = val["DATE OF LISTING"];
				const isin = val["ISIN NUMBER"];
				this.Securities.set(id, new Security(id, name, isin, dol, true));
			});
		} catch (err) {
			console.log(err);
		}
	}
	async getFromBSE() {
		try {
			//const res = await this.getData(this.BSEurl);
			// const data = await csv({ output: "json" }).fromString(res.data);
			const data = await csv().fromFile("src/assets/bseEquity.csv");
			data.forEach((val) => {
				const name = val["Security Name"];
				const id = val["Security Id"];
				const dol = undefined;
				const isin = val["ISIN No"];
				if (this.Securities.has(id) == false) {
					this.Securities.set(
						id,
						new Security(id, name, isin, dol, false, true)
					);
				} else {
					this.Securities.get(id).setBSEFlag();
				}
			});
		} catch (err) {
			console.log(err);
		}
	}
	async fetch() {
		await this.getFromNSE();
		await this.getFromBSE();
	}
};
