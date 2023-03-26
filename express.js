require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const verifyJWT = require('./middleWare/verifyJWT');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOption = require('./config/corsOptions');
const mongoose = require('mongoose');

const coonectDB = require('./config/dbConn');
const PORT = process.env.PORT || 4000 ;

//coonect to the mongoDB
coonectDB();

// const fs = require('fs');
//Cross Orgin Resourse Sharing
// app.use(cors(corsOption));
//built in middleware for json data
app.use(express.json());

//middleware for cookies
app.use(cookieParser());
//routes
app.use('/register',require('./routes/register'));
app.use('/auth',require('./routes/auth'));
app.use('/refresh',require('./routes/refresh'));
app.use('/logout',require('./routes/logout'));


app.use(verifyJWT)
app.use('/employees', require('./routes/employees'))

mongoose.connection.once('open', ()=>{
    console.log(`Successfully connected to mongo db`);
    app.listen(PORT,()=>{console.log(`The server is running on port ${PORT}`)});
})


