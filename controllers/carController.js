const Car = require('../models/Car');

// Get all Cars
// @route GET/cars
// @access Public

exports.getCars= async(req,res,next)=>{
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
        query = Car.find(JSON.parse(queryStr)).populate('Providers Bookings');


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
        const total= await Car.countDocuments();

        query=query.skip(startIndex).limit(limit);

        //Executing query
        const cars = await query;

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
            count:cars.length,
            pagination,
            data: cars
        });
    } catch(err) {
        res.status(400).json({success: false, data:err});
    }
};

// Create new Cars
// @route POST/cars
// @access Private

/*
{
    "Brand": "Tesla",
    "Model": "S",
    "Year": "2024",
    "Type": "SUV",
    "Color": "White",
    "RegistrationNumber": "12345678",
    "Available": true
}
*/

exports.createCar= async(req,res,next)=>{
    try {
        // Ensure RegistrationNumber is unique
        const existingCar = await Car.findOne({ RegistrationNumber: req.body.RegistrationNumber });
        if (existingCar) {
            return res.status(400).json({ success: false, message: 'Car with this RegistrationNumber already exists' });
        }

        // Create the car without explicitly specifying _id
        const car = await Car.create(req.body);
        res.status(201).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false, data: err });
    }
};

// Get one Car
// @route GET/cars/:id
// @access Pubilc

exports.getCar=async(req,res,next)=>{

    try {
        const car = await Car.findById(req.params.id);

        if(!car) {
            return res.status(400).json({success: false, msg:"don't have this car in database"});
        }

        res.status(200).json({success: true, data:car});

    } catch(err) {
        res.status(400).json({success: false, data:err});
    }
};

// Update Car
// @route PUT/cars/:id
// @access Private

exports.updateCar=async(req,res,next)=>{
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!car) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data:car});
    } catch(err) {
        res.status(400).json({success: false, data:err});
    }
};

// Delete Car
// @route DELETE/cars/:id
// @access Private

exports.deleteCar=async(req,res,next)=>{
    try {
        const car = await Car.findById(req.params.id);
        if(!car) {
            return res.status(400).json({success: false});
        }

        await car.deleteOne();
        res.status(200).json({success: true, data:{}});
    } catch(err) {
        res.status(400).json({success: false, data: err});
    }
};