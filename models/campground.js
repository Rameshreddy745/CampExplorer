const mongoose=require('mongoose');
const Review=require('./reviews');
const User=require('./user')
const catchAsync = require('../utils/catchAsync');

const options={ toJSON: { virtuals:true }}
const campgroundSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'cannot add data to campground ,title is required']
    },
    image:[
        {
            url:{type: String},
            filename:{type:String}
        }
        // required:true
    ],
    price:{
        type:Number,
        required:true,
        min:0
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    geometry:{
        type:{type:String,enum:['Point'],required:true},
        coordinates:{type:[Number],required:true}
    },
    author:{
        type:mongoose.Schema.Types.ObjectId, ref:'User'
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId, ref:'Review'
        }
    ]
},options)
campgroundSchema.virtual('properties.popUpMarkUp').get(function(){
    return `
    <h5><a href='/campgrounds/${this._id}'>${this.title}</a></h5>
    <p>${this.description.substring(0,30)}...</p>
    `
})
campgroundSchema.post('findOneAndDelete',async function(campground,next){
    try{
        if(campground.reviews.length){
            const deleteCount=await Review.deleteMany({_id:{$in:campground.reviews}})
            console.log(deleteCount);
        }
    }
    catch(err){
        next(err)
    }
})
module.exports=mongoose.model('Campground',campgroundSchema)