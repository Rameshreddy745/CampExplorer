const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers')
const mongoose=require('mongoose');
const Campground=require('../models/campground');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken='pk.eyJ1IjoicmFtZXNocmVkZHk0NSIsImEiOiJjbGt3bG9sNnIwNDQzM3FvMjA5NXZkczN6In0.DMfr3jLyInkurE4SMUV8Jg';
const geocodingClient=mbxGeocoding({accessToken:mapBoxToken})
const connection=async()=>{
    try{
        // mongoose.connect('mongodb://127.0.0.1:27017/myapp')
        await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log('Connection established to yelpcamp')
    }
// .then(()=>console.log('Yelp camp connection opened'))
// .catch(err=>console.log(err.message))
    catch(err){
        console.log(err.message)
    }
}
connection();

const sample=(arr)=>arr[Math.floor(Math.random() * arr.length)]
const random=(length)=>Math.floor(Math.random()*length)
const seedDB=async ()=>{
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const randomnum=random(1000);
        const geoData=await geocodingClient.forwardGeocode({
            query: `${cities[randomnum].city}, ${cities[randomnum].state}`,
            limit:1
        }).send()
        const camp=new Campground({
            title:`${sample(descriptors)} ${sample(places)}`,
            location:`${cities[randomnum].city}, ${cities[randomnum].state}`,
            price:randomnum,
            author:"64cb2ba0861c22c0927574b5",
            image:[
                {
                  url: 'https://res.cloudinary.com/ddyl8w2pf/image/upload/v1691345854/YelpCamp/tcerv7m2ksocdwypydh2.jpg',
                  filename: 'YelpCamp/er1rl6syjqxhzdchmzws',
                }
            ],
            description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic accusamus, repellat fugit perferendis reiciendis ipsam dolores error provident corporis enim qui deserunt, id tempore voluptatem optio sunt recusandae dicta praesentium.',
            geometry:geoData.body.features[0].geometry
            // geometry:{type:'Point',coordinates:[cities[randomnum].longitude,cities[randomnum].latitude]}
        })
        await camp.save();
    }
};
seedDB().then(()=>{
    mongoose.connection.close();
    // this is the way to close the connection
});

