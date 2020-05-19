var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ProductsSchema = new Schema(
  {
    productId:String,
    quantity:Number,
    
   }, {collection: "Products", versionKey: false}
);

//Export model
module.exports = mongoose.model('Products', ProductsSchema);

/*
subCategoryName:String,
    categoryName:String,
    productId:String,
    price:Number,
    name:String,
    quantity:Number,
    description:String,
    image:String
*/