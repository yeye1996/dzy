//引入第三方模块
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require('body-parser');//引入post参数存放body中间件
//配置数据库连接池
var pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  port: 3306,
  database: 'dzy',
  connectionLimit: 15
});
var server = express();
//解决跨域
server.use(cors({
  origin: ["http://127.0.0.1:8080",
    "http://localhost:8080"],
  credentials: true
}));
// 配置中间件
server.use(bodyParser.urlencoded({
  extended: true
}));
server.use(bodyParser.json({ limit: '1mb' }));
server.listen(3000);
// 登录
server.post("/login", (req, res) => {
  let uname = req.body.uname;
  let upwd = req.body.upwd;
  let sql = "SELECT post , dept FROM user WHERE uname = ? AND upwd = md5(?)";
  let obj = { code: 1, msg: "登录成功", data: [] }
  pool.query(sql, [uname, upwd], (err, result) => {
    if (err) throw err;
    if (result.length == 0) {
      // 管理员登录
      sql = "SELECT aid FROM admin WHERE aname = ? AND apwd = md5(?)"
      pool.query(sql, [uname, upwd], (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
          res.send({ code: -1, msg: "用户名或密码有误" });
        } else {
          obj.data = [result[0].aid, "admin"];
          res.send(obj);
        }
      });
    } else {
      // 用户登录
      obj.data = [result[0].post, "user", result[0].dept];
      res.send(obj);
    }
  })
});


// 注册用户
server.post("/register", (req, res) => {
  let uname = req.body.uname;
  let upwd = req.body.upwd;
  let dept = req.body.dept;
  let post = req.body.post;
  let sql = "INSERT INTO `user` (`uid`, `uname`, `upwd`, `dept`, `post`) VALUES (NULL, ?, md5(?), ?, ?)"
  pool.query(sql, [uname, upwd, dept, post], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "添加成功" });
    } else {
      res.send({ code: -1, msg: "添加失败" });
    }
  })
})
// 添加管理员
server.post("/addAdmin", (req, res) => {
  let aname = req.body.aname;
  let apwd = req.body.apwd;
  let sql = "INSERT INTO `admin` (`aid`, `aname`, `apwd`) VALUES (null, ?, md5(?))";
  pool.query(sql, [aname, apwd], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "添加成功" });
    } else {
      res.send({ code: -1, msg: "添加失败" });
    }
  });
})




// 修改用户姓名、部门、职务
server.post("/changeUser", (req, res) => {
  let uid = req.body.uid;
  let dept = req.body.dept;
  let post = req.body.post;
  let sql = "UPDATE `user` SET `dept` = ? , `post` = ? WHERE `user`.`uid` = ?";
  pool.query(sql, [dept, post, uid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "修改成功" });
    } else {
      res.send({ code: -1, msg: "修改失败" });
    }
  });
});
// 修改项目内容
server.post("/changeProject", (req, res) => {
  let pid = req.body.pid;
  let pname = req.body.pname;
  let pstart = req.body.pstart;
  let pend = req.body.pend;
  let ptype = req.body.ptype;
  let ppeople = req.body.ppeople;
  let sql = "UPDATE `project` SET `pname` = ?, `pstart` = ?, `pend` = ?, `ptype` = ?, `ppeople` = ? WHERE `project`.`pid` = ?;";
  pool.query(sql, [pname, pstart, pend, ptype, ppeople, pid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "修改成功" });
    } else {
      res.send({ code: -1, msg: "修改失败" });
    }
  });
});
// 修改任务内容
server.post("/changeTask", (req, res) => {
  let tid = req.body.tid;
  let tname = req.body.tname;
  let tstart = req.body.tstart;
  let tend = req.body.tend;
  let ttype = req.body.ttype;
  let workload = req.body.workload;
  let demand = req.body.demand;
  let sql = "UPDATE `task` SET `tname` = ?, `tstart` = ?, `tend` = ?, `workload` = ?, `demand` = ?, `ttype` = ? WHERE `task`.`tid` = ?;";
  pool.query(sql, [tname, tstart, tend, workload, demand, ttype, tid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "修改成功" });
    } else {
      res.send({ code: -1, msg: "修改失败" });
    }
  });
});
// 创建项目
server.post("/setProject", (req, res) => {
  let pname = req.body.pname;
  let pstart = req.body.pstart;
  let pend = req.body.pend;
  let ppeople = req.body.ppeople;
  let sql = "INSERT INTO `project` (`pid`, `pname`, `pstart`, `pend`, `ptype`, `ppeople`) VALUES (NULL, ?, ?, ?, '计划', ?)"
  pool.query(sql, [pname, pstart, pend, ppeople], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "添加成功" });
    } else {
      res.send({ code: -1, msg: "添加失败" });
    }
  })
})
// 创建任务
server.post("/setTask", (req, res) => {
  let pid = req.body.pid;
  let tname = req.body.tname;
  let tstart = req.body.tstart;
  let tend = req.body.tend;
  let workload = req.body.workload;
  let demand = req.body.demand;
  let sql = "INSERT INTO `task` (`tid`, `pid`, `tname`, `tstart`, `tend`, `workload`, `demand`, `ttype`) VALUES (NULL, ?, ?, ?, ?, ?, ?, '未完成')";
  pool.query(sql, [pid, tname, tstart, tend, workload, demand], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "添加成功" });
    } else {
      res.send({ code: -1, msg: "添加失败" });
    }
  })
})




// 查看管理员列表
server.get("/selAdmin", (req, res) => {
  let sql = "SELECT aname FROM admin";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ code: 1, msg: "查询成功", data: result })
    } else {
      res.send({ code: -1, msg: "查询失败" })
    }
  });
});
// 查询用户列表
server.get("/selUser", (req, res) => {
  let obj = { code: 1, msg: "查询成功", data: [] }
  let sql = "SELECT uid,uname,dept,post FROM user"
  pool.query(sql, (err, result) => {
    if (err) throw err;
    obj.data = result;
    res.send(obj)
  });
});
// 查询用户姓名
server.get("/selUserName", (req, res) => {
  let uname = req.query.uname;
  let sql = "SELECT uid FROM user WHERE uname=?";
  pool.query(sql, [uname], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ code: 1, msg: "查询成功", data: result })
    } else {
      res.send({ code: -1, msg: "查询失败" })
    }
  });
});
// 查询项目
server.get("/selProject", (req, res) => {
  let post = req.query.post;
  let uname = req.query.uname;
  let sql;
  if (post == "事务员") {
    sql = "SELECT * FROM project WHERE locate(?,ppeople)"
    pool.query(sql, [uname], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.send({ code: 1, msg: "查询成功", data: result })
      } else {
        res.send({ code: -1, msg: "查询失败" })
      }
    });
  } else {
    sql = "SELECT * FROM project"
    pool.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.send({ code: 1, msg: "查询成功", data: result })
      } else {
        res.send({ code: -1, msg: "查询失败" })
      }
    });
  }
});
// 查看任务
server.get("/selTask", (req, res) => {
  let pid = req.query.pid;
  let sql = "SELECT * FROM task where pid=?"
  pool.query(sql, [pid], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ code: 1, msg: "查询成功", data: result })
    } else {
      res.send({ code: -1, msg: "查询失败" })
    }
  });
});
// 查询事务员
server.get("/selUserShiwuyuan", (req, res) => {
  let dept = req.query.dept;
  let sql = "SELECT uid,uname FROM user WHERE dept=?";
  pool.query(sql, [ dept], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ code: 1, msg: "查询成功", data: result })
    } else {
      res.send({ code: -1, msg: "查询失败" })
    }
  });
});


// 删除管理员
server.post('/delAdmin', (req, res) => {
  let aname = req.body.aname;
  let sql = "DELETE FROM `admin` WHERE `aname` = ?";
  pool.query(sql, [aname], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "删除成功" });
    } else {
      res.send({ code: -1, msg: "删除失败" });
    }
  })
})
// 删除用户
server.post('/delUser', (req, res) => {
  let uid = req.body.uid;
  let sql = "DELETE FROM `user` WHERE `uid` = ?";
  pool.query(sql, [uid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "删除成功" });
    } else {
      res.send({ code: -1, msg: "删除失败" });
    }
  })
})
// 删除项目
server.post('/delProject', (req, res) => {
  let pid = req.body.pid;
  let sql = "DELETE FROM `project` WHERE `pid` = ?";
  pool.query(sql, [pid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "删除成功" });
    } else {
      res.send({ code: -1, msg: "删除失败" });
    }
  })
})
// 删除任务
server.post('/delTask', (req, res) => {
  let tid = req.body.tid;
  let sql = "DELETE FROM `task` WHERE `tid` = ?";
  pool.query(sql, [tid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 1, msg: "删除成功" });
    } else {
      res.send({ code: -1, msg: "删除失败" });
    }
  })
})