<template>
  <div class="home">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="ID" prop="userName">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入Roll房ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Roll房名称" prop="nickName">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入Roll房名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Roll房状态	" prop="rollStatus">
        <el-select v-model="queryParams.rollStatus" placeholder="请选择Roll房类型" clearable>
          <el-option label="已结束" value="1"></el-option>
          <el-option label="进行中" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleCreat"
          v-hasPermi="['admin:user:export']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['admin:user:export']"
        >导出</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['admin:user:edit']"
        >删除</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />

      <el-table-column align="center" prop="id" label="Id"></el-table-column>
      <el-table-column align="center" prop="name" label="房间名"></el-table-column>
      <el-table-column align="center" prop="rechargeCondition" label="循环条件"></el-table-column>
      <el-table-column align="center" prop="minRecharge" label="充值门槛"></el-table-column>
      <el-table-column align="center" prop="rollStatus" label="状态">
        <template slot-scope="scope">
          <div
            v-if="scope.row.status == '0'"
            style="display:flex; align-items:center;justify-content:center;line-height: 1;"
          >
            <span
              style="width: 8px; height:8px; margin-right:10px;   border-radius: 50%;   background-color: green; display:inline-block;"
            ></span>
            开启
          </div>
          <div
            v-if="scope.row.status == '1'"
            style="display:flex; align-items:center;justify-content:center;"
          >
            <span
              style="width: 8px; height:8px; margin-right:10px;   border-radius: 50%;   background-color: #DD4B39; display:inline-block;"
            ></span>
            关闭
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sortBy" label="置顶"></el-table-column>
      <el-table-column align="center" prop="createBy" label="创建用户"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
          >删除</el-button>
          <el-button type="text" size="mini" icon="el-icon-edit" @click="handleChange(scope.row)">修改</el-button>
          <el-button type="text" size="mini" icon="el-icon-view" @click="handleSelect(scope.row)">详情</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-view"
            @click="handleRouter(scope.row)"
          >装备列表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />
    <!-- 添加 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" :rules="rules" label-width="100px" ref="ruleForm">
        <el-form-item label="房间名" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="奖池" prop="jackpotId">
          <el-select v-model="form.jackpotId" filterable placeholder="请选择" clearable>
            <el-option
              v-for="item in JackpotList"
              :key="item.jackpotId"
              :label="item.jackpotName"
              :value="item.jackpotId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="循环条件" prop="rechargeCondition" v-if="title== '新建Roll房'">
          <el-select v-model="form.rechargeCondition" filterable placeholder="请选择" clearable>
            <el-option
              v-for="dict in dict.type.time_roll_condition"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值门槛" prop="minRecharge">
          <el-input v-model="form.minRecharge" autocomplete="off"></el-input>
          <span style="font-size: 12px;">
            <i class="el-icon-info"></i> 为0时表示不做限制
          </span>
        </el-form-item>

        <el-form-item label="排序" prop="sortBy" v-if="title == '修改Roll房'">
          <el-input-number type="textarea" v-model="form.sortBy"></el-input-number>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="title == '新建Roll房'" type="primary" @click="submitForm('ruleForm')">新 增</el-button>
        <el-button v-if="title == '修改Roll房'" type="primary" @click="handleSub('ruleForm')">修 改</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="openView" width="35%">
      <el-form ref="form" :model="form" label-width="150px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Roll房ID：">{{ form.id }}</el-form-item>
            <el-form-item label="房间名：">{{ form.name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码：">{{ form.rollPassword || '无密码'}}</el-form-item>
            <el-form-item label="可参与人数：">{{ form.peopleNum }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="roll房状态：">
              <div v-if="form.rollStatus == '0'">进行中</div>
              <div v-if="form.rollStatus == '1'">已结束</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开奖时间：">{{ form.endTime }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="roll房类型：" prop="userType">
              <span v-if="form.rollType === '0'">官方房间</span>
              <span v-if="form.rollType === '1'">主播房间</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主播ID：" v-if="form.rollType == '1'">{{form.userId}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计算充值起始日期：">{{ form.rechargeStartTime || '不计' }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="充值门槛：">{{ form.minRecharge }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建者：">{{ form.createBy }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="roll房创建时间：">{{ form.createTime }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="更新者：">{{ form.updateBy }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间：">{{ form.updateTime }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"></el-col>
          <el-col :span="12"></el-col>
        </el-row>
        <el-row>
          <el-form-item label="房间描述：">{{ form.description }}</el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openView = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTimeRoll,
  rollJackpotList,
  addtimeRoll,
  delTimeroll,
  changetimeRoll
} from "@/api/skins/ttRoll/api";
import { listUser } from "@/api/skins/ttuser/api";

export default {
  dicts: ["roll_type", "user_status", "time_roll_condition"],

  data() {
    return {
      total: 1,
      openView: false,
      menuType: "A",
      title: "",
      form: {
        rechargeCondition: 0,
        description: null,
        endTime: null,
        jackpotId: null,
        minRecharge: 0,
        peopleNum: 1,
        rechargeStartTime: null,
        name: null,
        rollPassword: null,
        rollType: null,
        sortBy: null,
        userId: null
      },
      rules: {
        jackpotId: [{ required: true, message: "请选择奖池", trigger: "blur" }],
        userId: [{ required: true, message: "请选择主播", trigger: "blur" }],
        name: [{ required: true, message: "请输roll房名称", trigger: "blur" }],
        endTime: [
          { required: true, message: "请选择开奖时间", trigger: "blur" }
        ],
        minRecharge: [
          { required: true, message: "请输入充值金额", trigger: "select" }
        ],
        rechargeCondition: [
          { required: true, message: "请选择循环条件", trigger: "select" }
        ]
      },
      dialogFormVisible: false,
      ids: [],
      types: {
        userType: "01",
        pageSize: 99
      },
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      loading: false,
      showSearch: true,
      JackpotList: [],
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        name: null,
        rollStatus: null
      },
      tableData: [],
      userList: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleRouter(res) {
      this.$router.push({
        path: "/roll/awarddetali",
        query: {
          id: res.id
        }
      });
    },
    handleSelect(res) {
      this.form = {};
      this.openView = true;
      this.form = res;
    },
    handleChange(res) {
      this.form = {};
      this.form = res;
      this.selected();
      this.title = "修改Roll房";
      this.dialogFormVisible = true;
    },
    handleSub(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          changetimeRoll(this.form).then(res => {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.dialogFormVisible = false;
            this.form = {
              description: null,
              endTime: null,
              jackpotId: null,
              minRecharge: 0,
              peopleNum: 1,
              rechargeStartTime: null,
              name: null,
              rollPassword: null,
              rollType: null,
              sortBy: null,
              userId: null
            };
            this.getList();
          });
        } else {
          return false;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addtimeRoll(this.form).then(res => {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.dialogFormVisible = false;
            this.form = {
              description: null,
              endTime: null,
              jackpotId: null,
              minRecharge: 0,
              peopleNum: 1,
              rechargeStartTime: null,
              name: null,
              rollPassword: null,
              rollType: null,
              sortBy: null,
              userId: null
            };
            this.getList();
          });
        } else {
          return false;
        }
      });
    },
    selected() {
      listUser(this.types).then(res => {
        this.userList = res.rows;
      });
      rollJackpotList().then(res => {
        this.JackpotList = res.rows;
      });
    },
    handleCreat() {
      this.selected();
      this.dialogFormVisible = true;
      this.title = "新建Roll房";
      this.form = {
        description: null,
        endTime: null,
        jackpotId: null,
        minRecharge: 0,
        peopleNum: 1,
        rechargeStartTime: null,
        name: null,
        rollPassword: null,
        rollType: null,
        sortBy: null,
        userId: null
      };
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除ID为"' + row + '"的Roll房？')
        .then(() => {
          delTimeroll(row).then(res => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          });
        })
        .catch(() => {});
    },
    handleExport() {
      this.download(
        "admin/roll/export",
        {
          ...this.queryParams
        },
        `Roll_${new Date().getTime()}.xlsx`
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        id: null,
        pageNum: 1,
        pageSize: 10,
        name: null,
        rollStatus: null
      };
      this.handleQuery();
    },
    getList() {
      this.loading = true;
      getTimeRoll(this.queryParams).then(res => {
        this.tableData = res.rows;
        this.loading = false;
        this.total = res.total;
      });
    }
  }
};
</script>
<style scoped lang="scss">
.home {
  padding: 20px;
}
</style>