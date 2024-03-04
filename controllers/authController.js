const User = require('../models/User');
const Provider = require('../models/Provider');


// ANCHOR register Controller
// @route POST/authentication/register
// @access Public\
exports.register =  async(req, res, next) => {
    try{
        const {name, email, password, phone, role} = req.body;
        const user = await User.create({
            name, email, password, phone, role
        });

        // const token=user.getSignedJwtToken();
        // res.status(200).json({success: true, token});

        sendTokenResponse(user, 200, res);
    } catch(err){
        res.status(400).json({success: false});
        console.log(err.stack);
    }
    // res.status(200).json({message: "Registering new user ...       This server has no authentication system."});
};


// ANCHOR login Controller
// @route POST/authentication/login
// @access Public
exports.login= async(req,res,next)=>{
    try{
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({success: false, msg: 'Please provide an email and password'});
    }

    const user = await User.findOne({email}).select('+password');
    if(!user) {
        return res.status(400).json({success: false, msg: 'Invalid credentials'});
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return res.status(401).json({success: false, msg: 'Invalid credentials'});
    }

    // const token = user.getSignedJwtToken();
    // res.status(200).json({success:true, token});

    sendTokenResponse(user, 200, res);}
    catch(err) {
        return res.status(401).json({success: false, msg: 'Cannot convert email or password to string'});
    }
    // res.status(200).json({message: "Logging in ...       This server has no authentication system."});
};


// ANCHOR provider register Controller
// @route POST/authentication/provider/register
// @access Public
exports.providerRegister =  async(req, res, next) => {
    try{
        const {name, address,email, password, phone} = req.body;
        const provider = await Provider.create({
            name,address, email, password, phone
        });

        // const token=user.getSignedJwtToken();
        // res.status(200).json({success: true, token});

        sendTokenResponse(provider, 200, res);
    } catch(err){
        res.status(400).json({success: false});
        console.log(err.stack);
    }
    // res.status(200).json({message: "Registering new user ...       This server has no authentication system."});
};


// ANCHOR provider login Controller
// @route POST/authentication/provider/login
// @access Public

exports.providerLogin = async(req, res, next) => {
    try{
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({success: false, msg: 'Please provide an email and password'});
        }

        const provider = await Provider.findOne({email}).select('+password');
        if(!provider) {
            return res.status(400).json({success: false, msg: 'Can\'t find user'});
        }

        const isMatch = await provider.matchPassword(password);

        if(!isMatch) {
            return res.status(401).json({success: false, msg: 'Invalid credentials'});
        }

        sendTokenResponse(provider, 200, res);
    }catch(e){
        console.log(`err : ${e.message}`)
    }

};

// ANCHOR Logout Controller
// @route GET/authentication/me
// @access Private

exports.getMe=async(req,res,next)=>{
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({message: "Hey who are you? I don't know you!", data: err.stack});
    }
};


// @route GET/authentication/logout
// @access Private

exports.logout = async(req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() +  10*1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });

};


//send token response
const sendTokenResponse=(user,statusCode,res)=>{
    const token=user.getSignedJwtToken();

    const options = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV==='production'){
        options.secure=true;
    }
    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        token
    })
}



