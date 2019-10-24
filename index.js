//导入mysql包
var mysql = require('mysql');
var connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'root',
   port: '3306',
   database: 'reji'
});
connection.connect();
// 上面是数据库引用加连接

// 1.应用express框架，2.使用public中的资源
var express = require('express');
var app = express();
app.use(express.static('public')); //使用public中的资源
//参数里为'/'则是默认打开页面
app.get('/', function (req, res) { //这个是在初始界面显示index页面，声明使用index.html这个路径
   res.sendFile(__dirname + "/" + "index.html");
})
app.get('/index', function (req, res) { //这个是在路径为/index中使用index.html这个页面
   res.sendFile(__dirname + "/" + "index.html");
})
//这上面涉及了设路径，引资源，（以后就不提引用xx模块了。）


//login登陆进去的地方！
app.get('/login', function (req, res) {
   var response = {
      "account": req.query.account,
      "password": req.query.password,
   };
   // ↓，数据库sql语句，查看数据库中的account,password from user！
   var selectSQL = "select account,password from user where account = '" + req.query.account + "' and password = '" + req.query.password + "'";
   // var selectSQL = "select password from user where account='"+req.query.account+"'";
   var addSqlParams = [req.query.account, req.query.password]; //你输入的密码
   // console.log(addSqlParams) //看看你输入的密码和账号，不看也行
   connection.query(selectSQL, function (err, result) { //开始对比你输入账号密码和数据库的一不一样？
      if (err) { //有错就说
         console.log('[login ERROR] - ', err.message);
         return;
      }
      console.log(result);
      if (result == '') {
         console.log("帐号密码错误");
         res.end("0"); //如果登录失败就给客户端返回0，
      } else {
         console.log("OK");
         res.end("登陆成功"); //如果登录成就给客户端返回1
      }
   });
   console.log(response);
   // res.end(JSON.stringify(response));
})

// 设置注册路由
app.get('/register', function (req, res) {
   res.sendFile(__dirname + "/" + "register.html");
})
//注册模块。sql语句，添加user表中的(account,password,name)
var addSql = 'INSERT INTO user(account,password,name) VALUES(?,?,?)';
// 设置路由放数据
app.get('/process_get', function (req, res) {
   // 输出 JSON 格式
   var response = {
      "account": req.query.account,
      "password": req.query.password,
      "name": req.query.name
   };
   var addSqlParams = [req.query.account, req.query.password, req.query.name];
   connection.query(addSql, addSqlParams, function (err, result) {
      if (err) {
         console.log('[INSERT ERROR] - ', err.message);
         res.end("0"); //如果注册失败就给客户端返回0
         return; //如果失败了就直接return不会继续下面的代码
      }
      res.end("注册成功"); //如果注册成功就给客户端返回1
      console.log("OK");
   });
   console.log(response);
   // res.end(JSON.stringify(response));
})




//链接端口，启动服务器！
var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("应用实例，访问地址为 http://%s:%s", host, port)

})