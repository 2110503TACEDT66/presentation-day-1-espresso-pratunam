const Provider = require('../models/Provider');

exports.getProviders = async (req, res, next) => {
    try {
        let query;
        //Copy
        const reqQuery = {...req.query};

        //Fields to exclude
        const removeFields=['select','sort','page','limit'];

        //Loop over fields
        removeFields.forEach(param=>delete reqQuery[param]);
        console.log(reqQuery);

        //create query string
        let queryStr=JSON.stringify(req.query);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

        // //Finding resource
        query = Provider.find(JSON.parse(queryStr)).populate('Cars');

        //Select Fields\
        if(req.query.select){
            const fields=req.query.select.split(',').join(' ');
            query=query.select(fields);
        }
        //Sort
        if(req.query.sort){
            const sortBy=req.query.sort.split(',').join(' ');
            query=query.sort(sortBy);
        } else{
            query=query.sort('name');
        }

        //Pagination
        const page=  parseInt(req.query.page, 10) || 1;
        const limit= parseInt(req.query.limit, 10) || 25;
        const startIndex=(page-1)*limit;
        const endIndex=(page*limit);
        const total= await Provider.countDocuments();

        query=query.skip(startIndex).limit(limit);

        //Executing query
        const providers = await query;

        //Pagination result
        const pagination={};

        if(endIndex < total) {
            pagination.next={
                page: page+1,
                limit
            }
        }

        if(startIndex > 0) {
            pagination.prev={
                page: page-1,
                limit
            }
        }
        res.status(200).json({
            success: true,
            count:providers.length,
            pagination,
            data: providers
        });
     }catch(err) {
        res.status(400).json({success: false, data:err.message});
    }
};



exports.getProvider=async(req,res,next)=>{

    try {
        const provider = await Provider.findById(req.params.id).populate('Cars');

        if(!provider) {
            return res.status(400).json({success: false, msg:"There is no this provider in database"});
        }

        res.status(200).json({success: true, data:provider});

    } catch(err) {
        res.status(400).json({success: false, data:err});
    }
};
