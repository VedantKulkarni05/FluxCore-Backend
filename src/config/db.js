const mongoose = require('mongoose')



const MONGODB_URI = process.env.MONGODB_URI



async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('server and DB connected');
    } catch (err) {
        console.log('Error in connecting to DB', err);
        throw err;    
    }
}

module.exports = connectDB