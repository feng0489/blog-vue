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
    res.json({code:"200",msg: 'Hello This Word'});
});

/**
 * 遍历栏目
 */
router.get('/lst', modern(async function (req, res) {
    try {
        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 15;
        let pageinfo = (page-1)* pageSize;
        let title = req.query.title || '';
        let restult = {
            code: '200',
            msg: 'msgok',
            data: {
                page:page,
                pageSize:pageSize,
                total:0,
                totalPage:1,
                info:''
            }
        };
        let where = "";
        if(title) {
            where += `where title='${title}'`
        }

        let total = await query("select count(id) as total from tp_links "+where);//total[0].total  获取总数

        restult.data.total = total[0].total;

        if(restult.data.total === 0){
            res.json(restult);
            return;
        }
        restult.data.totalPage = Math.ceil(restult.data.total/pageSize);//总页数
        let select_sql = "select id,title,url,`desc`";
        let rows = await query(`${select_sql} from tp_links ${where} order by id desc limit ${pageinfo},${pageSize}`);//分页查询
        restult.data.info = rows;
        res.json(restult);
    } catch (e) {
        res.json({
            code: '4003',
            msg: '请求失败，请稍候重试',
            data: e
        })
    }

}));

router.get('/all',modern(async function (req,res) {
    let restult = {
        code: '200',
        msg: 'msgok',
        data: [],
    };

    try {
        let rows = await query("select id,title,url,`desc` from tp_links order by id desc");//获取所有的栏目
        restult.data = rows;
        res.json(restult);
    }catch (e) {
        res.json({
            code: '4003',
            msg: '请求失败，请稍候重试',
            data: e
        })
    }


}));


/**
 * 新增栏目
 */
router.get('/add', modern(async function (req, res) {
    let title = req.query.title || '';
    let url = req.query.url || '';
    let desc = req.query.desc || '';


    if ('' === title || '' === url ) {
        res.json({
            code: '101',
            msg: '请求失败，参数错误',
            data: ''
        });
        return
    }
    try {



        let total = await query(`select count(id) as total from tp_links where title='${title}'`);

        if(total[0].total >0){
            res.json({
                code: '102',
                msg: '请求失败，该友情链接已经存在',
            });
            return;
        }

        let insert_sql ="insert into tp_links(title,url,`desc`)";
        let rows = await query(`${insert_sql} values('${title}','${url}','${desc}')`);

        res.json({
            code: '200',
            msg: '请求成功',
            data: rows.insertId
        })
    } catch (e) {
        res.json({
            code: '4003',
            msg: '请求失败，请稍候重试',
            data: e
        })
    }

}));


/**
 * 更新栏目
 */

router.get('/up', modern(async function (req, res) {
    let id = parseInt(req.query.id) || 0;
    let title = req.query.title || '';
    let url = req.query.url || '';
    let desc = req.query.desc || '';

    if (id === 0 || '' === title || '' === title) {
        res.json({
            code: '101',
            msg: '请求失败，参数错误',
            data: ''
        });
        return
    }
    try {

        let total = await query(`select count(id) as total from tp_links where title='${title}' and  id not in (${id})`);

        if(total[0].total >0){
            res.json({
                code: '102',
                msg: '请求失败，该友情链接已经存在',
            });
            return;
        }

        let update_sql = "update tp_links set title= '"+title+"',url='"+url+"',`desc`='"+desc+"' where id=?";
        let rows = await query(update_sql,id);

        res.json({
            code: '200',
            msg: '请求成功',
            data: rows.affectedRows
         })
    } catch (e) {
        res.json({
            code: '4003',
            msg: '请求失败，请稍候重试',
            data: e
        })
    }

}));

/**
 * 移除栏目
 */

router.get('/del', modern(async function (req, res) {
    let id = parseInt(req.query.id) || 0;


    if (id === 0 ) {
        res.json({
            code: '101',
            msg: '请求失败，参数错误',
            data: ''
        });
        return
    }
    try {

        let delete_sql = `delete from tp_links where id=?`;
        let rows = await query(delete_sql,id);
        res.json({
            code: '200',
            msg: '请求成功',
            data: rows.affectedRows
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
