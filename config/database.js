const mongoose = require('mongoose');

require('dotenv').config();
const MONGODB_URL = process.env.MONGODB_URL;

exports.connectDB = () => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfully connected to DB!');
    })
    .catch((error) => {
        console.log('DB connection failed!');
        console.error(error);
        process.exit(1);
    });
}
