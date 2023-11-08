const mongoose=require('mongoose');
const User=require('./user')
const Campground=require('./campground')
const reviewSchema=new mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,ref:'User'
    },
    campground:{
        type:mongoose.Schema.Types.ObjectId,ref:'Campground'
    }
})
const Review=mongoose.model('Review',reviewSchema);
module.exports=Review;