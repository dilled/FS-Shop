var product = require('../models/product');
//var food = require('../models/food');
// http://localhost:3000/contact
//router.get('/', contact_controller.contact_get_all);
let foods = [];
let clothes = [];
let shoes = [];
let pets = [];
let categories = [];

exports.purchase = function(req,res,next) {
    //var productID = req.params.productId;
	console.log("UPDATE ", req.params);
	product.findOneAndUpdate(
		{_Id: req.param.id }, 
		req.body, 
		{ new : true },
		function(err, results) {
			if (err) throw err;
		res.status(200).json(results);
		}
		);
    }

exports.index = function(req,res,next) {
    product.find({}, function(err, results) {
    if (err) throw err;
    
    results.map((item, index) => {
        
        if (item.get("categoryName") === "Food"){
            foods.push(item);
        }
        if (item.get("categoryName") === "Clothes"){
            clothes.push(item);
        }   
        if (item.get("categoryName") === "Shoes"){
            shoes.push(item);
        } 
        if (item.get("categoryName") === "Pets"){
            pets.push(item);
        } 
    })
    

  
    categories.push({categoryName: "Food", products : foods})
    categories.push({categoryName: "Clothes", products : clothes})
    categories.push({categoryName: "Shoes", products : shoes})
    categories.push({categoryName: "Pets", products : pets})
    console.log(categories);
    res.status(200).json(categories);
    categories = [];
    foods = [];
    clothes = [];
    shoes = [];
    pets = [];
});    
}