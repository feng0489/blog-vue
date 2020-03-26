// node 后端服务器


// const fs = require('fs');
// const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const app = express();

// 后端api路由
const userApi = require('./api/users.js');
const cateApi = require('./api/cate.js');
const admin = require('./api/admin.js');
const Article = require('./api/article.js');
const Links = require('./api/links.js');
const Tags = require('./api/tags.js');

//前端路由
const AppCate = require('./app/cate.js');
const AppArt = require('./app/article.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({ limit:'100mb', extended: true }));

// 后端api路由
app.use('/api/user', userApi);
app.use('/api/admin', admin);
app.use('/api/admin/cate', cateApi);
app.use('/api/admin/article', Article);
app.use('/api/admin/links', Links);
app.use('/api/admin/tags', Tags);


//前端路由
app.use('/api/cates', AppCate);
app.use('/api/articles', AppArt);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        let data = {
            "msg":"Not Found Exception",
            "code":"404",
        };
        res.json(data);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    let data = {
        "code":"404",
        "msg":err.message,
    }
    res.json(data);

});


// 监听端口
app.listen(8856);
console.log('success listen at port：8856');