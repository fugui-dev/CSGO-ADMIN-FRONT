<template>
  <div class="home">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="ID" prop="userName">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户账号" prop="userName	">
        <el-input
          v-model="queryParams.userName	"
          placeholder="请输入用户账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="饰品名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入饰品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="dateRange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          size="mini"
          :loading="batchSyncLoading"
          @click="handleBatchSync"
        >一键同步当前页</el-button>
      </el-col>
    </el-row>
    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="id" label="Id" width="50"></el-table-column>
      <el-table-column align="center" prop="nickName" label="申请用户"></el-table-column>
      <el-table-column align="center" prop="itemName" label="饰品名称"></el-table-column>
      <el-table-column align="center" prop="address" label="饰品图片">
        <template slot align="center" scope="scope">
          <image-preview :src="scope.row.imageUrl" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="outTradeNo" label="网站订单号"></el-table-column>
      <el-table-column align="center" prop="orderId" label="第三方平台订单号" width="180"></el-table-column>
      <el-table-column align="center" prop="ornamentsPrice" label="饰品价格">
        <template slot-scope="scope">
          <span v-if="scope.row.ornamentsPrice">¥{{ scope.row.ornamentsPrice }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="buyPrice" label="实际购买价格	">
        <template slot-scope="scope">
          <span v-if="scope.row.buyPrice">¥{{ scope.row.buyPrice }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="delivery" label="发货方式">
        <template slot-scope="scope">
          <div
            v-if="scope.row.delivery == '1'"
            style="display:flex; align-items:center;justify-content:center;line-height: 1;"
          >
            <span
              style="width: 8px; height:8px; margin-right:5px;   border-radius: 50%;   background-color: #F39c12; display:inline-block;"
            ></span>
            人工发货
          </div>
          <div
            v-if="scope.row.delivery == '2'"
            style="display:flex; align-items:center;justify-content:center;"
          >
            <span
              style="width: 8px; height:8px; margin-right:5px;   border-radius: 50%;   background-color: #00a65a; display:inline-block;"
            ></span>
            自动发货
          </div>
          <div
            v-if="scope.row.delivery == '3'"
            style="display:flex; align-items:center;justify-content:center;"
          >
            <span
              style="width: 8px; height:8px; margin-right:5px;   border-radius: 50%;   background-color: #dc1e1e; display:inline-block;"
            ></span>
            主播虚拟
          </div>

        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <div
            v-if="scope.row.status == '1'"
            style="display:flex; align-items:center;justify-content:center;line-height: 1;"
          >
            <span
              style="width: 8px; height:8px; margin-right:5px;   border-radius: 50%;   background-color: green; display:inline-block;"
            ></span>
            待发货
          </div>
          <div
            v-if="scope.row.status == '3'"
            style="display:flex; align-items:center;justify-content:center;"
          >
            <span
              style="width: 8px; height:8px; margin-right:5px;   border-radius: 50%;   background-color: #696969; display:inline-block;"
            ></span>
            待收货
          </div>
          <div
            v-if="scope.row.status == '10'"
            style="display:flex; align-items:center;justify-content:center;"
          >
            <span
              style="width: 8px; height:8px; margin-right:5px;   border-radius: 50%;   background-color: #696969; display:inline-block;"
            ></span>
            订单完成
          </div>
          <div
            v-if="scope.row.status == '11'"
            style="display:flex; align-items:center;justify-content:center;"
          >
            订单取消
            <span
              style="width: 8px; height:8px; margin-left:5px;   border-radius: 50%;   background-color: #DD4b39; display:inline-block;"
            ></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="message" label="消息"></el-table-column>

      <el-table-column align="center" prop="updateTime" label="下单时间"></el-table-column>
      <el-table-column align="center" prop="address" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="handleSync(scope.row)">同步</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>
<script>
import {
  getDeliveryRecordList,
  synchronousStatus
} from "@/api/skins/ttdelivery/api";
export default {
  data() {
    return {
      ornamentsId: null,
      loading: false,
      batchSyncLoading: false, // 批量同步加载状态
      total: 1,
      showSearch: true,
      tableData: [],
      dateRange: null,
      queryParams: {
        outTradeNo: null,
        pageNum: 1,
        pageSize: 10,
        phoneNumber: null,
        userName: null,
        startTime: null,
        endTime: null
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleSync(res) {
      let aa = {
        outTradeNo: res.outTradeNo
      };
      synchronousStatus(aa).then(res => {
        this.getList();
      });
    },
    /** 一键同步当前页 */
    handleBatchSync() {
      if (!this.tableData || this.tableData.length === 0) {
        this.$modal.msgWarning("当前页没有数据");
        return;
      }
      
      this.$modal.confirm('确定要同步当前页的所有记录吗？').then(() => {
        this.batchSyncLoading = true;
        let successCount = 0;
        let failCount = 0;
        let totalCount = this.tableData.length;
        let completedCount = 0;
        
        // 逐个同步
        const syncPromises = this.tableData.map((row, index) => {
          return synchronousStatus({ outTradeNo: row.outTradeNo })
            .then(() => {
              successCount++;
              completedCount++;
            })
            .catch((error) => {
              failCount++;
              completedCount++;
              console.error(`同步订单 ${row.outTradeNo} 失败:`, error);
            });
        });
        
        // 等待所有同步完成
        Promise.all(syncPromises).then(() => {
          this.batchSyncLoading = false;
          let message = `同步完成！成功：${successCount}条，失败：${failCount}条，总计：${totalCount}条`;
          if (failCount === 0) {
            this.$modal.msgSuccess(message);
          } else {
            this.$modal.msgWarning(message);
          }
          // 刷新列表
          this.getList();
        }).catch(() => {
          this.batchSyncLoading = false;
          this.$modal.msgError("批量同步过程中发生错误");
        });
      }).catch(() => {
        // 用户取消
      });
    },
    resetQuery() {
      this.dateRange = null;
      this.queryParams = {
        outTradeNo: null,
        pageNum: 1,
        pageSize: 10,
        phoneNumber: null,
        userName: null,
        startTime: null,
        endTime: null
      };
      this.getList();
    },
    handleQuery() {
      this.getList();
    },
    getList() {
      this.loading = true;
      // 处理日期范围
      const params = { ...this.queryParams };
      if (this.dateRange && Array.isArray(this.dateRange) && this.dateRange.length === 2) {
        params.startTime = this.dateRange[0] + ' 00:00:00';
        params.endTime = this.dateRange[1] + ' 23:59:59';
      } else {
        params.startTime = null;
        params.endTime = null;
      }
      getDeliveryRecordList(params).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
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
