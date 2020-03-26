const redis = require("redis");
// const redis_client = redis.createClient({host:'127.0.0.1',port:'6379',pwd:'123456',ttl:5*60*1000});
const client = redis.createClient();
const log4js = require('../log/log4');
const errlog = log4js.getLogger('err');
const dt = require('silly-datetime');


client.on("error", function (err) {
    let time=dt.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    errlog.info('\nredis=>connet:error->', JSON.stringify(err),"time:", time)
});

/**
 * 单个数据缓存
 * @param key
 * @param data string
 * @param exprie
 * @returns {Promise<*>}
 */
const setCache=async function(key,data,exprie){
    return new Promise((resolve,reject)=>{
        let ex = exprie ? exprie:60*60*24;
        let time=dt.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        client.set(key,data,'EX',ex,function(err,res) {
            if(err){
                errlog.info('\nredis=>set:error->', JSON.stringify(err),"time:", time);
                resolve(false)
            }else{
                resolve(data)
            }
        });
    });
};
/**
 * 获取单个数据缓存
 * @param key
 * @returns {Promise<*>}
 */
const getCashe=async function(key){
    return new Promise((resolve,reject)=>{
        let time=dt.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        client.get(key,function (err,reply) {
            if(err){
                errlog.info('\nredis=>get:error->', JSON.stringify(err),"time:", time);
                resolve(false)
            }else{
                resolve(reply)
            }
        });
    });
};
/**
 * 存一个数组,并将数组转为{key:value}格式的json  单数为key，双数为值 .必须是双数长度的数组
 * @param key
 * @param data array
 * @param exprie
 * @returns {Promise<*>}
 * 例如  ["msg","ok","code","200","data","qweqwe"]
 */
const setHset = async function(key,data,exprie){
    return new Promise((resolve, reject) => {
        let ex = exprie ? exprie:60*60*24;
        let time=dt.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        client.hset(key,data,function(err,res) {
            if(err){
                errlog.info('\nredis=>hset:error->', JSON.stringify(err),"time:", time);
                resolve(false)
            }else{
                if(res>=0){
                    client.expire(key,ex);
                    resolve(true)
                }else{
                    resolve(false)
                }

            }
        });

    });

};
/**
 *获取一个setHsetd的缓存
 * @param key
 * @returns {Promise<*>}返回一个json数据包
 */
const getHset = async function(key){
    return new Promise((resolve, reject) => {
        client.hgetall(key, function (err, replies) {
            if(err){
                errlog.info('\nredis=>hkeys:error->', JSON.stringify(err),"time:", time);
                resolve(false)
            }else {

                resolve(replies)
            }
        });
    });

};
/**
 * 与setHset功能相近,同时支持json对象存储,数字类型会被转为字符串类型
 * @param key
 * @param data
 * @param exprie
 * @returns {Promise<*>}
 */

const setHmset = async function(key,data,exprie){
    return new Promise((resolve, reject) => {
        let ex = exprie ? exprie:60*60*24;
        let time=dt.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        client.hmset(key, data,function(err,res) {
            if(err){
                errlog.info('\nredis=>hset:error->', JSON.stringify(err),"time:", time);
                resolve(false)
            }else{
                if(res === "OK"){
                    client.expire(key,ex);
                    resolve(true)
                }else{
                    resolve(false)
                }

            }
        });

    });
};
/**
 * 返回一个setHmset存储的缓存，返回一个json对象
 * @param key
 * @returns {Promise<*>}
 */
const getHmset = async function(key){
    return new Promise((resolve, reject) => {
        client.hgetall(key, function (err, replies) {
            if(err){
                errlog.info('\nredis=>hkeys:error->', JSON.stringify(err),"time:", time);
                resolve(false)
            }else {

                resolve(replies)
            }
        });
        // client.quit();
    });

};
/**
 * 移除某个缓存
 * @param key
 * @returns {Promise}
 */
const remove = async function(key){
    return new Promise((resolve, reject) => {
        client.del(key, function (err, replies) {
            if(err){
                errlog.info('\nredis=>hkeys:error->', JSON.stringify(err),"time:", time);
                resolve(false)
            }else {
                if(replies>=0){
                    resolve(true)
                }else{
                    resolve(false)
                }

            }
        });
    });
};


module.exports={
    setCache,
    getCashe,
    setHset,
    getHset,
    setHmset,
    getHmset,
    remove,

}