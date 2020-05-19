var express = require('express');
var router = express.Router();


let shopController = require('../controllers/shopController.js');

//shopRouter is closed side. Functions here always require valid token no matter what. This function is a gatekeeper func.
router.all('/*', function (req, res, next) {
    console.log("Suljettu osuus alkaa, pitää olla tiedot jo valmiiksi requestissa jotta menee läpi.")
    if (!req.session || !req.session.email) {
        console.log("Ei ollut validia tokenia ulos")
        return res.status(403).json({ message: "Login first" })
    }
    next();
});
router.post('/cashout', shopController.cashout);
router.get('/index', shopController.index);
router.post('/stock', shopController.stock);
module.exports = router;

