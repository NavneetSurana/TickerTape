const { createTestDB, updateHistoryALL } = require("./tickerTapeDB");

async function f() {
	await createTestDB();
}
f();
