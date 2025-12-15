<template>
  <div class="home">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" style="margin-bottom: 20px;">
      <el-form-item label="用户ID">
        <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="记录日期">
        <el-date-picker
          v-model="queryParams.recordDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          style="width: 200px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="发放状态">
        <el-select v-model="queryParams.isDistributed" placeholder="请选择" clearable style="width: 150px">
          <el-option label="未发放" value="0"></el-option>
          <el-option label="已发放" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%" v-loading="loading" border>
      <el-table-column align="center" prop="id" label="ID" width="80"></el-table-column>
      <el-table-column align="center" prop="userId" label="用户ID" width="100"></el-table-column>
      <el-table-column align="center" prop="recordDate" label="记录日期" width="120"></el-table-column>
      <el-table-column align="center" prop="vipLevel" label="VIP等级" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.vipLevel > 0" type="success">VIP{{ scope.row.vipLevel }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="consumeSource" label="消费来源" width="120">
        <template slot-scope="scope">
          {{ scope.row.consumeSource || '-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="consumeAmount" label="消费金额" width="130">
        <template slot-scope="scope">
          <span style="color: #f56c6c; font-weight: bold;">{{ scope.row.consumeAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="rebateRate" label="返点比例" width="100">
        <template slot-scope="scope">
          {{ scope.row.rebateRate }}%
        </template>
      </el-table-column>
      <el-table-column align="center" prop="rebateAmount" label="返点金额" width="130">
        <template slot-scope="scope">
          <span style="color: #67c23a; font-weight: bold;">{{ scope.row.rebateAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="consumeTime" label="消费时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.consumeTime || '-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isDistributed" label="发放状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDistributed === 1" type="success">已发放</el-tag>
          <el-tag v-else type="warning">未发放</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="distributeTime" label="发放时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.distributeTime || '-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isDistributed === 0 && scope.row.rebateAmount > 0"
            type="text"
            size="small"
            @click="handleDistribute(scope.row)"
          >
            发放返点
          </el-button>
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
  </div>
</template>

<script>
import {
  getVipConsumeRebateRecord,
  distributeVipRebate
} from "@/api/skins/ttSetting/api";
import Pagination from "@/components/Pagination";

export default {
  name: "UserVipDailyRecord",
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      total: 0,
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        recordDate: null,
        isDistributed: null
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      getVipConsumeRebateRecord(this.queryParams).then(res => {
        this.tableData = res.rows || [];
        this.total = res.total || 0;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        recordDate: null,
        isDistributed: null
      };
      this.getList();
    },
    handleDistribute(row) {
      this.$modal.confirm('是否确认发放用户ID为"' + row.userId + '"的返点金额"' + row.rebateAmount + '"？').then(() => {
        return distributeVipRebate(row.id);
      }).then(() => {
        this.$modal.msgSuccess("发放成功");
        this.getList();
      }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
}
</style>
