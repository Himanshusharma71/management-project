const Listing=require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn=(req, res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in to create listing");
       return res.redirect("/login");
     }
     next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner=async(req, res,next)=>{
  let { id } = req.params;
  let listing =await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser.id)){
    req.flash("error","You don't have permission to edit");
    res.redirect(`/listings/${id}`);
  }
     next();
}
module.exports.isReviewAuthor=async(req, res,next)=>{
  let {id, reviewId } = req.params;
  let review =await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser.id)){
    req.flash("error","You don't have permission to delete the review");
    res.redirect(`/listings/${id}`);
  }
     next();
}
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview=(req, res, next)=>{
  let {error} = listingSchema.validate(req.body);
  console.log(result);
  if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, result.error);
  }
  else{
    next();
  }
}