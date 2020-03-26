const express = require('express');
const router = express.Router();

const modern = require('express-modern');

const query = require('../db/mysql.js');

const cashe = require('../cache/redis.js');
const comm = require('../util/common.js');

const fs = require('fs');


const log4js = require('../log/log4.js');
const errlog = log4js.getLogger('err');
const othlog = log4js.getLogger('oth');
const fileDir = "./data";


/* GET home page. */
router.get('/', function (req, res) {
    res.json({code:"200",msg: 'Hello Express'});
});

/**
 * 遍历文章
 */
router.get('/lst', modern(async function (req, res) {
    try {
        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 15;
        let pageinfo = (page-1)* pageSize;
        let title = req.query.title || '';
        let author = req.query.author || '';
        let cateid = req.query.cateid || 0;
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
        let where = "where `state`>=0 ";
        if(title) {
            where += ` and title='${title}'`
        }
        if(author) {
            where += ` and author='${author}'`
        }
        if(cateid>0) {
            where += ` and cateid=${cateid}`
        }

        let total = await query("select count(a.id) as total from tp_article a join tp_cate c on a.cateid=c.id "+where);//total[0].total  获取总数

        restult.data.total = total[0].total;

        if(restult.data.total === 0){
            res.json(restult);
            return;
        }


        restult.data.totalPage = Math.ceil(restult.data.total/pageSize);//总页数

        let rows = await query(`select a.id,title,author,state,pic,cateid,catename  from tp_article a join tp_cate c on a.cateid=c.id ${where} order by id desc limit ${pageinfo},${pageSize}`);//分页查询

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
/**
 * 获取单个文章信息
 */

router.get('/find', modern(async function (req, res) {
    let id = parseInt(req.query.id) || 0;

    if (id === 0) {
        res.json({
            code: '101',
            msg: '请求失败，参数错误',
            data: ''
        });
        return
    }
    try {

        let sql = "select a.id,title,author,state,pic,cateid,catename,content,keywords,`desc` from tp_article a join tp_cate c on a.cateid=c.id";
        let rows = await query(`${sql} where a.id=${id}`);

        res.json({
            code: '200',
            msg: '请求成功',
            data: rows[0]
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
 * 新增文章
 */
router.get('/add', modern(async function (req, res) {
    let title = req.query.title || '';//标题
    let author = req.query.author || '';//作者
    let desc = req.query.desc || '';//描述
    let keywords = req.query.keywords || '';//关键字
    let content = req.query.content || '';//文章内容
    let pic = req.query.pic || '';//缩略图
    let state = parseInt(req.query.state) || 0;//是否推荐
    let cateid = parseInt(req.query.cateid) || 0;//栏目id


    if ('' === title || '' === author || 0 === cateid || '' === content) {
        res.json({
            code: '101',
            msg: '请求失败，参数错误',
            data: ''
        });
        return
    }
    try {

        let time = comm.nowToStemp();

        let total = await query(`select count(id) as total from tp_article where title='${title}'`);

        if(total[0].total >0){
            res.json({
                code: '102',
                msg: '请求失败，该文章已经存在',
            });
            return;
        }

        let insertSql = "insert into tp_article(title,author,`desc`,keywords,content,pic,state,cateid,`time`)";
        let rows = await query(`${insertSql} values('${title}','${author}','${desc}','${keywords}','${content}','${pic}',${state},${cateid},${time})`);

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
 * 更新文章
 */

router.get('/up', modern(async function (req, res) {
    let id = parseInt(req.query.id) || 0;
    let title = req.query.title || '';//标题
    let author = req.query.author || '';//作者
    let desc = req.query.desc || '';//描述
    let keywords = req.query.keywords || '';//关键字
    let content = req.query.content || '';//文章内容
    let pic = req.query.pic || '';//缩略图
    let state = parseInt(req.query.state) || 0;//是否推荐
    let cateid = parseInt(req.query.cateid) || 0;//栏目id

    if (id === 0 || '' === title || cateid===0) {
        res.json({
            code: '101',
            msg: '请求失败，参数错误',
            data: ''
        });
        return
    }
    try {

        let total = await query(`select count(id) as total from tp_article where title='${title}' and  id not in (${id})`);

        if(total[0].total >0){
            res.json({
                code: '102',
                msg: '请求失败，该文章已经存在',
            });
            return;
        }

        let up_sql = "update tp_article set `state`="+state+",cateid="+cateid+",`desc`='"+desc+"',title='"+title+"',author='"+author+"',keywords='"+keywords+"',content='"+content+"',pic='"+pic+"' where id=?";

        let rows = await query(up_sql,id);

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

        let delete_sql = `delete from tp_article where id=?`;
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



router.get('/cashe', modern(async function (req, res, next) {

    try {
        await cashe.setCache("fist", "eqweqwe");
        const value = await cashe.getCashe("fist");

        res.json({
            code: 0,
            msg: '请求成功',
            data: value
        })
    } catch (e) {
        res.json({
            code: 1,
            msg: '请求失败  ',
            data: e
        })
    }


}));


router.get('/log', modern(async function (req, res, next) {



    await othlog.info('\nindex=>log:error->', JSON.stringify(req.query))
    res.json({
        code: 0,
        msg: '请求成功',
        data: ''
    })

}));


router.get('/os', modern(async function (req, res) {

    //判断数据类型
    let json ={name:"qweqwe",pass:'12312dasd'};
    let array = [];
    let string = '2121';
    let num = 222;
    let ok = true;

    console.log(json.constructor == Object)
    console.log(array.constructor == Array)
    console.log(string.constructor == String)
    console.log(num.constructor == Number)
    console.log(ok.constructor == Boolean)

    let file = fileDir+"/test.csv";
    let iswrite = await writeFile(json,file,true);
    res.json({
        code: 0,
        msg: '请求成功',
        data: iswrite
    })

}));


router.get('/normal', modern((req, res) => {
    res.send('normal function');
}));

/**
 * 写入文件
 * @param data 写入的数据
 * @param path 写入的文件路径
 * @param overWrite 是否追加内容  true 是 false 否
 * @returns {Promise<*>}
 */
async function writeFile(data, path,overWrite) {


    //写入文件之前判断目录是否存在
    let findDir = await dirExists(fileDir);
    if(!findDir){
        return false
    }


    // 向指定文件中写入指定的内容
    // 方法：writeFile('文件路径','写入的内容','处理结果的回调函数')

    return new Promise((resolve, reject) => {
        if(overWrite){
            // fs.appendFile 追加文件内容
            // 1, 参数1:表示要向那个文件追加内容,只一个文件的路径
            // 2, 参数2:表示要追加的内容
            // 3, 可选参数,表示追加文本内容的编码格式,如果省略,默认为utf-8
            // 4, 参数4: 表示追加完成之后的回调[有一个参数err,是判断是否追加成功]
            fs.appendFile(path,JSON.stringify(data) +"\n" , (error)  => {
                if (error) {
                    resolve( false )
                }else {
                    resolve( true )
                }
            });
        }else{
            // 在执行该方法时，如果文件不存在，直接创建，否则直接覆盖。
            fs.writeFile(path, JSON.stringify(data), function (error) {

                // 此处回调函数主要用于返回写入文件时的结果。error代表一个错误对象。
                // 当执行该方法时，会自动调用改回调函数，
                // 当写入文件出现错误时，error：返回一个错误对象，否则返回：null；
                if (error) {
                    resolve(false)
                }else{
                    resolve( true )
                }
            })
        }

    })
}

/**
 * 判断目录是否存在
 * @param path 需要判断的路径
 * @returns {Promise}
 */
async function getStat(path){
    return new Promise((resolve,reject)=>{
        fs.stat(path,(err,stats)=>{
            if(err){
                resolve(false)
            }else{
                resolve(stats)
            }
        })
    })
}

/**
 * 创建路径
 * @param dir  需要创建的路径
 * @returns {Promise<void>}
 */
async function makeDir(dir){
    return new Promise((resolve,reject)=>{
        fs.mkdir(dir,err=>{
            if(err){

                resolve(false)
            }else{
                resolve(true)
            }
        })
    })
}

/**
 * 判断路径是否存在，不存在创建，存在返回true
 * @param dir
 * @returns {Promise<*>}
 */

async function dirExists(dir){

    try {
        let isExists = await getStat(dir);

        //如果该路径且不是文件，返回true
        if(isExists && isExists.isDirectory()){
            return true;
        }else if(isExists) {
            //如果该路径存在但是文件，返回false
            return false;
        }

        return await makeDir(dir);
    }catch (e) {
        return false
    }


}

module.exports = router;
