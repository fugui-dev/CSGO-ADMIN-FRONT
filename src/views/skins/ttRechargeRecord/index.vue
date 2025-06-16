<template>
  <div class="home">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主播ID" prop="parentId">
        <el-select v-model="queryParams.parentId" filterable placeholder="请选择主播" clearable>
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          >
            <span style="float: left">{{ item.nickName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付类型" prop="channelType">
        <el-select v-model="queryParams.channelType">
          <el-option label="卡密" value="0"></el-option>
          <el-option label="支付宝" value="1"></el-option>
          <el-option label="微信" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否虚拟" prop="anchorVirtual">
        <el-select v-model="queryParams.anchorVirtual">
          <el-option label="主播虚拟" value="1"></el-option>
          <el-option label="真实充值" value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="订单号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="外部订单号" prop="outTradeNo">
        <el-input
          v-model="queryParams.outTradeNo"
          placeholder="请输入外部订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="选择时间范围" prop="startTime">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="queryParams.time"
          type="datetimerange"
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
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="id" label="id"></el-table-column>
      <el-table-column align="center" prop="userId" label="用户ID" width="80"></el-table-column>
      <el-table-column align="center" prop="amountActuallyPaid" label="实际支付金额(RMB)"></el-table-column>
      <el-table-column align="center" prop="arrivalAmount" label="到账金额"></el-table-column>
      <el-table-column align="center" prop="orderId" label="订单号"></el-table-column>
      <el-table-column align="center" prop="outTradeNo" label="外部订单号"></el-table-column>
      <el-table-column align="center" prop="anchorVirtual" label="主播虚充">
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.anchorVirtual == 1">虚拟</div>
            <div v-if="scope.row.anchorVirtual == 0">真实</div>
            <div v-if="scope.row.anchorVirtual == null">真实</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="channelType" label="支付类型">
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.channelType == '1'">支付宝</div>
            <div v-if="scope.row.channelType == '0'">卡密</div>
            <div v-if="scope.row.channelType == '2'">微信</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="parentId" label="主播ID"></el-table-column>
      <el-table-column align="center" label="支付状态">
        <template slot-scope="scope">
          <div
            v-if="scope.row.status == '0'"
            style="display:flex; align-items:center;justify-content:center;line-height: 1;"
          >
            <span
              style="width: 8px; height:8px; margin-right:10px;   border-radius: 50%;   background-color: #90ee90; display:inline-block;"
            ></span>
            支付成功
          </div>
          <div v-else style="display:flex; align-items:center;justify-content:center;">
            <span
              style="width: 8px; height:8px; margin-right:10px;   border-radius: 50%;   background-color: #DD4B39; display:inline-block;"
            ></span>
            未付款
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
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
import { rechargeRecord } from "@/api/skins/ttRecharge/api";
import { listUser } from "@/api/skins/ttuser/api";

export default {
  data() {
    return {
      types: {
        userType: "01",
        pageSize: 99
      },
      total: 1,
      loading: false,
      tableData: [],
      userList: [],
      queryParams: {
        anchorVirtual: null,
        pageNum: 1,
        pageSize: 10,
        orderId: null,
        outTradeNo: null,
        parentId: null,
        startTime: null,
        endTime: null,
        userId: null,
        time: []
      }
    };
  },
  mounted() {
    this.getList();
    this.getUser();
  },
  methods: {
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        orderId: null,
        outTradeNo: null,
        parentId: null,
        startTime: null,
        endTime: null,
        userId: null,
        time: []
      };
      this.getList();
    },
    handleQuery() {
      this.queryParams.startTime = this.queryParams.time[0];
      this.queryParams.endTime = this.queryParams.time[1];
      this.getList();
    },
    getUser() {
      listUser(this.types).then(res => {
        this.userList = res.rows;
      });
      rollJackpotList().then(res => {
        this.JackpotList = res.rows;
      });
    },
    getList() {
      this.loading = true;
      rechargeRecord(this.queryParams).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
}
</style>
