var user = require('../models/userModel');
var productModel = require('../models/product');
let uuid = require('uuid-random');


async function cashout(req, res, next) {
	console.log("/cashout starts");
	//No body
	if (!req.body) {
		return res.status(422).json({ errorMessage: "provide required data" })
	}

	let productsFromInternet = req.body;
	//Empty body
	if (Object.keys(productsFromInternet).length === 0 && productsFromInternet.constructor === Object) {
		return res.status(422).json({ errorMessage: "provide required data 2" })
	}
	//input sanity check starts
	let httpErrorMessage = undefined
	//For each might override assigned message but the loop detects if there exist any validation errors.
	productsFromInternet.forEach(element => {
		//UUID is not in correct format
		if (!uuid.test(element.productId)) { //tests if productID is UUID			
			httpErrorMessage = { status: 422, errorMessage: "provide real id " }
		}
		let quantity = parseInt(element.quantity, 10)
		//quantity is not a number
		if (isNaN(quantity)) {
			httpErrorMessage = { status: 422, errorMessage: "provide quantity " }
		}
		//Tries to buy negative or zero amount
		if (Math.sign(quantity) === 0 || Math.sign(quantity) === -1) {
			httpErrorMessage = { status: 422, errorMessage: "provide real quantity " }
		}
		//Check that productId is coming only once thus no duplicates
		let idArray = productsFromInternet.map(function (item) { return item.productId });
		let hasDuplicateIDs = idArray.some(function (item, id) {
			return idArray.indexOf(item) != id
		});
		if (hasDuplicateIDs) {
			httpErrorMessage = { status: 422, errorMessage: "duplicate ids" }
		}

	});
	if (httpErrorMessage !== undefined) {
		return res.status(httpErrorMessage.status).json(httpErrorMessage)
	} else if (productsFromInternet.length === 0) {
		return res.status(422).json({ errorMessage: "no data" });
	}

	let productList = []
	await productModel.find(
		{}, function (err, databaseProducts) {
			if (err) {
				console.log("/cashout critical error:" + err)
				httpErrorMessage = { status: 400, errorMessage: "something weird happened -" }
			}

			databaseProducts.forEach(databaseProduct => {
				modifyToBuyableAndNotBuyableProducts(databaseProduct, productsFromInternet, productList)
			})
			let operationsArray = []
			//console.log("ProductsList:" + JSON.stringify(productList))
			productList.forEach((element) => {
				if (element.buyable) {
					let productId = element.productId
					operationsArray.push(
						{
							updateOne:
							{
								filter: { productId: productId },
								upsert: false,
								//Set might be risky, decrease could be better
								update: { $set: { quantity: element.productsLeftCount } }
							}
						}
					)
				}
			})

			if (operationsArray.length === 0) {
				httpErrorMessage = { status: 422, errorMessage: "storage has not enough products to buy" }
				return;
			}

			console.log("Starting to bulk:" + JSON.stringify(operationsArray))
			productModel.collection.bulkWrite(operationsArray).then((updateResult) => {
				console.log("/cashout smooth exit:" + JSON.stringify(updateResult));
				return res.status(200).json(filterBoughtItems(productList))
			}).catch((err) => {
				console.log("shopController: bulkwrite error" + err)
				return res.status(400).json({ errorMessage: "something weird just happened" })
			})
		})
}

function filterBoughtItems(list) {
	if (list === null || list === undefined) {
		return "{error}"
	}
	let retVal = []
	list.forEach(item => {
		if (item.productsLeftCount >= 0) {
			retVal.push({ productId: item.productId, productsLeftCount: item.productsLeftCount });
		}
	})
	return retVal;
}


//returns true or false
function modifyToBuyableAndNotBuyableProducts(dbElement, productsFromInternet, productsList) {

	let productAndQuantityFromNet = undefined;
	for (i = 0; i < productsFromInternet.length; i++) {
		let productFrom = productsFromInternet[i].productId;
		if (dbElement.productId === productsFromInternet[i].productId) {
			productAndQuantityFromNet = productsFromInternet[i];
			break
		}
	}
	if (productAndQuantityFromNet === undefined) {
		productsList.push({ productId: dbElement.productId, buyable: false })
		return
	}

	if (dbElement.quantity >= 0 && dbElement.quantity - productAndQuantityFromNet.quantity >= 0) {
		let leftCount = (dbElement.quantity - productAndQuantityFromNet.quantity)
		productsList.push({ productId: dbElement.productId, buyable: true, productsLeftCount: leftCount })
		return
	}
	productsList.push({ productId: dbElement.productId, buyable: false })
}

exports.cashout = cashout;
exports.index = function (req, res, next) {
	productModel.find({}, function (err, results) {
		if (err) throw err;

		console.log("index ", results);
		res.status(200).json(results);

	});
}

exports.stock = function (req, res, next) {
	console.log(req.body);
	product.findOneAndUpdate(
		{ productId: req.body.item.productId },
		{ $inc: { quantity: req.body.amount } }, {
		new: true
	},
		function (err, results) {
			if (err) throw err;
			console.log(results, " quantity updated");
			res.status(200).json(results);
		})
}
