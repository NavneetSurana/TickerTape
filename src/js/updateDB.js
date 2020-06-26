const DBHandler = require("./DBHandler");
const FetchSecInfo = require("./FetchSecInfo");

const info = new FetchSecInfo();
info.fetch().then((res) => {
	console.log(res);
});
