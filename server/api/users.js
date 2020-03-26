////**
/**
 * 栏目列表
 * @type {createApplication}
 */

const express = require('express');
const router = express.Router();

const modern = require('express-modern');

const query = require('../db/mysql.js');

const cashe = require('../cache/redis.js');


const fs = require('fs');


const log4js = require('../log/log4.js');
const errlog = log4js.getLogger('err');
const othlog = log4js.getLogger('oth');
const fileDir = "./data";


/* GET home page. */
router.get('/', function (req, res) {
    res.json({code:"200",msg: 'Hello Express'});
});

router.get('/allUser', modern(async function (req, res) {
    try {


        const rows = await query('select * from tp_admin');
        res.json({
            code: 0,
            msg: 'msgok',
            data: rows
        })
    } catch (e) {
        res.json({
            code: '4003',
            msg: '请求失败，请稍候重试',
            data: e
        })
    }

}));


router.get('/upUser', modern(async function (req, res) {
    let id = parseInt(req.query.id) || 0;
    let username = req.query.user || '';
    if (id === 0 || '' === username) {
        res.json({
            code: 1,
            msg: '请求失败，参数错误',
            data: ''
        });
        return
    }
    try {
        const rows = await query("update hang_users set money = money+1 where id=" + id + " AND username='" + username + "'");

        res.json({
            code: 0,
            msg: '请求成功',
            data: rows
        })
    } catch (e) {
        res.json({
            code: '4003',
            msg: '请求失败，请稍候重试',
            data: e
        })
    }

}));




module.exports = router;
