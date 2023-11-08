const express=require('express');
const router=express.Router({mergeParams:true});
const Campground=require('../models/campground');
const Review=require('../models/reviews')
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError');
const {checkAuthentication, isReviewAuthorOwner}=require('../middleware')
const reviews=require('../controllers/reviews')

router.get('/',checkAuthentication,catchAsync(reviews.afterLoginRedirectReview))
router.post('/',checkAuthentication,catchAsync(reviews.createReview))
// adding isReviewAuthorOwner isn't neccesary because we are hiding the delete button for other users
// but incase if anyone try to delete through postman then we are checking is the loggedIn user is
// author or not ,if not we redirect to show page by display a flash message you don't have permission
router.delete('/:reviewId',checkAuthentication, isReviewAuthorOwner, catchAsync(reviews.deleteReview))
module.exports=router;