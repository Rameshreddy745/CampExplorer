const Campground=require('../models/campground');
const Review=require('../models/reviews')
module.exports.afterLoginRedirectReview=async(req,res,next)=>{
    //this route is useful when try to submit the review without login, it will show login page
    // and after successful login we will return to the old page (check post login in users route)where user 
    // initially try to submit the review, but now after login it will redirect to '/campgrounds/:id/reviews'
    // as a get route we need to write get route for that
    
    // but when try to submit the review after login it will submit as post request. so it will hit 
    // the below post route and that will redirect to somewhere else as get request.
    const campground=await Campground.findById(req.params.id);
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.createReview=async(req,res,next)=>{
    const campground=await Campground.findById(req.params.id);
    const {rating,body}=req.body;
    const review=new Review({rating,body})
    review.author=req.user._id;
    review.campground=campground._id;
    await review.save();
    campground.reviews.push(review);
    await campground.save();
    req.flash('success','successfully posted review');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}