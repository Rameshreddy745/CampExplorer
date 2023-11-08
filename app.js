if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();// it will look in .env file and place data in process.env
}
console.log(process.env.CLOUDINARY_CLOUD_NAME)
const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const session=require('express-session')
const flash=require('connect-flash')
const User=require('./models/user')
const methodOverride=require('method-override')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const mongoSanitize=require('express-mongo-sanitize')
const {removeDollar}=require('./middleware')
const MongoStore=require('connect-mongo')

const catchAsync=require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError');

const userRoutes=require('./router/user')
const campgroundRoutes=require('./router/campgrounds')
const reviewRoutes=require('./router/reviews')

const mongoCloudUrl=process.env.MONGO_CLOUD_URL || 'mongodb://127.0.0.1:27017/yelp-camp'; // just as back up if mongo cloud went wrong.

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')));

const Store=MongoStore.create({
    mongoUrl:mongoCloudUrl,
    touchAfter:24*60*60,
    // crypto:{
    //     secret:'thisisnotgoodsecret' // to ensure data in the session is encrypted
    // }
})
const sessionOptions={
    store:Store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookies:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(mongoSanitize())// removes $,. from req.query and req.body,req.params coming from express package
app.use(removeDollar) // I defined just to remove dollar incase mongoSanitize not removes, mostly it removes $,. I just defined to how it is implemented behind the scenes
app.use(session(sessionOptions))
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Routes handlers
app.use((req,res,next)=>{
    req.session.views>0?req.session.views++:req.session.views=1;
    // console.log(req.session);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    // console.log('res.locals: ',res.locals)
    next();
})
app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/',(req,res)=>{
    res.render('home')
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500,}=err
    if(!err.message) err.message='something went wrong'
    res.status(statusCode).render('error',{err});
})
const port=process.env.PORT || 4000
const mongoLocalUrl='mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(mongoCloudUrl)
.then(()=>{
    console.log('Yelp camp connection opened')
    app.listen(port,()=>{
        console.log(`YelpCamp running on port ${port}`)
    })
})
.catch(err=>console.log(err.message))
