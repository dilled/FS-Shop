const express = require("express")
const parser = require("body-parser")

var userRouter = require('./routes/usersRouter');
var shopRouter = require('./routes/shopRouter');
var productRouter = require('./routes/product')
var mongoDB = 'mongodb+srv://test:test@cluster0-n6nfv.gcp.mongodb.net/test?retryWrites=true&w=majority';
var userController = require('./controllers/userController.js')
var mongoose = require('mongoose');

mongoose.connect(mongoDB, { dbName:'fs-shop', useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let app = express()
app.use(parser.json())

var distDir = __dirname + "/build/";
app.use(express.static(distDir));

app.use('/*', function (req, res, next) {
    userController.applyUser(req, res, next);
})
app.use('/shop/user', userRouter)
app.use('/shop/products', productRouter)
app.use('/shop/api', shopRouter)





let port = process.env.PORT || 3002
console.log("Waiting incoming requests on port:" + port);
app.listen(port);