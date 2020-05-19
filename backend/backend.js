const express = require("express")
const parser = require("body-parser")

var userRouter = require('./routes/usersRouter');
var shopRouter = require('./routes/shopRouter');
var productRouter = require('./routes/product')
var mongoDB = 'mongodb://localhost:27017/fs-shop';
var userController = require('./controllers/userController.js')
var mongoose = require('mongoose');

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let app = express()
app.use(parser.json())

app.use('/*', function (req, res, next) {
    userController.applyUser(req, res, next);
})
app.use('/shop/user', userRouter)
app.use('/shop/products', productRouter)
app.use('/shop/api', shopRouter)





let port = process.env.PORT || 3002
console.log("Waiting incoming requests on port:" + port);
app.listen(port);