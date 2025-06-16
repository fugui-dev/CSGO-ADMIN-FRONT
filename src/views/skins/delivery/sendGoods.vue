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
          v-model="queryParams.startTime"
          format="yyyy 年 MM 月 dd 日"
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
      <el-table-column align="center" prop="buyPrice" label="实际购买价格	"></el-table-column>
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
      total: 1,
      showSearch: true,
      tableData: [],
      queryParams: {
        outTradeNo: null,
        pageNum: 1,
        pageSize: 10,
        phoneNumber: null,
        userName: null
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
    resetQuery() {
      this.queryParams = {
        outTradeNo: null,
        pageNum: 1,
        pageSize: 10,
        phoneNumber: null,
        userName: null
      };
      this.getList();
    },
    handleQuery() {
      this.getList();
    },
    getList() {
      this.loading = true;
      getDeliveryRecordList(this.queryParams).then(res => {
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
