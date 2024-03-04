const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Provider = require('../models/Provider');
const util = require('util');

//protect middleware
exports.protect=async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token || token == 'null') {
        return res.status(401).json({success:false, massage:'Not authorized to access this route 1'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user= await User.findById(decoded.id);

        if(req.user == null){
            req.user= await Provider.findById(decoded.id);
        }

        next();
    } catch(err) {
        console.log(err.stack);
        return res.status(401).json({success:false, massage:'Not authorized to access this route 2'});
    }
}



//authorze middleware
exports.authorize=(...roles)=>{
    return (req, res, next) => {
        //Logging req data Please don't delete for futhure debugging console.log(util.inspect(req, { showHidden: false, depth: null, colors: true}));
        if(!roles.includes(req.user.role)) {
            console.log(`req: ${req}`)
            return res.status(403).json({
                success:false,
                massage:`User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    }
}