const express = require('express');
const router = express.Router();

const modern = require('express-modern');

const query = require('../db/mysql.js');


/**
 * 遍历
 */
router.get('/lst', modern(async function (req, res) {
    try {
        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 15;
        let tagname = req.query.tagname || '';
        let pageinfo = (page-1)* pageSize;
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
        if(tagname) {
            where += `where tagname='${tagname}'`
        }

        let total = await query(`select count(id) as total from tp_tags ${where}`);//total[0].total  获取总数

        restult.data.total = total[0].total;

        if(restult.data.total === 0){
            res.json(restult);
            return;
        }
        restult.data.totalPage = Math.ceil(restult.data.total/pageSize);//总页数

        let rows = await query(`select id,tagname from tp_tags ${where} order by id desc limit ${pageinfo},${pageSize}`);//分页查询
        restult.data.info = rows;
        res.json(restult);
    } catch (e) {
        res.json({
            code: "4003",
            msg: '请求失败，请稍候重试',
            data: e
        })
    }

}));

/**
 * 添加
 */
router.get('/add', modern(async function (req, res) {
    let tagname = req.query.tagname || '';


    try {
        let found_sql = `select count(id) as total from tp_tags where tagname='${tagname}'`;
        let count = await query(found_sql);
        if(count[0].total>0){
            res.json({
                code: "101",
                msg: '该标签已经存在',
            });
            return
        }

        let insert_sql = `insert into tp_tags(tagname) values('${tagname}')`;
        let rows = await query(insert_sql);
        res.json({
            code: '200',
            msg: '请求成功',
            data: rows.insertId
        })
    }catch (e) {
        res.json({
            code: "4003",
            msg: '请求失败，请稍候重试',
            data: e
        })
    }

}));


/**
 * 修改
 */
router.get('/up', modern(async function (req, res) {
    let id = parseInt(req.query.id) || 0;
    let tagname = req.query.tagname || '';

    try {

        let found_sql = `select count(id) as total from tp_tags where tagname='${tagname}' and id not in (${id})`;
        let count = await query(found_sql);
        if(count[0].total>0){
            res.json({
                code: "101",
                msg: '该标签已经存在',
            });
            return
        }


        let update_sql = `update tp_tags set tagname='${tagname}' where id=${id}`;
        let rows = await query(update_sql);
        res.json({
            code: '200',
            msg: '请求成功',
            data: rows.affectedRows
        })
    }catch (e) {
        res.json({
            code: "4003",
            msg: '请求失败，请稍候重试',
            data: e
        })
    }

}));

/**
 * 移除
 */
router.get('/del', modern(async function (req, res) {
    let id = parseInt(req.query.id) || 0;

    try {

        let delete_sql = `delete from tp_tags where id=?`;
        let rows = await query(delete_sql,id);
        res.json({
            code: '200',
            msg: '请求成功',
            data: rows.affectedRows
        })
    }catch (e) {
        res.json({
            code: "4003",
            msg: '请求失败，请稍候重试',
            data: e
        })
    }

}));

module.exports = router;
