const express=require('express');
const router=express.Router();
// const Campground=require('../models/campground');
// const Review = require('../models/reviews');
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError');
const {checkAuthentication}=require('../middleware')
const {isAuthorOwner}=require('../middleware');
const campgrounds=require('../controllers/campgrounds')
const multer=require('multer')
const {storage}=require('../cloudinary/index')
const upload=multer({storage})

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(checkAuthentication, upload.array('image'), catchAsync(campgrounds.createNewCampground))
    // .post(upload.single('image'),(req,res)=>{
    //     console.log(req.body,req.file)
    //     res.send(req.body,req.file)
    // })

router.get('/new', checkAuthentication, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(checkAuthentication,isAuthorOwner,upload.array('image'), catchAsync(campgrounds.updateCampground))
    .delete(checkAuthentication,isAuthorOwner, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',checkAuthentication, 
isAuthorOwner, 
catchAsync(campgrounds.renderEditForm))

module.exports=router