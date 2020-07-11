const bcrypt = require("bcrypt");
module.exports = {
	genUserObj: async (req, res, next) => {
		if ((!req.body.username && !req.body.email) || !req.body.password) {
			return res
				.status(422)
				.json({ message: "username,email or password invalid" });
		}
		req.user = {
			_id: req.body.username,
			firstname: req.body.firstname,
			middlename: req.body.middlename,
			lastname: req.body.lastname,
			email: req.body.email,
			phone: req.body.phone,
			passHash: await bcrypt.hash(req.body.password, 10),
		};
		next();
	},
};
