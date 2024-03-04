const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const {protect, authorize} = require("../middleware/authMiddleware");
const {getProviders, getProvider} = require("../controllers/providerController");

//ANCHOR getProvider and getProviders
// getProvider : admin, user, provider
// getProviders : admin, user, provider
router.use('/:id',protect,authorize('admin', 'user','provider'),getProvider);
router.use('/',protect,authorize('admin', 'user', 'provider'),getProviders);


module.exports = router;