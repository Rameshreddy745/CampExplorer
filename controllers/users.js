const User=require('../models/user')

module.exports.renderRegister=(req,res)=>{
    res.render('users/register')
}

module.exports.register=async(req,res,next)=>{
    try{
    const {email,username, password}=req.body;
    const currentUser=new User({email,username});
    const registeredUser=await User.register(currentUser,password);
    req.login(registeredUser,err=>{
        if(err) return next(err)
        else{
            req.flash('success','Welcome to the YelpCamp');
            res.redirect('/campgrounds')
        }
    })
    
    }
    catch(err){
        // important to handle the error when user registers with existing username by flashing
        // the message and redirecting to same register page to register again with different username
        req.flash('error',err.message)
        res.redirect('/register')
    }

}

module.exports.renderLogin=(req,res)=>{
    res.render('users/login')
}
module.exports.login=(req,res)=>{
    const redirectUrl=res.locals.returnTo||'/campgrounds';
    req.flash('success','successfully loggedin');
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout(function(err){
        if(err)next(err);
        else{
            req.flash('success','GoodBye');
            res.redirect('/campgrounds');
        }
    });
    
}

