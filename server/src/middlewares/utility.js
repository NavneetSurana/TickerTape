const bcrypt = require("bcrypt");
module.exports = {
	genUserObj: async (req, res, next) => {
		req.user = {
			_id: req.body.username,
			firstname: req.body.firstname,
			middlename: req.body.middlename,
			lastname: req.body.lastname,
			email: req.body.email,
			passHash: await bcrypt.hash(req.body.password, 10),
		};
		next();
	},
};
