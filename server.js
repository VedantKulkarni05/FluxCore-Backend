require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/config/db')



const PORT = process.env.PORT || 3000

async function startServer() {
    try {
        await connectDB();
    app.listen( PORT,()=>{
        console.log(`server is listning on port ${PORT}`);
    })
} catch (err) {
    console.log("failed to start server", err);
    process.exit(1)
}
}

startServer()