let userModel = require('../models/userModel');
let sessionModel = require('../models/sessionModel');
let shopUtils = require('../common/shopUtils.js')
let uuid = require('uuid-random');
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator')
const SESSION_TIME = 1000 * 60 * 30 // 30 min session
/**
 * Creates a user and inserts it to database if possible
 * */
exports.users_create_one = function (req, res, next) {
	console.log("Starting registering")
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	//Checks if email already exist in database. "unique -> uses unique mongoId only"
	userModel.findOne({ "email": req.body.email }, function (err, exist) {
		if (err) {
			console.log("userController findOneErr:" + err);
			return res.status(422).json({ message: "please provide proper credentials" })
		}
		if (exist) {
			console.log('Email already exist in db:' + req.body.email)
			return res.status(422).json({ message: "This email already exist" })
		}
		bcrypt.hash(req.body.password, 16, function (err, hash) {
			if (err) {
				console.log("Failed to hash password. Reason:" + err);
				return res.status(422).json({ message: "please provide proper credentials" })
			}		
			let user = new userModel({
				nickname: req.body.nickname,
				email: req.body.email,
				password: hash
			})
			console.log("UserToDB, " + JSON.stringify(user));

			user.save(function (err, user) {
				if (err) {
					console.log("Register failed. Reason:" + err);
					return res.status(422).json({ message: "email already in use" })
				} else {
					console.log("User registered. Username:" + user.nickname);
					return res.status(200).json({ message: "success" });
				}
			})
		})
	})
}

createToken = () => {
	return uuid();
}
exports.user_login = function (req, res, next) {
	console.log("/userController  Login: email:" + req.body.email)
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("/userController  Login: in was terminated by validation:" + JSON.stringify(errors));
		return res.status(422).json({ errors: errors.array() });
	}
	console.log("/userController Starting to search for email:" + req.body.email);
	userModel.findOne({ "email": req.body.email }, function (err, userFromDB) {
		if (err) {
			console.log("/userController Login:Failed to find user. Reason:" + err);
			return res.status(403).json({ message: "Username or password incorrect" })
		}
		if (!userFromDB) {
			console.log("/userController Login:Failed to find user. Reason:22");
			return res.status(403).json({ message: "Username or password incorrect" })
		}
		bcrypt.compare(req.body.password, userFromDB.password, function (err, success) {
			if (err) {
				console.log("/userController Login:Failed in comparing passwords. Reason:" + err);
				return res.status(403).json({ message: "Username or password incorrect" })
			}
			if (!success) {
				console.log("/userController Login:Passwords did not match:");
				return res.status(403).json({ message: "Username or password incorrect" })
			}
			let token = createToken();
			let temp = Date.now();

			//Antaa loggautua kahteen kertaan pitää tehdä ensin logout jos on jo istunto -> TODO puuttuu
			let session = new sessionModel({
				nickname: userFromDB.nickname,
				email: userFromDB.email,
				token: token,
				ttl: temp + SESSION_TIME
			})
			session.save(function (err, session) {
				if (err) {
					console.log("/userController Login:Session creation failed. Reason:" + err);
					return res.status(403).json({ message: "Username or password incorrect5" })
				}
				req.session = { userName: session.userName, timestamp: session.timestamp, token: session.token }
				//console.log("/userController Loginissa: sessio" + JSON.stringify(req.session))
				return res.status(200).json({ token: token, nickname: userFromDB.nickname })
			})
		})
	})
}


exports.logout = function (req, res, next) {
	let uuidFromInternets = req.headers.token
	if (uuidFromInternets.length !== 36) {
		return res.status(400).json({ message: "Nothing to logout" })
	}
	let realUUID = uuid.test(uuidFromInternets)
	if (!realUUID) {
		return res.status(400).json({ message: "Nothing to logout" })
	}

	sessionModel.findOne({ "token": uuidFromInternets }, function (err, session) {
		if (err) {
			console.log("/userController Failed to find session while logging out. Reason:" + err);
			return res.status(400).json({ message: "conflict" })
		}
		if (!session) {
			return res.status(400).json({ message: "Nothing to logout" })
		}
		sessionModel.deleteOne({ "token": session.token }, function (err) {
			if (err) {
				console.log("/userController Exception in session deletion:" + err + " token:" + uuidFromInternets);
			}
			return res.status(200).json({ message: "success" })
		})
	})
}

exports.applyUser = function (req, res, next) {

	if (shopUtils.validateUUIDFormat(req) == null) {
		console.log("/userController  applyUser not valid token ")
		return next()
	}
	sessionModel.findOne({ "token": req.headers.token }, function (err, session) {
		if (err) {
			console.log("/userController  applyUser Failed to find session from userController. Reason:" + err);
			return next()
		}
		if (session === null || session === undefined) {
			console.log("/userController  applyUser Sessiota ei löytynyt tokenilla " + req.headers.token)
			return next()
		}
		//Has session timed out?
		let now = Date.now();
		let ttl = session.ttl;
		console.log("/userController  applyUser  time comparison:" + now + " ttl:" + ttl + " alive:" + (ttl > now))
		if (ttl < now) {
			console.log("/userController  session has expired  with token " + req.headers.token)
			req.session = {}
			req.session = null
			return next();
		}
		else {
			req.session = {}
			req.session.email = session.email
			session.ttl = now + SESSION_TIME
			sessionModel.updateOne(
				{ "token": req.headers.token }, // Filter
				{ $set: { "ttl": session.ttl } } // Update
			).then((updatedDBSession) => {
				//console.log("/userController Updated session time:"+session.ttl)
				req.session.user = { userName: session.userName, timestamp: session.timestamp, token: session.token }
				return next()
			}).catch((err) => {
				console.log("/userController session saving error ")
				req.session = null
				return next()
			})
		}

	}
	)
}
