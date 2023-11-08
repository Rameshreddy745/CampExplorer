const Campground=require('../models/campground')
const Review=require('../models/reviews')
const {cloudinary}=require('../cloudinary/index')
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken=process.env.MAPBOX_TOKEN
const geocodingClient=mbxGeocoding({accessToken:mapBoxToken})

module.exports.index=async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createNewCampground=async(req,res,next)=>{
    const geoData=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit:1
    }).send()
    // console.log(geoData.body.features[0].geometry.coordinates)
    // res.send('OK')
    // console.log(req.body);
    // check if all the required information is sent or not excluding images because we are using
    // multer which contains req.body excludes images and it is present in req.files, extremely useful if anyone sents a request through postman
    
    if(Object.keys(req.body).length<4 && (req.body).constructor === Object) 
       throw new ExpressError('Incomplete/Invalid Campground Data',400)

    const campground=new Campground(req.body);
    campground.geometry=geoData.body.features[0].geometry;
    campground.image=req.files.map(file=>
        {  return {url:file.path, filename:file.filename}} )
    campground.author=req.user;
    await campground.save();
    console.log('Campground after image upload: ',campground)
    req.flash('success','successfully created campground');
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.showCampground=async (req,res,next)=>{
    const {id}=req.params
    const campground=await Campground.findById(id).populate({
        // to populate reviews and author associated with each review.
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(campground.image)
    const reviews=await Review.find({campground:campground._id}).populate('author')
    // console.log(reviews)
    if(!campground){
        req.flash('error','Campground not found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground,reviews})
}

module.exports.renderEditForm=async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    res.render('campgrounds/edit',{campground})
}

module.exports.updateCampground=async(req,res,next)=>{
    const {id}=req.params
    // check if all the required information is sent or not, extremely useful if anyone sents a request through postman
    if(Object.keys(req.body).length<4 && (req.body).constructor === Object) 
         throw new ExpressError('Incomplete/Invalid Campground Data',400)
    const campground=await Campground.findByIdAndUpdate(id,req.body);
    const imgs=req.files.map(file=>{return {url:file.path, filename:file.filename}})
    campground.image.push(...imgs)
    await campground.save()
    // console.log(req.body, campground.image)
    // we are checking req.body contains deleteImages if it is, then look if it is empty or not
    if(req.body.deleteImages?.length){
        for(let filename of req.body.deleteImages){
            // const successfullyDeletedImages=
            cloudinary.uploader.destroy(filename)  // if await not works use .then
            .then(result=>console.log(result))
            // console.log(successfullyDeletedImages);
        }
        const campground=await Campground.findByIdAndUpdate(id,{$pull:{image:{filename:{$in:req.body.deleteImages}}}},{new:true})
        // console.log(campground.image);
    }
    req.flash('success','successfully updated campground');
    res.redirect(`/campgrounds/${id}`)
}
module.exports.deleteCampground=async(req,res,next)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','successfully deleted campground');
    res.redirect('/campgrounds')
}