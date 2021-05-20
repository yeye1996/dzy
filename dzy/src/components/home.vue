<template>
  <el-main style="width: 100%">
    <el-col :span="24" class="title text-right">
      <el-button
        type="primary"
        round
        class="mima"
        @click="resetpasswordShow = true"
        v-if="post !== -1"
        >ResetPassword</el-button
      >
      <el-button type="primary" round class="logout" @click="logoutAdmin"
        >Logout</el-button
      >
      <p></p>
    </el-col>
    <div class="title mb-3">项目管理</div>
    <el-row class="mt-5">
      <el-col :span="1" :offset="2"
        ><el-button
          type="primary"
          icon="el-icon-plus"
          @click="setProjectShow = true"
          v-if="post == '项目经理'"
          >创建新项目</el-button
        ></el-col
      >
      <el-col :span="1" :offset="1"
        ><el-button type="primary" icon="el-icon-search" @click="setgangte"
          >统计项目进度</el-button
        ></el-col
      >
      <el-col :span="1" :offset="1"
        ><el-button type="primary" @click="exp_sam" v-if="post == '项目经理'"
          >导出项目</el-button
        ></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-table
          :data="tableData"
          @row-click="taskShowMethod"
          highlight-current-row
          stripe
          style="font-size: 18px"
          height="600"
        >
          <el-table-column prop="pname" label="项目名称"> </el-table-column>
          <el-table-column prop="pstart" label="开始时间——结束时间" width="370"
            ><template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.ptime"
                type="daterange"
                :readonly="true"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker></template
          ></el-table-column>
          <el-table-column prop="ppeople" label="成员"></el-table-column>
          <el-table-column
            prop="ptype"
            width="130"
            label="状态"
            :filters="[
              { text: '计划', value: '计划' },
              { text: '实施', value: '实施' },
              { text: '结束', value: '结束' },
              { text: '取消', value: '取消' },
            ]"
            :filter-method="filterTag"
          >
            <template slot-scope="scope">
              {{ scope.row.ptype }}
            </template>
          </el-table-column>
          <el-table-column align="right" width="320" v-if="post == '项目经理'">
            <template slot="header" slot-scope="scope">
              <el-input v-model="search" size="mini" placeholder="search" />
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="addtask(scope.$index, scope.row)"
                >新建任务</el-button
              >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-setting"
                @click="changeProjectAc(scope.$index, scope.row)"
                >修改项目</el-button
              >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="delproject(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-table :data="taskData" stripe style="font-size: 18px" height="600">
          <el-table-column prop="tname" label="任务名称"> </el-table-column>
          <el-table-column label="开始时间——结束时间" width="370"
            ><template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.ttime"
                type="daterange"
                :readonly="true"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker></template
          ></el-table-column>
          <el-table-column prop="ttype" width="130" label="状态">
          </el-table-column>
          <el-table-column prop="workload" label="工作量"></el-table-column>
          <el-table-column prop="demand" label="要求"></el-table-column>
          <el-table-column align="right" width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-setting"
                @click="changeTaskAc(scope.$index, scope.row)"
                >修改任务</el-button
              >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="delTask(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 新建项目 -->
    <el-dialog
      title="Set Project"
      :visible.sync="setProjectShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="45%"
    >
      <el-form
        ref="setProject"
        :rules="setProjectCheck"
        :model="setProject"
        label-width="110px"
        style="width: 80%; margin: 0 auto; margin-top: 30px; text-align: left"
      >
        <el-form-item label="项目名称：" style="text-align: left" prop="spname">
          <el-input v-model="setProject.spname"></el-input>
        </el-form-item>
        <el-form-item label="始末时间：">
          <el-date-picker
            v-model="setProject.sptime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="人员：" prop="sppeople">
          <el-select
            v-model="setProject.sppeople"
            multiple
            collapse-tags
            placeholder="请选择人员"
          >
            <el-option
              v-for="item in people_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addProject('setProject')"
            >Submit</el-button
          >
          <el-button @click="resetForm('setProject')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改项目内容 -->
    <el-dialog
      title="Change Project"
      :visible.sync="changeProjectShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="45%"
    >
      <el-form
        ref="changeProject"
        :rules="changeProjectCheck"
        :model="changeProject"
        label-width="110px"
        style="width: 80%; margin: 0 auto; margin-top: 30px; text-align: left"
      >
        <el-form-item label="项目名称：" style="text-align: left" prop="cpname"
          ><el-input v-model="changeProject.cpname"></el-input>
        </el-form-item>
        <el-form-item label="始末时间：">
          <el-date-picker
            v-model="changeProject.cptime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态：" prop="cptype" style="text-align: left">
          <el-radio-group
            v-model="changeProject.cptype"
            style="padding-top: 7px"
          >
            <el-radio label="计划"></el-radio>
            <el-radio label="实施"></el-radio>
            <el-radio label="结束"></el-radio>
            <el-radio label="取消"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="人员：" prop="cppeople">
          <el-select
            v-model="changeProject.cppeople"
            multiple
            collapse-tags
            placeholder="请选择人员"
          >
            <el-option
              v-for="item in people_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="changeProjectMethod('changeProject')"
            >Submit</el-button
          >
          <el-button @click="resetForm('changeProject')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新建任务 -->
    <el-dialog
      title="Set Task"
      :visible.sync="setTaskShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="45%"
    >
      <el-form
        ref="setTask"
        :rules="setTaskCheck"
        :model="setTask"
        label-width="110px"
        style="width: 80%; margin: 0 auto; margin-top: 30px; text-align: left"
      >
        <el-form-item label="任务名称：" style="text-align: left" prop="stname">
          <el-input v-model="setTask.stname"></el-input>
        </el-form-item>
        <el-form-item label="始末时间：" prop="sttime">
          <el-date-picker
            v-model="setTask.sttime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工作量：" prop="sworkload">
          <el-input v-model="setTask.sworkload"></el-input>
        </el-form-item>
        <el-form-item label="要求：" prop="sdemand">
          <el-input v-model="setTask.sdemand"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addTaskMethod('setTask')"
            >Submit</el-button
          >
          <el-button @click="resetForm('setTask')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改任务 -->
    <el-dialog
      title="Change Task"
      :visible.sync="changeTaskShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="45%"
    >
      <el-form
        ref="changeTask"
        :rules="changeTaskCheck"
        :model="changeTask"
        label-width="110px"
        style="width: 80%; margin: 0 auto; margin-top: 30px; text-align: left"
      >
        <el-form-item label="任务名称：" style="text-align: left" prop="ctname"
          ><el-input v-model="changeTask.ctname"></el-input>
        </el-form-item>
        <el-form-item label="始末时间：">
          <el-date-picker
            v-model="changeTask.cttime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态：" prop="cttype" style="text-align: left">
          <el-radio-group v-model="changeTask.cttype" style="padding-top: 7px">
            <el-radio label="未完成"></el-radio>
            <el-radio label="提前完成"></el-radio>
            <el-radio label="按时完成"></el-radio>
            <el-radio label="超时完成"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工作量：" prop="cworkload">
          <el-input v-model="changeTask.cworkload"></el-input>
        </el-form-item>
        <el-form-item label="要求：" prop="cdemand">
          <el-input v-model="changeTask.cdemand"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeTaskMethod('changeTask')"
            >Submit</el-button
          >
          <el-button @click="resetForm('changeTask')">Reset</el-button>
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
    <el-dialog
      title="项目进度"
      :visible.sync="tjProjectShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <div>
        提前完成：
        <el-progress
          style="width: 55%; margin: 0 auto"
          :text-inside="true"
          :stroke-width="24"
          :percentage="percentage[0]"
        ></el-progress>
      </div>
      <div class="mt-3">
        按时完成：
        <el-progress
          style="width: 55%; margin: 0 auto"
          :text-inside="true"
          :stroke-width="24"
          :percentage="percentage[1]"
          status="success"
        ></el-progress>
      </div>
      <div class="mt-3">
        超时完成：
        <el-progress
          style="width: 55%; margin: 0 auto"
          :text-inside="true"
          :stroke-width="24"
          :percentage="percentage[2]"
          status="exception"
        ></el-progress>
      </div>
      <div class="mt-3">
        未完成：
        <el-progress
          style="width: 55%; margin: 0 auto"
          :text-inside="true"
          :stroke-width="24"
          :percentage="percentage[3]"
          status="exception"
        ></el-progress>
      </div>
    </el-dialog>
  </el-main>
</template>

<script>
import { mapMutations } from "vuex";
import $ from "jquery";
import {
  sel_project,
  sel_task,
  del_project,
  del_task,
  change_project,
  change_task,
  add_project,
  add_task,
  sel_user_shiwuyuan,
} from "@/services/post";
export default {
  data() {
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
      tableData: [],
      taskData: [],
      search: "",
      percentage: [0, 0, 0, 0],
      resetpasswordShow: false,
      changeProjectShow: false,
      setProjectShow: false,
      changeTaskShow: false,
      setTaskShow: false,
      tjProjectShow: false,
      people_options: [],
      options: [
        {
          value: "提前完成",
          label: "提前完成",
        },
        {
          value: "按时完成",
          label: "按时完成",
        },
        {
          value: "超时完成",
          label: "超时完成",
        },
        {
          value: "未完成",
          label: "未完成",
        },
      ],
      value: false,
      changeProject: {
        cpname: "",
        cptime: [],
        cptype: "",
        cppeople: "",
      },
      changeProjectCheck: {
        cpname: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        cppeople: [
          {
            required: true,
            message: "请选择人员",
            trigger: "blur",
          },
        ],
      },
      setProject: {
        spname: "",
        sptime: [],
        sptype: "计划",
        sppeople: "",
      },
      setProjectCheck: {
        spname: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        sppeople: [
          {
            required: true,
            message: "请选择人员",
            trigger: "blur",
          },
        ],
      },
      changeTask: {
        ctid: "",
        cpid: "",
        ctname: "",
        cttime: [],
        cttype: "",
        cworkload: "",
        cdemand: "",
      },
      changeTaskCheck: {
        ctname: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        cttime: [
          {
            required: true,
            message: "请输入始末时间",
            trigger: "blur",
          },
        ],
        cworkload: [
          {
            required: true,
            message: "请输入工作量",
            trigger: "blur",
          },
        ],
        cdemand: [
          {
            required: true,
            message: "请输入要求",
            trigger: "blur",
          },
        ],
      },
      setTask: {
        spid: "",
        stname: "",
        sttime: [],
        sttype: "计划",
        sworkload: "",
        sdemand: "",
      },
      setTaskCheck: {
        stname: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        sttime: [
          {
            required: true,
            message: "请输入始末时间",
            trigger: "blur",
          },
        ],
        sworkload: [
          {
            required: true,
            message: "请输入工作量",
            trigger: "blur",
          },
        ],
        sdemand: [
          {
            required: true,
            message: "请输入要求",
            trigger: "blur",
          },
        ],
      },
      passwordForm: {
        oldpass: "",
        newpass1: "",
        newpass2: "",
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
      filterVal: ["pid", "pname", "ppeople", "pstart", "pend", "ptype"],
      tHeader: ["项目号", "项目名", "人员", "开始时间", "结束时间", "项目状态"],
    };
  },
  computed: {
    post() {
      return this.$store.state.user.post;
    },
    dept() {
      return this.$store.state.user.dept;
    },
    uname() {
      return this.$store.state.user.uname;
    },
    // 筛选
    filterTag() {
      return (value, row) => {
        return row.ptype === value;
      };
    },
  },
  mounted() {
    this.projectShow();
    this.post == "项目经理" ? this.sel_people() : "";
  },
  methods: {
    // 显示项目列表
    async projectShow() {
      const projectData = await sel_project({
        params: {
          post: this.post,
          uname: this.uname,
        },
      });
      let data = projectData.data;
      data.forEach((e) => {
        e.ptime = [e.pstart, e.pend];
      });
      this.tableData = data;
    },
    async sel_people() {
      let that = this;
      const bb = await sel_user_shiwuyuan({
        params: {
          dept: this.dept,
        },
      });
      if (bb.data.length !== 0) {
        bb.data.forEach((e) => {
          that.people_options.push({
            value: e.uname,
            label: e.uname,
          });
        });
      }
    },
    // 删除一个项目
    delproject(index, row) {
      let that = this;
      this.$confirm("是否删除这个项目", "Hint", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del_project(row.pid).then((res) => {
            if (res.code > 0) {
              that.projectShow();
            } else {
              console.log("error");
            }
          });
        })
        .catch(() => {});
    },
    // 添加项目
    addProject(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          add_project(
            that.setProject.spname,
            that.setProject.sptime[0],
            that.setProject.sptime[1],
            that.setProject.sptype,
            that.setProject.sppeople.toString()
          ).then((res) => {
            if (res.code == 1) {
              that.projectShow();
              that.setProjectShow = false;
              that.resetForm(formName);
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
    // 修改项目信息
    changeProjectAc(index, row) {
      this.changeProject.cpid = row.pid;
      this.changeProject.cpname = row.pname;
      this.changeProject.cptime = row.ptime;
      this.changeProject.cptype = row.ptype;
      this.changeProject.cppeople = row.ppeople;
      this.changeProjectShow = true;
    },
    changeProjectMethod(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          change_project(
            that.changeProject.cpid,
            that.changeProject.cpname,
            that.changeProject.cptime[0],
            that.changeProject.cptime[1],
            that.changeProject.cptype,
            that.changeProject.cppeople
          ).then((res) => {
            if (res.code == 1) {
              that.projectShow();
              that.changeProjectShow = false;
              that.resetForm(formName);
              alert("Successfully added !");
            } else {
              alert("Fail to add !");
              that.resetForm(formName);
            }
          });
        } else {
          console.log("error submit !");
          return false;
        }
      });
    },
    // 显示任务列表
    taskShowMethod(row, column, event) {
      this.taskShow(row.pid);
      this.value = true;
    },
    async taskShow(id) {
      const taskData_ = await sel_task({
        params: {
          pid: id,
        },
      });
      let data = taskData_.data;
      if (data) {
        data.forEach((e) => {
          e.ttime = [e.tstart, e.tend];
        });
      }
      this.taskData = data;
    },
    // 添加任务
    addtask(index, row) {
      this.setTask.spid = row.pid;
      this.setTaskShow = true;
    },
    addTaskMethod(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          add_task(
            that.setTask.spid,
            that.setTask.stname,
            that.setTask.sttime[0],
            that.setTask.sttime[1],
            that.setTask.sptype,
            that.setTask.sworkload,
            that.setTask.sdemand
          ).then((res) => {
            if (res.code == 1) {
              that.taskShow(that.setTask.spid);
              that.setTaskShow = false;
              that.resetForm(formName);
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
    // 删除一个任务
    delTask(index, row) {
      let that = this;
      this.$confirm("是否删除这个任务", "Hint", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del_task(row.tid).then((res) => {
            if (res.code > 0) {
              that.taskShow(row.pid);
            } else {
              console.log("error");
            }
          });
        })
        .catch(() => {});
    },
    // 修改项目信息
    changeTaskAc(index, row) {
      this.changeTask.ctid = row.tid;
      this.changeTask.cpid = row.pid;
      this.changeTask.ctname = row.tname;
      this.changeTask.cttime = row.ttime;
      this.changeTask.cttype = row.ttype;
      this.changeTask.cworkload = row.workload;
      this.changeTask.cdemand = row.demand;
      this.changeTaskShow = true;
    },
    changeTaskMethod(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          change_task(
            that.changeTask.ctid,
            that.changeTask.ctname,
            that.changeTask.cttime[0],
            that.changeTask.cttime[1],
            that.changeTask.cttype,
            that.changeTask.cworkload,
            that.changeTask.cdemand
          ).then((res) => {
            if (res.code == 1) {
              that.taskShow(that.changeTask.cpid);
              that.changeTaskShow = false;
              that.resetForm(formName);
              alert("Successfully added !");
            } else {
              alert("Fail to add !");
              that.resetForm(formName);
            }
          });
        } else {
          console.log("error submit !");
          return false;
        }
      });
    },
    // 重置表格
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 退出
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
    // 统计完成情况
    setgangte() {
      this.percentage = 0;
      let that = this;
      let count = 0,
        count1 = 0,
        count2 = 0,
        count3 = 0;
      if (that.value&&that.taskData) {
        that.taskData.forEach((e) => {
          if (e.ttype == "提前完成") {
            count = count + 1;
          }
          if (e.ttype == "按时完成") {
            count1 = count1 + 1;
          }
          if (e.ttype == "超时完成") {
            count2 = count2 + 1;
          }
          if (e.ttype == "未完成") {
            count3 = count3 + 1;
          }
        });
        this.percentage = [
          (count / that.taskData.length) * 100,
          (count1 / that.taskData.length) * 100,
          (count2 / that.taskData.length) * 100,
          (count3 / that.taskData.length) * 100,
        ];
        this.tjProjectShow = true;
      } else {
        that.$message.error("选择一个不为空项目");
      }
    },
    // 导出
    exp_sam() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../assets/Export2Excel.js");
        const data = this.formatJson(this.filterVal, this.tableData);
        export_json_to_excel(this.tHeader, data, "项目列表");
      });
    },
    // map方法给表按excel格式排序
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },
};
</script>

<style scoped>
.topTitle {
  width: 8rem;
  margin: 0 auto;
}
.topTitle img {
  width: 100%;
}
.title {
  width: 100%;
  font-size: 30px;
  font-weight: bold;
  font-family: Alibaba PuHuiTi;
  color: rgba(0, 68, 139, 1);
  line-height: 50px;
  float: left;
  margin: 0 auto;
  text-align: center;
}
</style>