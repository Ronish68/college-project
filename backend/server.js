const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Uncaught exception`);
    process.exit(1);
})

//config
dotenv.config({path:"backend/config/config.env"});

//connecting to database
connectDatabase();


const server = app.listen(process.env.PORT,()=>[

    console.log(`Server is running on http://localhost:${process.env.PORT}`)
]);

process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled promise rejection`);

    server.close(()=>{
        process.exit(1);
    })
})