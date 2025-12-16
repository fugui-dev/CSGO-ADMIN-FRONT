<template>
  <div class="app-container">
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
      <el-form-item label="审核状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择审核状态" clearable>
          <el-option label="待审核" value="0" />
          <el-option label="已通过" value="1" />
          <el-option label="已拒绝" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="transferRecordList">
      <el-table-column label="饰品图片" align="center" width="120">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.imageUrl" :src="scope.row.imageUrl" :width="50" :height="50" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="饰品名称" align="center" prop="ornamentName" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.ornamentName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="饰品价格" align="center" prop="ornamentsPrice" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.ornamentsPrice || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="转增类型" align="center" prop="transferType" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.transferType === '转出'" type="danger">转出</el-tag>
          <el-tag v-else type="success">转入</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" prop="fromUserId" width="120" />
      <el-table-column label="用户名称" align="center" prop="fromUserName" />
      <el-table-column label="接收用户ID" align="center" prop="toUserId" width="120" />
      <el-table-column label="接收用户名称" align="center" prop="toUserName" />
      <el-table-column label="审核状态" align="center" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">已通过</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger">已拒绝</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.auditTime">{{ parseTime(scope.row.auditTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="审核备注" align="center" prop="auditRemark" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.auditRemark || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="转增时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 0"
            type="success"
            size="mini"
            icon="el-icon-check"
            @click="handleApprove(scope.row)"
          >通过</el-button>
          <el-button
            v-if="scope.row.status === 0"
            type="danger"
            size="mini"
            icon="el-icon-close"
            @click="handleReject(scope.row)"
          >拒绝</el-button>
          <span v-if="scope.row.status !== 0">-</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 审核对话框 -->
    <el-dialog
      :title="auditDialogTitle"
      :visible.sync="auditDialogVisible"
      width="500px"
      append-to-body
    >
      <el-form :model="auditForm" ref="auditForm" label-width="100px">
        <el-form-item label="审核备注">
          <el-input
            v-model="auditForm.auditRemark"
            type="textarea"
            :rows="4"
            placeholder="请输入审核备注（可选）"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAudit">确 定</el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getTransferRecordList, approveTransferRecord, rejectTransferRecord } from "@/api/skins/ttuser/api";

export default {
  name: "TransferRecord",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 转增记录表格数据
      transferRecordList: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        status: null,
        startTime: null,
        endTime: null
      },
      // 审核对话框
      auditDialogVisible: false,
      auditDialogTitle: "",
      auditForm: {
        id: null,
        auditRemark: "",
        type: "" // approve 或 reject
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询转增记录列表 */
    getList() {
      this.loading = true;
      const query = { ...this.queryParams };
      if (this.dateRange && this.dateRange.length === 2) {
        query.startTime = this.dateRange[0];
        query.endTime = this.dateRange[1];
      } else {
        query.startTime = null;
        query.endTime = null;
      }
      getTransferRecordList(query).then(response => {
        console.log('转增记录响应数据:', response);
        this.transferRecordList = response.rows || response.data || [];
        this.total = response.total || 0;
        this.loading = false;
      }).catch(error => {
        console.error('获取转增记录失败:', error);
        this.transferRecordList = [];
        this.total = 0;
        this.loading = false;
        this.$modal.msgError('获取转增记录失败');
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 审核通过 */
    handleApprove(row) {
      this.auditForm.id = row.transferRecordId;
      this.auditForm.type = "approve";
      this.auditForm.auditRemark = "";
      this.auditDialogTitle = "审核通过";
      this.auditDialogVisible = true;
    },
    /** 审核拒绝 */
    handleReject(row) {
      this.auditForm.id = row.transferRecordId;
      this.auditForm.type = "reject";
      this.auditForm.auditRemark = "";
      this.auditDialogTitle = "审核拒绝";
      this.auditDialogVisible = true;
    },
    /** 确认审核 */
    confirmAudit() {
      if (this.auditForm.type === "approve") {
        approveTransferRecord(this.auditForm.id, this.auditForm.auditRemark).then(response => {
          this.$modal.msgSuccess("审核通过成功");
          this.auditDialogVisible = false;
          this.getList();
        }).catch(error => {
          this.$modal.msgError(error.msg || "审核失败");
        });
      } else if (this.auditForm.type === "reject") {
        rejectTransferRecord(this.auditForm.id, this.auditForm.auditRemark).then(response => {
          this.$modal.msgSuccess("审核拒绝成功");
          this.auditDialogVisible = false;
          this.getList();
        }).catch(error => {
          this.$modal.msgError(error.msg || "审核失败");
        });
      }
    }
  }
};
</script>

