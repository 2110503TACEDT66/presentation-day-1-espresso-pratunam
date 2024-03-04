const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const {protect, authorize} = require("../middleware/authMiddleware");
const {getProviders, getProvider} = require("../controllers/providerController");

//ANCHOR getProvider and getProviders
// getProvider : admin, user
// getProviders : admin, user
router.use('/:id',protect,authorize('admin', 'user'),getProvider);
router.use('/',protect,authorize('admin', 'user'),getProviders);


module.exports = router;