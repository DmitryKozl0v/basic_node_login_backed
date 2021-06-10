// path: api/login

const { Router } = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth');
const { newUser, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate_fields');
const { validateJWT } = require('../middlewares/validate_jwt');

const router = Router();

router.post('/new', [
    check('name', '"name" is a mandatory field').not().isEmpty(),
    check('email', '"email" is a mandatory field').isEmail(),
    check('password', '"password" is a mandatory field').not().isEmpty(),
    validateFields
    ],newUser
);

router.post('/', [
    check('email', '"email" is a mandatory field').isEmail(),
    check('password', '"password" is a mandatory field').not().isEmpty(),
    validateFields
    ],login
);

router.get('/renew', validateJWT, renewToken)

module.exports = router;