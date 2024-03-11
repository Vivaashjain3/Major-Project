const Listing= require("./models/listing");
const Review= require("./models/review");
const {listingSchema , reviewSchema } = require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next )=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }

    next();
}

module.exports.validateListing = (req, res, next) => {
    try {
        const { error } = listingSchema.validate(req.body);

        if (error) {
            console.error("Validation Error:", error);
            throw new ExpressError(400, error);
        } else {
            next();
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
        return next(new ExpressError(500, "Internal Server Error"));
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this Review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
