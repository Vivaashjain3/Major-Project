const express= require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer= require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.create));
    
router.get("/new", isLoggedIn,listingController.new);

router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn,isOwner,validateListing, wrapAsync(listingController.update))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.delete));

router.get("/:id/edit",isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.edit));

module.exports = router;
