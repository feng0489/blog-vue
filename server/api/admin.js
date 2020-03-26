const express = require('express');
const router = express.Router();

const modern = require('express-modern');

const query = require('../db/mysql.js');


/**
 * 遍历管理员
 */
router.get('/lst', modern(async function (req, res) {
    try {
        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 3;
        let username = req.query.username || '';
        let pageinfo = (page-1)* pageSize;
        console.log(">>>>>>>>>>>>>>>>>"+JSON.stringify(req.query));
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
        if(username !==''){
            where += ` where username='${username}'`
        }

        let total = await query("select count(id) as total from tp_admin"+where);//total[0].total  获取总数

        restult.data.total = total[0].total;

        if(restult.data.total === 0){
            res.json(restult);
            return;
        }
        restult.data.totalPage = Math.ceil(restult.data.total/pageSize);//总页数

        let rows = await query(`select id,username from tp_admin ${where} order by id desc limit ${pageinfo},${pageSize}`);//分页查询
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
 * 添加管理员
 */
router.get('/add', modern(async function (req, res) {
    let username = req.query.username || '';
    let password = req.query.password || '';

    //校验用户是否存在
    try {
        let found_sql = `select count(id) as total from tp_admin where username='${username}'`;
        let count = await query(found_sql);
        if(count[0].total>0){
            res.json({
                code: "101",
                msg: '该管理员已经存在',
            });
            return
        }
        let pwd = require('crypto').createHash('md5').update(password, 'utf8').digest("hex");
        let insert_sql = `insert into tp_admin(username,password) values('${username}','${pwd}')`;
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
 * 修改管理员
 */
router.get('/up', modern(async function (req, res) {
    let id = parseInt(req.query.id) || 0;
    let username = req.query.username || '';
    let password = req.query.password || '';

    try {
        let users = await query(`select id,username,password from tp_admin where id=?`,id);
        if(!users){
            res.json({
                code: '4001',
                msg: '该用户已经不存在',
            })
            return
        }
        let user = users[0];
        let pwd ='';
        if(password){
            pwd = require('crypto').createHash('md5').update(password, 'utf8').digest("hex");
        }
        let up_sql = ``;
        if(username && username !== user.username){
            let found_sql = `select count(id) as total from tp_admin where username='${username}' and id not in(${id})`;
            let count = await query(found_sql);
            if(count[0].total>0){
                res.json({
                    code: "101",
                    msg: '该管理员已经存在',
                });
                return
            }
            up_sql += ` username='${username}'`
        }
        if(pwd && pwd !== user.password){
            if(up_sql){
                up_sql +=`,password='${pwd}'`;
            }else{
                up_sql +=`password='${pwd}'`;
            }
        }

        if(up_sql===``){
            res.json({
                code: '200',
                msg: '请求成功',
            })

        }else{

            up_sql += ` where id=${id}`;
            let update_sql = `update tp_admin set ${up_sql}`;
            let rows = await query(update_sql);
            res.json({
                code: '200',
                msg: '请求成功',
                data: rows.affectedRows
            })
        }

    }catch (e) {
        res.json({
            code: "4003",
            msg: '请求失败，请稍候重试',
            data: e
        })
    }

}));

/**
 * 移除管理员
 */
router.get('/del', modern(async function (req, res) {
    let id = parseInt(req.query.id) || 0;

    try {

        let delete_sql = `delete from tp_admin where id=?`;
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
