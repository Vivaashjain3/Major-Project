const express= require("express");
const router = express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js")

const reviewController=require("../controller/reviews.js");



router.post("/",validateReview,isLoggedIn, wrapAsync(reviewController.create));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.delete));

module.exports = router;