const mongoose = require('mongoose');
const {getUsernameFromURI, getAppNameFromURI} = require('../utils/utils')

//connect to MongoDB
const connectDB = async ()=> {
    mongoose.set('strictQuery',true);
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('\x1b[36m============================================================\x1b[0m');
        console.log('\x1b[32mSuccessfully Connect to Mongo DB\x1b[0m');
        console.log(`\x1b[33mMongoDB user: ${getUsernameFromURI(process.env.MONGO_URI)}\x1b[0m`);
        console.log(`\x1b[33mCluster name: ${getAppNameFromURI(process.env.MONGO_URI)}\x1b[0m`);
        console.log(`\x1b[33mDatabase Instance: ${conn.connection.host}\x1b[0m`);
        console.log('\x1b[36m============================================================\x1b[0m');
        console.log("Successfully initialize Backend server");
        console.log("Server Log :");

    }catch(e){
        console.log("\n");
        console.log('\x1b[41mError\x1b[0m');
        console.log('\x1b[41mError\x1b[0m');
        console.log('\x1b[41mError\x1b[0m');
        console.log("\n");
        console.log('\x1b[31mError : \x1b[0m');
        console.log(e);
    }
}

module.exports = connectDB;