//Modules 
const express = require('express')
const dotenv = require('dotenv')
const app = express()
const passport = require('passport')
const path = require('path')
const morgan = require('morgan')
const connectDB = require('./config/db')
const PORT = process.env.PORT

//Load config file
dotenv.config({ path: './config/.env'})


connectDB()


app.listen(PORT, () => {
    console.log(`App running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})



