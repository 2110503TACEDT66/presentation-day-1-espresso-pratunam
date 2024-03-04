const express = require('express');
const connectDB = require('./config/mogoDB');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 8000;
dotenv.config({path: './config/config.env'})
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');



//use Tools
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
const limiter=rateLimit({
    windowsMs:1*60*1000,//1 min
    max: 10 //10times per min
});
app.use(limiter);
app.use(hpp());
app.use(cors());




//get Routes ====================================================
const authentication = require('./routes/authentication');
const carRoute = require('./routes/carRoute');
const bookingRoute = require('./routes/bookingRoute');
const providerRoute = require('./routes/providerRoute')


// use Routes ====================================================
app.use('/authentication',authentication);
app.use('/cars', carRoute);
app.use('/bookings', bookingRoute);
app.use('/provider', providerRoute);


//Landing request ====================================================
app.get('/', (req, res) => {
    res.send('Welcome to |Espresso Pratunam Car renting| vroom vroom 🏎️💨');
});








//Connect to MongoDB ====================================================
connectDB();

// Listening to request ====================================================
const server = app.listen(PORT, () => {
    console.log("\n");
    console.log('Initializing Backend server'); // Yellow/ Yellow
    console.log('\x1b[36m==============================\x1b[0m');    // Cyan
    console.log(`\x1b[32mServer listening on port ${PORT}\x1b[0m`); // Green
});


// Unhandle rejection handler ====================================================
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.massage}`);
    server.close(()=>process.exit(1));
})
