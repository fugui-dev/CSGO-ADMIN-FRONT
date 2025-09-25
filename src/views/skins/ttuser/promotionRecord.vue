<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
        >
          <el-form-item label="用户ID" prop="userId">
            <el-input
              v-model="queryParams.userId"
              placeholder="请输入用户ID"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="充值记录ID" prop="rechargeRecordId">
            <el-input
              v-model="queryParams.rechargeRecordId"
              placeholder="请输入充值记录ID"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="下级用户ID" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择">
              <el-option label="未结算" value="0"></el-option>
              <el-option label="已结算" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
          :inline="true"
          size="small"
        >
          <el-form-item prop="value" label="推广统计">
            <el-select v-model="ruleForm.value" placeholder="请选择" clearable>
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              >
                <span style="float: left">{{ item.nickName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.phoneNumber }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleOpen('ruleForm')">统计</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="推广记录ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="下级用户ID" align="center" prop="subordinateUserId" />
      <el-table-column label="下级用户总消费" align="center" prop="totalConsumption" />
      <el-table-column label="返佣金额" align="center" prop="rebate" />
      <el-table-column label="充值记录ID" align="center" prop="rechargeRecordId" />
      <!--<el-table-column label="结算状态" align="center" prop="status">-->
      <!--  <template slot-scope="scope">-->
      <!--    <div v-if="scope.row.status == '1'" class="df">-->
      <!--      <span class="ds" style="background: #00a65a;"></span> 已结算-->
      <!--    </div>-->
      <!--    <div v-if="scope.row.status == '0'" class="df">-->
      <!--      <span class="ds" style="background: #DD4B39;"></span>-->
      <!--      未结算-->
      <!--    </div>-->
      <!--  </template>-->
      <!--</el-table-column>-->
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="更新时间" align="center" prop="updateTime" />
      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleOpen(scope.row)" type="text">统计</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改推广记录数据对话框 -->
    <el-dialog title="统计" :visible.sync="open" append-to-body width="50%">
      <el-row>
        <el-col :span="12" style="font-size:18px">
          下级总充值金额:{{formRecoard.rechargeTotal}}
          <span style="width: 50px; display: inline-block;"></span>
          总返佣金额: {{formRecoard.rebateTotal}}
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-radio-group v-model="labelPosition" size="small" @input="handleChange()">
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="day">日</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div id="tongji"></div>
        </el-col>
        <el-col :span="12">
          <div id="jiesuan"></div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPromotionRecord,
  statisticsPromotionData
} from "@/api/skins/ttuser/api";
import { listUser } from "@/api/skins/ttuser/api";
import { getInfo } from "@/api/login";
import * as echarts from "echarts";

export default {
  name: "Record",
  data() {
    return {
      op: null,
      labelPosition: "week",
      formRecoard: {},
      value: null,
      isSystemOperation: false, // 是否为system-operation角色
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 推广记录数据表格数据
      recordList: [],
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      userParams: {
        pageNum: 1,
        pageSize: 99
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        subordinateUserId: null,
        rechargePrice: null,
        rebate: null,
        rechargeRecordId: null,
        status: null
      },
      // 表单参数
      tableData: [],
      ruleForm: {
        value: null
      },
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        value: [{ required: true, message: "请选择用户", trigger: "change" }],
        subordinateUserId: [
          { required: true, message: "下级用户ID不能为空", trigger: "blur" }
        ],
        rechargePrice: [
          {
            required: true,
            message: "下级用户充值金额不能为空",
            trigger: "blur"
          }
        ],
        rebate: [
          { required: true, message: "返佣金额不能为空", trigger: "blur" }
        ],
        rechargeRecordId: [
          { required: true, message: "充值记录ID不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "结算状态不能为空", trigger: "change" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.checkUserRole();
    this.getList();
  },
  methods: {
    // 检查用户角色
    checkUserRole() {
      const roles = this.$store.getters.roles;
      this.isSystemOperation = roles && roles.includes('system-operation');
      console.log('用户角色:', roles);
      console.log('是否为system-operation:', this.isSystemOperation);
    },
    
    handleChange() {
      if (this.labelPosition == "month") {
        let value = [];
        value[0] = this.formRecoard.thisMonthRebateTotal;
        value[1] = this.formRecoard.thisMonthRechargeTotal;
        let data = [];
        data[0] = "本月返佣总金额";
        data[1] = "本月下级充值总金额	";
        this.op = "月";
        this.drawLine(data, value);
      } else if (this.labelPosition == "week") {
        let value = [];
        value[0] = this.formRecoard.thisWeekRebateTotal;
        value[1] = this.formRecoard.thisWeekRechargeTotal;
        let data = [];
        data[0] = "本周返佣总金额";
        data[1] = "本周下级充值总金额";
        this.op = "周";

        this.drawLine(data, value);
      } else if (this.labelPosition == "day") {
        let value = [];
        value[0] = this.formRecoard.todayRebateTotal;
        value[1] = this.formRecoard.todayRechargeTota;
        let data = [];
        data[0] = "今日返佣总金额";
        data[1] = "今日下级充值总金额";
        this.op = "日";

        this.drawLine(data, value);
      }
    },
    drawLine(data, value) {
      var chartDom = document.getElementById("tongji");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: `本${this.op}下级充值/返佣统计`
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          type: "category",
          data: data
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: value,
            type: "bar"
          }
        ]
      };

      option && myChart.setOption(option);
    },
    draw(data, value) {
      var chartDom = document.getElementById("jiesuan");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: "结算统计"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          type: "category",
          data: data
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: value,
            type: "bar"
          }
        ]
      };

      option && myChart.setOption(option);
    },
    handleOpen(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.open = true;
          statisticsPromotionData(this.ruleForm.value).then(res => {
            this.formRecoard = res.data;
            // this.tableData[0] = res.data;
            let data = [];
            data[0] = "已结算返佣金额";
            data[1] = "未结算返佣金额";
            let value = [];
            value[0] = res.data.balancedPrice;
            value[1] = res.data.unbalancedPrice;
            this.draw(data, value);
            this.handleChange();
          });
        } else {
        }
      });
    },
    /** 查询推广记录数据列表 */
    getList() {
      this.loading = true;
      
      const queryParams = { ...this.queryParams };
      
      // 如果是system-operation角色，添加parentId参数
      if (this.isSystemOperation) {
        getInfo().then(res => {
          const userInfo = res.user;
          const currentUserId = userInfo && userInfo.userId;
          console.log('用户信息:', userInfo);
          console.log('当前用户ID:', currentUserId);
          
          if (currentUserId) {
            queryParams.parentId = currentUserId;
            console.log('添加parentId参数:', currentUserId);
          } else {
            console.log('用户ID为空，无法添加parentId参数');
          }
          
          console.log('查询推广记录参数:', queryParams);
          getPromotionRecord(queryParams).then(response => {
            this.recordList = response.rows;
            this.total = response.total;
            this.loading = false;
            console.log('获取到的推广记录:', response.rows);
          });
        }).catch(error => {
          console.error('获取用户信息失败:', error);
          getPromotionRecord(queryParams).then(response => {
            this.recordList = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        });
      } else {
        console.log('查询推广记录参数:', queryParams);
        getPromotionRecord(queryParams).then(response => {
          this.recordList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }
      
      // 获取用户列表（用于下拉选择）
      listUser(this.userParams).then(response => {
        this.userList = response.rows;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        subordinateUserId: null,
        rechargePrice: null,
        rebate: null,
        rechargeRecordId: null,
        status: null,
        createTime: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加推广记录数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改推广记录数据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRecord(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除推广记录数据编号为"' + ids + '"的数据项？')
        .then(function() {
          return delRecord(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/record/export",
        {
          ...this.queryParams
        },
        `record_${new Date().getTime()}.xlsx`
      );
    }
  }
};
</script>
<style scoped lang="scss">
.df {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.ds {
  width: 8px;
  height: 8px;
  margin-right: 10px;
  border-radius: 50%;
  display: inline-block;
}
#jiesuan {
  width: 450px;
  height: 400px;
}
#tongji {
  width: 450px;
  height: 400px;
}
</style>
