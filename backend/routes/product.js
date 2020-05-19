var express = require('express');
var router = express.Router();

// Require controller modules.
var product_controller = require('../controllers/productController');
var shop_controller = require('../controllers/shopController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', product_controller.index);
router.get('/:id', shop_controller.cashout);

module.exports = router;