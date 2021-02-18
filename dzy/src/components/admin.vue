<template>
  <div class="admin">
    <el-container class="main">
      <el-row>
        <el-col :span="24" class="title">
          <el-button
            type="primary"
            round
            class="mima"
            @click="resetpasswordShow = true"
            v-if="uid !== -1"
            >ResetPassword</el-button
          >
          <el-button type="primary" round class="logout" @click="logoutAdmin"
            >Logout</el-button
          >
          <p>用户管理</p>
          <p></p>
        </el-col>
        <el-row
          :gutter="40"
          style="width: 90%; margin: 0 auto; padding-top: 18vh"
        >
          <el-col :span="8" class="mb-5">
            <el-card>
              <el-table
                :data="
                  adminData.filter(
                    (data) =>
                      !search ||
                      data.aname.toLowerCase().includes(search.toLowerCase())
                  )
                "
                style="font-size: 18px"
                highlight-current-row
                height="450"
              >
                >
                <el-table-column
                  prop="aname"
                  label="AdminName"
                ></el-table-column>
                <el-table-column align="right" width="130">
                  <template slot="header" slot-scope="scope">
                    <el-input
                      v-model="search"
                      size="mini"
                      placeholder="search"
                    />
                  </template>
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="delAdmin(scope.$index, scope.row)"
                      >Delete</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="addAdmin">
                <div @click="addAdminShow = true">
                  <p>Add Admin</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="16" class="mb-5">
            <el-card>
              <el-table
                :data="userData"
                style="width: 100%; font-size: 18px"
                height="450"
              >
                <el-table-column prop="uname" label="姓名"> </el-table-column>
                <el-table-column prop="dept" label="部门"> </el-table-column>
                <el-table-column prop="post" label="职务"> </el-table-column>
                <el-table-column align="right" width="230">
                  <template slot="header" slot-scope="scope">
                    <el-input
                      v-model="search"
                      size="mini"
                      placeholder="search"
                    />
                  </template>
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="warning"
                      @click="changeShowAc(scope.$index, scope.row)"
                      >Change</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="delUser(scope.$index, scope.row)"
                      >Delete</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="addImg" @click="addUserShow = true">
                <p>Add User</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-row>
      <!-- 添加管理员弹框 -->
      <el-dialog
        title="Adding new admin"
        :visible.sync="addAdminShow"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form
          ref="setAdmin"
          :rules="setAdminCheck"
          :model="setAdmin"
          label-width="120px"
          style="width: 80%; margin: 0 auto; margin-top: 30px"
        >
          <el-form-item label="Adminname：" prop="aname">
            <el-input
              v-model="setAdmin.aname"
              placeholder="Administrator account"
            ></el-input>
          </el-form-item>
          <el-form-item label="Password：" prop="pass">
            <el-input
              v-model="setAdmin.pass"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="Repasswprd：" prop="checkPass">
            <el-input
              v-model="setAdmin.checkPass"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="setAdminMethod('setAdmin')"
              >Submit</el-button
            >
            <el-button @click="resetForm('setAdmin')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 添加用户弹框 -->
      <el-dialog
        title="Adding new users"
        :visible.sync="addUserShow"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form
          ref="setUser"
          :rules="setUserCheck"
          :model="setUser"
          label-width="110px"
          style="width: 80%; margin: 0 auto; margin-top: 30px"
        >
          <el-form-item label="姓名：" prop="uname">
            <el-input v-model="setUser.uname"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="pass">
            <el-input
              v-model="setUser.pass"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="checkPass">
            <el-input
              v-model="setUser.checkPass"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="部门：" prop="dept">
            <el-input v-model="setUser.dept"></el-input>
          </el-form-item>
          <el-form-item label="职位：" prop="post" style="text-align: left">
            <el-radio-group v-model="setUser.post" style="padding-top: 7px">
              <el-radio label="项目经理"></el-radio>
              <el-radio label="事务员"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="setUserMethod('setUser')"
              >Submit</el-button
            >
            <el-button @click="resetForm('setUser')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 改密码 -->
      <el-dialog
        title="Change password"
        :visible.sync="resetpasswordShow"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="35%"
      >
        <el-form
          :model="passwordForm"
          label-width="150px"
          :rules="resetRules"
          ref="passwordForm"
        >
          <el-form-item label="Original password :" prop="oldpass">
            <el-input
              v-model="passwordForm.oldpass"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="New password :" prop="newpass1">
            <el-input
              v-model="passwordForm.newpass1"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="Repassword :" prop="newpass2">
            <el-input
              v-model="passwordForm.newpass2"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="resetpassword">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改用户信息 -->
      <el-dialog
        title="Change user"
        :visible.sync="changeShow"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="35%"
      >
        <el-form
          ref="changeUser"
          :rules="changeUserCheck"
          :model="changeUser"
          label-width="110px"
          style="width: 80%; margin: 0 auto; margin-top: 30px"
        >
          <el-form-item label="姓名：" style="text-align: left"
            >{{ changeUser.uname }}
          </el-form-item>
          <el-form-item label="部门：" prop="cdept">
            <el-input v-model="changeUser.cdept"></el-input>
          </el-form-item>
          <el-form-item label="职位：" prop="cpost" style="text-align: left">
            <el-radio-group v-model="changeUser.cpost" style="padding-top: 7px">
              <el-radio label="项目经理"></el-radio>
              <el-radio label="事务员"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changeUserMethod('changeUser')"
              >Submit</el-button
            >
            <el-button @click="resetForm('changeUser')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import {
  sel_user,
  sel_admin,
  sel_user_name,
  del_admin,
  del_user,
  add_user,
  add_admin,
  change_user,
  reset_pass,
} from "@/services/post";
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password"));
      } else {
        if (this.setUser.checkPass !== "") {
          this.$refs.setUser.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.setUser.pass) {
        callback(
          new Error("The password is inconsistent between the two entries!")
        );
      } else {
        callback();
      }
    };
    let validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password"));
      } else {
        if (this.setAdmin.checkPass !== "") {
          this.$refs.setAdmin.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass4 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.setAdmin.pass) {
        callback(
          new Error("The password is inconsistent between the two entries!")
        );
      } else {
        callback();
      }
    };
    let resetPass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your new password"));
      } else {
        if (this.passwordForm.newpass2 !== "") {
          this.$refs.passwordForm.validateField("newpass2");
        }
        callback();
      }
    };
    let resetPass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your new password again"));
      } else if (value !== this.passwordForm.newpass1) {
        callback(
          new Error("The password is inconsistent between the two entries!")
        );
      } else {
        callback();
      }
    };
    return {
      // root: false,
      adminData: [],
      userData: [],
      uname: "",
      addUname: "",
      value: [],
      addAdminShow: false,
      addUserShow: false,
      changeShow: false,
      resetpasswordShow: false,
      search: "",
      setAdmin: {
        aname: "",
        pass: "",
        checkPass: "",
      },
      setUser: {
        uname: "",
        dept: "",
        post: "",
        pass: "",
        checkPass: "",
      },
      changeUser: {
        uid: "",
        uname: "",
        cdept: "",
        cpost: "",
      },
      passwordForm: {
        oldpass: "",
        newpass1: "",
        newpass2: "",
      },
      setUserCheck: {
        uname: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        dept: [
          {
            required: true,
            message: "请输入部门",
            trigger: "blur",
          },
        ],
        post: [
          {
            required: true,
            message: "请选择职位",
            trigger: "change",
          },
        ],
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }],
      },
      changeUserCheck: {
        uname: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        cdept: [
          {
            required: true,
            message: "请输入部门",
            trigger: "blur",
          },
        ],
        cpost: [
          {
            required: true,
            message: "请选择职位",
            trigger: "change",
          },
        ],
      },
      setAdminCheck: {
        aname: [
          {
            required: true,
            message: "Please enter a admin name",
            trigger: "blur",
          },
        ],
        pass: [{ validator: validatePass3, trigger: "blur" }],
        checkPass: [{ validator: validatePass4, trigger: "blur" }],
      },
      resetRules: {
        oldpass: [
          {
            required: true,
            message: "Please enter your old password",
            trigger: "blur",
          },
        ],
        newpass1: [{ validator: resetPass1, trigger: "blur" }],
        newpass2: [{ validator: resetPass2, trigger: "blur" }],
      },
    };
  },
  computed: {
    uid() {
      return this.$store.state.user.uid;
    },
    username() {
      return this.$store.state.user.uname;
    },
    // 文章列表筛选
  },
  mounted() {
    this.adminShow();
    this.showUserList();
  },
  methods: {
    // 显示用户列表
    async showUserList() {
      let params = {};
      const selUser = await sel_user({
        params,
      });
      this.userData = selUser.data;
    },
    // 添加用户
    setUserMethod(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          sel_user_name({
            params: {
              uname: that.setUser.uname,
            },
          }).then((res) => {
            if (res.code == 1) {
              that.resetForm("setUser");
              alert("The username already exists !");
            } else {
              add_user(
                that.setUser.uname,
                that.setUser.pass,
                that.setUser.dept,
                that.setUser.post
              ).then((res) => {
                if (res.code == 1) {
                  that.showUserList();
                  that.addUserShow = false;
                  that.resetForm("setUser");
                  alert("Successfully added !");
                } else {
                  alert("Fail to add !");
                  that.resetForm("setUser");
                }
              });
            }
          });
        } else {
          console.log("error submit !");
          return false;
        }
      });
    },
    // 添加管理员
    setAdminMethod(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          add_admin(that.setAdmin.aname, that.setAdmin.pass).then((res) => {
            if (res.code == 1) {
              that.adminShow();
              that.addAdminShow = false;
              that.resetForm("setAdmin");
              alert("Successfully added !");
            } else {
              alert("Fail to add !");
            }
          });
        } else {
          console.log("error submit !");
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      // 重置
      this.$refs[formName].resetFields();
    },
    // 显示管理员列表
    async adminShow() {
      const selAdmin = await sel_admin();
      if (selAdmin.code > 0) this.adminData = selAdmin.data;
    },
    // 删除管理员
    delAdmin(index, row) {
      let that = this;
      this.$confirm(
        "This operation will permanently delete the data, whether to continue?",
        "Hint",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          del_admin(row.aname).then((res) => {
            if (res.code > 0) {
              that.adminShow();
            } else {
              console.log("error");
            }
          });
        })
        .catch(() => {});
    },
    // 删除用户
    delUser(index, row) {
      let that = this;
      this.$confirm(
        "This operation will permanently delete the data, whether to continue?",
        "Hint",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          del_user(row.uid).then((res) => {
            if (res.code > 0) {
              that.showUserList();
            } else {
              console.log("error");
            }
          });
        })
        .catch(() => {});
    },
    // 修改用户数据
    changeShowAc(index, row) {
      this.changeUser.uname = row.uname;
      this.changeUser.uid = row.uid;
      this.changeUser.cdept = row.dept;
      this.changeUser.cpost = row.post;
      this.changeShow = true;
    },
    changeUserMethod(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          change_user(
            that.changeUser.uid,
            that.changeUser.cdept,
            that.changeUser.cpost
          ).then((res) => {
            if (res.code == 1) {
              that.showUserList();
              that.changeShow = false;
              that.resetForm("changeUser");
              alert("Successfully added !");
            } else {
              alert("Fail to add !");
              that.resetForm("changeUser");
            }
          });
        } else {
          console.log("error submit !");
          return false;
        }
      });
    },
    // 退出登录
    ...mapMutations(["logout"]),
    logoutAdmin() {
      this.logout();
      this.$router.push("/");
    },
    // 改密码
    async resetpassword() {
      reset_pass(
        this.username,
        this.passwordForm.oldpass,
        this.passwordForm.newpass1
      ).then((res) => {
        if (res.code > 0) {
          this.resetpasswordShow = false;
          this.resetForm("passwordForm");
          this.$message({
            message: res.msg,
            type: "success",
          });
        } else {
          this.resetForm("passwordForm");
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none !important;
}
.right {
  float: right;
}
p {
  margin-top: 0;
  margin-bottom: 0;
}
.el-link.el-link--default {
  font-size: 1rem;
  font-weight: 400;
}
.main {
  background: url(../assets/adminBJ.png) no-repeat;
  background-size: 100%;
  min-width: 1350px;
  min-height: 90vh;
  position: relative;
}
.el-row {
  width: 100%;
}
.logout {
  position: absolute;
  top: 1rem;
  right: 2rem;
  font-size: 1.2rem;
  font-weight: 400;
  cursor: pointer;
}
.mima {
  position: absolute;
  top: 1rem;
  right: 10rem;
  font-size: 1.2rem;
  font-weight: 400;
  z-index: 100;
  cursor: pointer;
}
.title {
  font-size: 2.5rem;
  text-align: center;
  font-family: Alibaba PuHuiTi;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  line-height: 50px;
  margin: 0 auto;
  padding: 1.5rem;
}
.title p:last-child {
  font-size: 1.5rem;
  font-weight: lighter;
}
.addAdmin {
  width: 40%;
  cursor: pointer;
  margin-top: 6%;
  background: url(../assets/addUser.png) no-repeat;
  background-size: 100%;
  height: 110px;
  font-size: 18px;
  color: #fff;
  padding: 6% 0 0 5%;
  text-align: left;
}
.addImg {
  cursor: pointer;
  margin-top: 2%;
  width: 19%;
  height: 110px;
  background: url(../assets/addUser.png) no-repeat;
  background-size: 100%;
  font-size: 18px;
  color: #fff;
  padding: 3% 0 0 3%;
  text-align: left;
}
.upload {
  margin: 0 auto;
}
.el-card {
  height: 630px;
}
.uploadclose {
  font-size: 1.1rem;
  cursor: pointer;
}
.uploadclose:hover {
  color: rgba(0, 123, 255, 0.8);
}
</style>
