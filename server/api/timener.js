const express = require('express');
const router = express.Router();

const modern = require('express-modern');

const query = require('../db/mysql.js');

const cashe =  require('../redis/cache.js');

let schedule = require('node-schedule');

 function scheduleCronstyle(){



    var rule1     = new schedule.RecurrenceRule();
    var times1    = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59];
    rule1.minute  = times1;
     schedule.scheduleJob(rule1,async function(){

        console.log("times1->date:"+ new Date());


       // const rows = await query('select * from bili_users');


       // console.log("\r\n users:"+JSON.stringify(rows))


    });
}

scheduleCronstyle();

module.exports = router;
