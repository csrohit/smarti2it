const mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    err = require('../lib/err'),
    Function = require('../lib/functions'),
    Schema = mongoose.Schema;

    const noticeSchema = new Schema({
        title:{
            type:String,
            required
        },
        issuer:{
            type:ObjectId
        },
        issued_to:{

        }
    });