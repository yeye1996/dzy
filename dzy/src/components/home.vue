<template>
  <el-main style="width: 100%">
    <div class="topTitle">
      <img src="../assets/top.png" alt />
    </div>
    <div class="title mb-3">项目管理</div>
    <el-row class="mt-5">
      <el-col :span="1" :offset="2"
        ><el-button
          type="primary"
          icon="el-icon-plus"
          @click="setProjectShow = true"
          >创建新项目</el-button
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
          <el-table-column prop="ptype" width="130" label="状态">
          </el-table-column>
          <el-table-column align="right" width="320">
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
          <el-input v-model="setProject.sppeople"></el-input>
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
          <el-input v-model="changeProject.cppeople"></el-input>
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
        <el-form-item label="项目名称：" style="text-align: left" prop="stname">
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
        <el-form-item label="项目名称：" style="text-align: left" prop="ctname"
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
  </el-main>
</template>

<script>
import {
  sel_project,
  sel_task,
  del_project,
  del_task,
  change_project,
  change_task,
  add_project,
  add_task,
} from "@/services/post";
export default {
  data() {
    return {
      tableData: [],
      taskData: [],
      search: "",
      changeProjectShow: false,
      setProjectShow: false,
      changeTaskShow: false,
      setTaskShow: false,
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
    };
  },
  computed: {
    post() {
      return this.$store.state.user.post;
    },
    uname() {
      return this.$store.state.user.uname;
    },
  },
  mounted() {
    this.projectShow();
  },
  methods: {
    // 显示项目列表
    async projectShow() {
      const projectData = await sel_project({
        params: {
          uname: this.uname,
          post: this.post,
        },
      });
      let data = projectData.data;
      data.forEach((e) => {
        e.ptime = [e.pstart, e.pend];
      });
      this.tableData = data;
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
            that.setProject.sppeople
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