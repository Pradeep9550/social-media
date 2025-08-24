const express = require('express');
const auth = require('../middleware/auth.js');
const { register, login, getMe } = require('../controllers/authController.js');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);



module.exports = router;