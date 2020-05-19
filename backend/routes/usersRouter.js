var express = require('express');
var router = express.Router();

const { check } = require('express-validator')
const pw_regex = RegExp('(?=.*[!@#$%^&*])')
var users_controller = require('../controllers/userController');



router.post('/register', [
    // no trimming for password in case that starts with whitespace
    check('email', 'Check email format').exists().trim().isEmail(),
    check('nickname', 'Nickname 4-14 chars').exists().trim().isLength({ min: 4, max: 14 }).escape(),
    check('password', 'Password minimum 8 chars and one special character').exists().isLength({ min: 8, max: 64 }).custom((value, { req }) => {
        return pw_regex.test(value)
    }),
    check('passwordverification', 'Passwords are not equal')
        .exists().trim()
        .custom((value, { req }) => value === req.body.password)
], users_controller.users_create_one);

router.post('/login', [
    check('email', 'Check email format').exists().trim().isEmail(),
    check('password', 'Password minimum 8 chars and one special character').exists().isLength({ min: 8, max: 64 }).custom((value, { req }) => {
        return pw_regex.test(value)
    }),
], users_controller.user_login);

router.post('/logout', users_controller.logout);

module.exports = router;
