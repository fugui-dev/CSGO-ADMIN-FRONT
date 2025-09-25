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
        <el-button 
          v-if="queryParams.parentId" 
          type="success" 
          icon="el-icon-key" 
          size="mini" 
          @click="generateCardPassword"
        >
          生成卡密
        </el-button>
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
import { generateCardInfo, createGenerateCard } from "@/api/skins/ttGenerateCard/api";
import { getInfo } from "@/api/login";

export default {
  data() {
    return {
      types: {
        userType: "01",
        pageSize: 1000
      },
      total: 1,
      loading: false,
      tableData: [],
      userList: [],
      isSystemOperation: false, // 是否为system-operation角色
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
    this.checkUserRole();
    this.getList();
    // 延迟获取用户列表，确保用户信息已加载
    this.$nextTick(() => {
      this.getUser();
    });
  },
  methods: {
    // 检查用户角色
    checkUserRole() {
      const roles = this.$store.getters.roles;
      // 角色是字符串数组，直接检查是否包含'system-operation'
      this.isSystemOperation = roles && roles.includes('system-operation');
      console.log('用户角色:', roles);
      console.log('是否为system-operation:', this.isSystemOperation);
    },
    
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
      const queryParams = { ...this.types };
      
      // 如果是system-operation角色，添加parentId参数
      if (this.isSystemOperation) {
        // 调用/getInfo接口获取用户信息
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
          
          console.log('查询主播列表参数:', queryParams);
          listUser(queryParams).then(res => {
            this.userList = res.rows;
            console.log('获取到的主播列表:', res.rows);
          });
        }).catch(error => {
          console.error('获取用户信息失败:', error);
          // 如果获取用户信息失败，仍然调用listUser但不添加parentId
          listUser(queryParams).then(res => {
            this.userList = res.rows;
            console.log('获取到的主播列表:', res.rows);
          });
        });
      } else {
        // 非system-operation角色，直接调用listUser
        console.log('查询主播列表参数:', queryParams);
        listUser(queryParams).then(res => {
          this.userList = res.rows;
          console.log('获取到的主播列表:', res.rows);
        });
      }
    },
    getList() {
      this.loading = true;
      
      const queryParams = { ...this.queryParams };
      
      // 如果是system-operation角色且主播列表不为空，添加parentList参数
      if (this.isSystemOperation && this.userList.length > 0) {
        queryParams.parentList = this.userList.map(item => item.userId);
        console.log('添加parentList参数:', queryParams.parentList);
      } else if (this.isSystemOperation && this.userList.length === 0) {
        console.log('主播列表为空，不查询充值记录');
        this.tableData = [];
        this.total = 0;
        this.loading = false;
        return;
      }
      
      console.log('查询充值记录参数:', queryParams);
      rechargeRecord(queryParams).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
        console.log('获取到的充值记录:', res.rows);
      });
    },
    generateCardPassword() {
      if (!this.queryParams.parentId) {
        this.$modal.msgWarning("请先选择主播！");
        return;
      }
      
      // 先获取卡密信息
      const data = {
        userId: this.queryParams.parentId
      };
      
      generateCardInfo(data).then(res => {
        if (res.success) {
          const cardInfo = res.data;
          if (cardInfo) {
            // 显示卡密信息确认弹框
            this.$confirm(
              `充值总额：${cardInfo.rechargeTotal}元\n价格：${cardInfo.price}元\n\n确认要生成卡密吗？`,
              '卡密信息确认',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
              }
            ).then(() => {
              // 用户点击确定，调用创建卡密接口
              this.createCard(cardInfo);
            }).catch(() => {
              this.$modal.msgInfo("已取消生成卡密");
            });
          } else {
            this.$modal.msgError("获取卡密信息失败！");
          }
        } else {
          this.$modal.msgError(res.errMessage || "获取卡密信息失败！");
        }
      }).catch(error => {
        this.$modal.msgError("获取卡密信息失败：" + error.message);
      });
    },
    
    createCard(cardInfo) {
      const data = {
        userId: this.queryParams.parentId
      };
      
      createGenerateCard(data).then(res => {
        if (res.success) {
          this.$modal.msgSuccess("卡密生成成功！");
          console.log("卡密生成结果：", res.data);
        } else {
          this.$modal.msgError(res.errMessage || "生成卡密失败！");
        }
      }).catch(error => {
        this.$modal.msgError("生成卡密失败：" + error.message);
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
