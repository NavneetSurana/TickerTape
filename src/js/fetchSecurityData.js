// import axios from "axios";
// import Security from "./Security.js";

const axios = require("axios");
const Security = require("./Security.js");

module.exports = class FetchSequrityData {
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
			const res = await this.getData(this.NSEurl);
			const data = res["data"].split("\n");
			data.pop();
			data.forEach((val, ind) => {
				if (ind !== 0) {
					const seqData = val.split(",").map((x) => x.trim());
					const name = seqData[1];
					const id = seqData[0];
					const dol = seqData[3];
					const isin = seqData[6];
					this.Securities.set(id, new Security(id, name, isin, dol, true));
				}
			});
		} catch (err) {
			console.log(err);
		}
	}
	async getFromBSE() {
		const res = await this.getData(this.BSEurl);
		console.log(res);
		// data.pop();
		// data.forEach((val, ind) => {
		// 	if (ind !== 0) {
		// 		const seqData = val.split(",").map((x) => x.trim());
		// 		const name = seqData[1];
		// 		const id = seqData[0];
		// 		const dol = seqData[3];
		// 		const isin = seqData[6];
		// 		this.Securities.set(id, new Security(id, name, isin, dol));
		// 	}
		// });
		// console.log(this.Securities);
	}
};
