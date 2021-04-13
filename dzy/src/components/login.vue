<template>
  <div class="login">
    <el-row>
      <el-col :span="24">
        <div class="form">
          <div class="formTitle">
            <p>Account login</p>
            <p></p>
          </div>
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            class="ruleForm"
            size="medium"
          >
            <el-form-item prop="name">
              <el-input
                v-model="form.name"
                placeholder="Your Username"
                prefix-icon="el-icon-s-custom"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="form.password"
                show-password
                placeholder="Your Password"
                prefix-icon="el-icon-lock"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 40px">
              <el-button
                type="primary"
                @click="submitForm('form')"
                class="btnstyle"
                >登录</el-button
              >
              <!-- <el-button @click="resetForm('form')">重置</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import Head from "@/components/header";
import { mapMutations } from "vuex";
import { user_login } from "@/services/post";
export default {
  // components: {
  //   Head,
  // },
  data() {
    return {
      form: {
        name: "",
        password: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入你的账号",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
      superUser: [{ uid: -1, uname: "root", upwd: "111111" }],
    };
  },
  methods: {
    // 引入状态管理方法
    ...mapMutations(["addpost", "addusername", "adddept"]),
    submitForm(formName) {
      let that = this;
      // 验证是否填写必填选项
      that.$refs[formName].validate((valid) => {
        if (valid) {
          // 判断是不是超级管理员
          if (that.form.name == "root") {
            for (let i of that.superUser) {
              if (i.uname == that.form.name && i.upwd == that.form.password) {
                // 将id  name存在状态管理器中，方便全局使用
                that.addpost(i.uid);
                that.addusername(i.uname);
                that.$router.push("/admin");
                return;
              }
            }
            return;
          } else {
            // 验证登录接口
            user_login({
              uname: this.form.name,
              upwd: this.form.password,
            }).then((res) => {
              // 如返回码大于1则登录成功，存name id
              if (res.code > 0) {
                that.addpost(res.data[0]);
                that.adddept(res.data[2]);
                that.addusername(that.form.name);
                // 判断使用户还是管理员，分别跳转页面
                res.data[1] == "user"
                  ? that.$router.push("/home")
                  : that.$router.push("/admin");
              } else {
                // 登录失败弹出提示框
                that.$message.error(
                  "The account password is incorrect or expired"
                );
                that.$refs[formName].resetFields();
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.ruleForm {
  width: 100%;
  margin: 0 auto;
}
.form {
  width: 400px;
  height: 50vh;
  min-height: 420px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 50px 0px rgba(103, 182, 206, 0.27);
  border-radius: 20px;
  margin: 0 auto;
  margin-top: 18vh;
  padding: 6% 5%;
}
.formTitle {
  font-size: 26px;
  font-family: Alibaba PuHuiTi;
  color: rgba(0, 66, 140, 1);
  text-align: center;
}
.formTitle p:first-child {
  font-weight: bold;
}
.formTitle p:nth-child(2) {
  margin-top: 5%;
  margin-bottom: 5%;
  font-weight: lighter;
}
.formTitle p:last-child {
  width: 10%;
  border-bottom: 1px solid #00428c;
  margin: 0 auto;
  margin-bottom: 8%;
}
.login {
  height: 100vh;
  min-height: 600px;
  background: #00428c;
}
.btnstyle {
  width: 100%;
  background: #00428c;
}
</style>
