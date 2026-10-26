const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const accountController = require('../controllers/account.controller');
const router = express.Router();


router.post("/", authMiddleware.userAuthMiddleware, accountController.createAccount);
router.get("/", authMiddleware.userAuthMiddleware, accountController.getAccount);

module.exports = router;