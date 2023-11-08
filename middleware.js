const Campground=require('./models/campground')
const Review=require('./models/reviews')

const checkAuthentication=(req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl);
        req.session.returnTo=req.originalUrl;
        req.flash('error','you must be logged in first');
        return res.redirect('/login')
    }
    next();
}
const storeReturnTo=(req,res,next)=>{
    if(req.session.returnTo)
        res.locals.returnTo=req.session.returnTo;
    next();
}
// for campgrounds through postman
const isAuthorOwner=async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    // console.log(campground.author, req.user._id)
    if(!campground.author.equals(req.user?._id)){
        req.flash('error','you do not have permission to do that')
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next();
}
//for reviewauthor through postman
const isReviewAuthorOwner=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    // console.log(review.author, req.user._id)
    if(!review.author.equals(req.user._id)){
        req.flash('error','you do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
const removeDollar=(req,res,next)=>{
    // console.log(req.query);
    for(let key in req.query){
        if(key.includes('$')){
            delete req.query[key]
            // req.flash('error',"Please don't use $ in input feild")
        }
    }
    for(let key in req.body){
        if(key.includes('$')){
            delete req.body[key]
        }
    }
    for(let key in req.params){
        if(key.includes('$')){
            delete req.params[key]
        }
    }
    // console.log('After: ',req.query)
    next();
}
module.exports.checkAuthentication=checkAuthentication;
module.exports.storeReturnTo=storeReturnTo;
module.exports.isAuthorOwner=isAuthorOwner;
module.exports.isReviewAuthorOwner=isReviewAuthorOwner;
module.exports.removeDollar=removeDollar

// console.log(module.exports)