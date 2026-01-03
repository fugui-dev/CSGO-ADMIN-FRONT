<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户账号" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最少开箱次数" prop="minOpenCount">
        <el-input-number
          v-model="queryParams.minOpenCount"
          :min="0"
          placeholder="最少开箱次数"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="排序方式" prop="orderBy">
        <el-select v-model="queryParams.orderBy" placeholder="请选择排序方式" clearable style="width: 150px">
          <el-option label="倒序（高到低）" value="desc"></el-option>
          <el-option label="正序（低到高）" value="asc"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="profitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="用户ID" align="center" prop="userId" width="80" />
      <el-table-column label="用户账号" align="center" prop="userName" width="120" />
      <el-table-column label="用户昵称" align="center" prop="nickName" width="120" />
      <el-table-column label="开箱次数" align="center" prop="openCount" width="100" />
      <el-table-column label="平台收入" align="center" prop="totalIncome" width="120">
        <template slot-scope="scope">
          {{ formatMoney(scope.row.totalIncome) }}
        </template>
      </el-table-column>
      <el-table-column label="平台支出" align="center" prop="totalOutcome" width="120">
        <template slot-scope="scope">
          {{ formatMoney(scope.row.totalOutcome) }}
        </template>
      </el-table-column>
      <el-table-column label="平台利润" align="center" prop="profit" width="120">
        <template slot-scope="scope">
          <span :class="scope.row.profit >= 0 ? 'text-success' : 'text-danger'">
            {{ formatMoney(scope.row.profit) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="平台实际利润率" align="center" prop="actualProfitMargin" width="140">
        <template slot-scope="scope">
          <span :class="getProfitMarginClass(scope.row.actualProfitMargin)">
            {{ scope.row.actualProfitMargin }}%
          </span>
        </template>
      </el-table-column>
      <el-table-column label="平台目标利润率" align="center" prop="targetProfitMargin" width="140">
        <template slot-scope="scope">
          {{ scope.row.targetProfitMargin }}%
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deviation" width="100">
        <template slot="header">
          <span>偏差</span>
          <el-tooltip content="正偏差：平台赚得不够；负偏差：平台赚得太多" placement="top">
            <i class="el-icon-question" style="margin-left: 5px; cursor: pointer;"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span :class="getDeviationClass(scope.row.deviation)">
            {{ scope.row.deviation > 0 ? '+' : '' }}{{ scope.row.deviation }}%
          </span>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" align="center" prop="userType" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.userType === '01' ? 'success' : 'info'" size="mini">
            {{ scope.row.userType === '01' ? '主播' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >设置目标</el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-refresh"
            @click="handleReset(scope.row)"
          >重置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 设置目标利润率对话框 -->
    <el-dialog title="设置平台目标利润率" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="用户ID">
          <el-input v-model="form.userId" disabled />
        </el-form-item>
        <el-form-item label="用户账号">
          <el-input v-model="form.userName" disabled />
        </el-form-item>
        <el-form-item label="最大全局目标利润率" v-if="form.globalTargetMargin">
          <el-input v-model="form.globalTargetMargin" disabled>
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="平台目标利润率" prop="targetProfitMargin">
          <el-input-number
            v-model="form.targetProfitMargin"
            :min="-100"
            :max="100"
            :precision="2"
            :step="0.1"
            style="width: 100%"
          >
            <template slot="append">%</template>
          </el-input-number>
          <div style="color: #909399; font-size: 12px; margin-top: 5px">
            提示：平台目标利润率范围 -100% 到 100%
            <br>
            • 正数：平台从该用户身上赚取的利润率（会降低高价值饰品概率）
            <br>
            • 负数：平台愿意亏损的利润率（会提高高价值饰品概率，用于留住客户）
            <span v-if="form.globalTargetMargin">（最大全局目标利润率：{{ form.globalTargetMargin }}%）</span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUserProfitStatistics,
  updateUserTargetProfitMargin,
  resetUserTargetProfitMargin,
  getUserProfitDetail,
  getMaxGlobalTargetProfitMargin
} from '@/api/skins/userProbabilityControl/api'

export default {
  name: 'UserProbabilityControl',
  data() {
    return {
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
      // 平台利润率列表
      profitList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        userName: null,
        nickName: null,
        minOpenCount: 5,
        windowSize: null,
        orderBy: 'desc' // 默认倒序（高到低）
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        targetProfitMargin: [
          { required: true, message: '平台目标利润率不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询平台利润率列表 */
    getList() {
      this.loading = true
      listUserProfitStatistics(this.queryParams).then(response => {
        this.profitList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        userId: null,
        userName: null,
        targetProfitMargin: null,
        globalTargetMargin: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 设置目标利润率按钮操作 */
    handleUpdate(row) {
      this.reset()
      // 从后端获取最大全局目标利润率
      getMaxGlobalTargetProfitMargin().then(response => {
        if (response.code === 200) {
          this.form = {
            userId: row.userId,
            userName: row.userName,
            targetProfitMargin: row.targetProfitMargin,
            globalTargetMargin: response.data || 30 // 使用后端返回的值，如果没有则使用30作为默认值
          }
          this.open = true
        } else {
          // 如果获取失败，使用列表中的目标利润率作为参考（如果没有个人配置，列表显示的就是最大全局目标利润率）
          this.form = {
            userId: row.userId,
            userName: row.userName,
            targetProfitMargin: row.targetProfitMargin,
            globalTargetMargin: row.targetProfitMargin || 30 // 使用列表中的目标利润率作为参考
          }
          this.open = true
        }
      }).catch(() => {
        // 如果请求失败，使用列表中的目标利润率作为参考
        this.form = {
          userId: row.userId,
          userName: row.userName,
          targetProfitMargin: row.targetProfitMargin,
          globalTargetMargin: row.targetProfitMargin || 30 // 使用列表中的目标利润率作为参考
        }
        this.open = true
      })
    },
    /** 重置目标利润率按钮操作 */
    handleReset(row) {
      this.$modal.confirm('是否确认重置用户【' + row.userName + '】的平台目标利润率？').then(() => {
        return resetUserTargetProfitMargin({ userId: row.userId })
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('重置成功')
      }).catch(() => {})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateUserTargetProfitMargin({
            userId: this.form.userId,
            targetProfitMargin: this.form.targetProfitMargin
          }).then(response => {
            this.$modal.msgSuccess('设置成功')
            this.open = false
            this.getList()
          })
        }
      })
    },
    // 格式化金额
    formatMoney(value) {
      if (value == null || value === undefined) {
        return '0.00'
      }
      return parseFloat(value).toFixed(2)
    },
    // 获取利润率样式类
    getProfitMarginClass(value) {
      if (value >= 30) {
        return 'text-success'
      } else if (value >= 20) {
        return 'text-warning'
      } else {
        return 'text-danger'
      }
    },
    // 获取偏差样式类
    getDeviationClass(value) {
      if (value > 0) {
        return 'text-danger' // 正偏差（实际低于目标，平台赚得不够）
      } else if (value < 0) {
        return 'text-success' // 负偏差（实际高于目标，平台赚得太多）
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.text-success {
  color: #67c23a;
}
.text-danger {
  color: #f56c6c;
}
.text-warning {
  color: #e6a23c;
}
</style>

