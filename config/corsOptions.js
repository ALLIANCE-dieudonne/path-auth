const path = require('path');
const express = require('express');
const allowedOrgins = require('./allowedOrgins')

const corsOption = {
origin:(origin,callback) =>{
    if(whitelist.indexOf(origin) !== -1 || !origin){
        callback (null,true)
    }else{
        callback(new Error('Not allowed by CORS'))
    }
},optionsSuccessStatus :200
}

//module.exports = corsOption;