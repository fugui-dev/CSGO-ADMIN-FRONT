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
      <el-form-item label="Roll房名称	" prop="nickName">
        <el-input
          v-model="queryParams.rollName"
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
      <el-table-column type="selection" width="50" align="center" />

      <el-table-column align="center" prop="id" label="Id" width="50"></el-table-column>
      <el-table-column align="center" prop="rollName" label="房间名"></el-table-column>
      <el-table-column align="center" prop="rollType" label="房间类型" width="103">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.rollType == 0">官方房间</el-tag>
          <el-tag v-else>主播房间</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="rollPassword" label="密码" width="63"></el-table-column>
      <el-table-column align="center" prop="peopleNum" label="可参与人数" width="123"></el-table-column>
      <el-table-column align="center" prop="endTime" label="开奖时间" width="188"></el-table-column>
      <el-table-column align="center" prop="rechargeStartTime" label="计算充值起始日期" width="188"></el-table-column>
      <el-table-column align="center" prop="minRecharge" label="充值X币" width="103"></el-table-column>
      <el-table-column align="center" prop="rollStatus" label="状态" width="103">
        <template slot-scope="scope">
          <div
            v-if="scope.row.rollStatus == '0'"
            style="display:flex; align-items:center;justify-content:center;line-height: 1;"
          >
            <span
              style="width: 8px; height:8px; margin-right:10px;   border-radius: 50%;   background-color: green; display:inline-block;"
            ></span>
            进行中
          </div>
          <div
            v-if="scope.row.rollStatus == '1'"
            style="display:flex; align-items:center;justify-content:center;"
          >
            <span
              style="width: 8px; height:8px; margin-right:10px;   border-radius: 50%;   background-color: #DD4B39; display:inline-block;"
            ></span>
            已结束
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sortBy" label="排序值" width="100"></el-table-column>
      <el-table-column align="center" prop="createBy" label="创建用户" width="103"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="188"></el-table-column>
      <el-table-column align="center" prop="address" label="操作" width="400">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-top"
            @click="handleMoveUp(scope.row)"
            :disabled="scope.$index === 0"
          >上移</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-bottom"
            @click="handleMoveDown(scope.row, scope.$index)"
            :disabled="scope.$index === tableData.length - 1"
          >下移</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
          >删除</el-button>
          <el-button type="text" size="mini" icon="el-icon-edit" @click="handleChange(scope.row)">修改</el-button>
          <el-button type="text" size="mini" icon="el-icon-view" @click="handleSelect(scope.row)">详情</el-button>
          <el-button type="text" size="mini" icon="el-icon-view" @click="handleOpenRoll(scope.row)">手动开奖</el-button>
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
        <el-form-item label="房间类型" prop="rollType">
          <el-select v-model="form.rollType" placeholder="请选择房间类型">
            <el-option
              v-for="dict in dict.type.roll_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主播" prop="userId" v-if="form.rollType == 1">
          <el-select v-model="form.userId" filterable placeholder="请选择主播" clearable>
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.nickName + '  |  ' + item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间名" prop="rollName">
          <el-input v-model="form.rollName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" v-model="form.description"></el-input>
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
        <el-form-item label="开奖时间" prop="endTime">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.endTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="8:00:00"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="参与人数" prop="peopleNum">
          <el-input-number v-model="form.peopleNum" :min="1" :max="1000" label="参与人数"></el-input-number>
        </el-form-item>
        <el-form-item label="房间密码" prop="rollPassword">
          <el-input v-model="form.rollPassword" autocomplete="off" placeholder="请输入房间密码"></el-input>
          <span style="font-size: 12px;">
            <i class="el-icon-info"></i> 为空表示无密码
          </span>
        </el-form-item>
        <el-form-item label="计算充值起始日期" prop="rechargeStartTime">
          <el-date-picker
            v-model="form.rechargeStartTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="充值门槛" prop="minRecharge">
          <el-input v-model="form.minRecharge" autocomplete="off"></el-input>
          <span style="font-size: 12px;">
            <i class="el-icon-info"></i> 为0时表示不做限制
          </span>
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
            <el-form-item label="房间名：">{{ form.rollName }}</el-form-item>
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
          <el-col :span="12">
            <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开奖时间：">{{ form.endTime }}</el-form-item>
          </el-col>
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
  list,
  rollJackpotList,
  roll,
  delRoll,
  rollChange,
  endRoll,
  updateRollSort
} from "@/api/skins/ttRoll/api";
import { listUser } from "@/api/skins/ttuser/api";

export default {
  dicts: ["roll_type", "user_status"],

  data() {
    return {
      total: 1,
      openView: false,
      menuType: "A",
      title: "",
      form: {
        description: null,
        endTime: null,
        jackpotId: null,
        minRecharge: 0,
        peopleNum: 1,
        rechargeStartTime: null,
        rollName: null,
        rollPassword: null,
        rollType: null,
        sortBy: null,
        userId: null
      },
      rules: {
        rollType: [
          { required: true, message: "请选择房间类型", trigger: "blur" }
        ],
        jackpotId: [{ required: true, message: "请选择奖池", trigger: "blur" }],
        userId: [{ required: true, message: "请选择主播", trigger: "blur" }],
        rollName: [
          { required: true, message: "请输入roll房名称", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择开奖时间", trigger: "blur" }
        ],
        minRecharge: [
          { required: true, message: "请输入充值金额", trigger: "blur" }
        ],
        peopleNum: [
          { required: true, message: "请选择参与人数", trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
      ids: [],
      types: {
        userType: "01",
        pageSize: 99999
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
        rollName: null,
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
    handleOpenRoll(res){
      this.$modal
        .confirm('确认要手动开奖"' + res.rollName + '？')
        .then(() => {
          endRoll(res.id).then(res => {
            this.getList();
            this.$modal.msgSuccess("开奖成功！");
          });
        })
        .catch(() => {});
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
          rollChange(this.form).then(res => {
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
              rollName: null,
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
          roll(this.form).then(res => {
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
              rollName: null,
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
      let query = {
        pageSize: 100,
        pageNum: 1
      }
      rollJackpotList(query).then(res => {
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
        rollName: null,
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
          delRoll(row).then(res => {
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
        rollName: null,
        rollStatus: null
      };
      this.handleQuery();
    },
    getList() {
      this.loading = true;
      list(this.queryParams).then(res => {
        this.tableData = res.rows;
        this.loading = false;
        this.total = res.total;
      });
    },
    /** 上移 */
    handleMoveUp(row) {
      const currentIndex = this.tableData.findIndex(item => item.id === row.id);
      if (currentIndex > 0) {
        const prevRow = this.tableData[currentIndex - 1];
        const currentSortBy = row.sortBy != null ? row.sortBy : 0;
        const prevSortBy = prevRow.sortBy != null ? prevRow.sortBy : 0;
        
        // 如果两个值相同，使用时间戳确保有差异
        let newCurrentSortBy = prevSortBy;
        let newPrevSortBy = currentSortBy;
        
        if (newCurrentSortBy === newPrevSortBy) {
          // 如果值相同，给上移的项一个更大的值
          newCurrentSortBy = prevSortBy + 1;
          newPrevSortBy = currentSortBy;
        }
        
        // 更新当前行
        updateRollSort({
          id: row.id,
          sortBy: newCurrentSortBy
        }).then(() => {
          // 更新上一行
          return updateRollSort({
            id: prevRow.id,
            sortBy: newPrevSortBy
          });
        }).then(() => {
          this.$modal.msgSuccess("排序更新成功");
          this.getList();
        }).catch(() => {
          this.$modal.msgError("排序更新失败");
        });
      }
    },
    /** 下移 */
    handleMoveDown(row, index) {
      if (index < this.tableData.length - 1) {
        const nextRow = this.tableData[index + 1];
        const currentSortBy = row.sortBy != null ? row.sortBy : 0;
        const nextSortBy = nextRow.sortBy != null ? nextRow.sortBy : 0;
        
        // 交换排序值
        let newCurrentSortBy = nextSortBy;
        let newNextSortBy = currentSortBy;
        
        if (newCurrentSortBy === newNextSortBy) {
          // 如果值相同，给下移的项一个更小的值
          newCurrentSortBy = nextSortBy;
          newNextSortBy = currentSortBy - 1;
          if (newNextSortBy < 0) {
            newNextSortBy = 0;
            newCurrentSortBy = 1;
          }
        }
        
        // 更新当前行
        updateRollSort({
          id: row.id,
          sortBy: newCurrentSortBy
        }).then(() => {
          // 更新下一行
          return updateRollSort({
            id: nextRow.id,
            sortBy: newNextSortBy
          });
        }).then(() => {
          this.$modal.msgSuccess("排序更新成功");
          this.getList();
        }).catch(() => {
          this.$modal.msgError("排序更新失败");
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.home {
  padding: 20px;
}
</style>
