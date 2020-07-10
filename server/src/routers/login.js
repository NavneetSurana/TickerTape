const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    console.log(req.body);
    res.status(200).send({
        message: "login successful",
        token: "Edfaei830ifhioksnal2-",
    });
});

module.exports = router;
