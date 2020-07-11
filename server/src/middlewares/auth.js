module.exports = async (req, res, next) => {
	const token = req.headers.authorization.replace("Bearer ");
   const key = process.env.JWT_AUTH_KEY;
   
};
