<template>
  <div class="home">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入用户手机号"
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
      <el-form-item label="网站订单号	" prop="outTradeNo	">
        <el-input
          v-model="queryParams.outTradeNo"
          placeholder="请输入网站订单号	"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      <el-table-column align="center" prop="ornamentName" label="饰品名称"></el-table-column>
      <el-table-column align="center" prop="address" label="饰品图片">
        <template slot align="center" scope="scope">
          <image-preview :src="scope.row.imageUrl" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="outTradeNo" label="订单号"></el-table-column>
      <el-table-column align="center" prop="ornamentsPrice" label="价格"></el-table-column>
      <el-table-column align="center" prop="createTime" label="下单时间"></el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="tradeBuy(scope.row)">查询</el-button>
          <el-button type="text" @click="handleReturn(scope.row)">退回申请</el-button>
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
    <el-dialog title="退回申请" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rule" ref="ruleForm">
        <el-form-item label="原因" prop="message">
          <el-input type="textarea" v-model="form.message" autocomplete="off" placeholder="填写退回原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  deliverGoodslist,
  tradeBuy,
  deliveryFail
} from "@/api/skins/ttdelivery/api";
export default {
  data() {
    return {
      rule: {
        message: [
          { required: true, message: "请输入退回申请的原因", trigger: "blur" },
          { min: 1, max: 20, message: "原因范围1~20", trigger: "blur" }
        ]
      },
      form: {},
      dialogFormVisible: false,
      total: 1,
      showSearch: true,
      loading: false,
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
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          deliveryFail(this.form).then(res => {
            this.dialogFormVisible = false;
            this.getList();
            this.$modal.msgSuccess("修改成功");
            this.form = {};
          });
        } else {
          return false;
        }
      });
    },
    handleReturn(res) {
      this.form.deliveryRecordId = res.id;
      this.dialogFormVisible = true;
    },
    tradeBuy(res) {
      // let aa = {
      //   deliveryRecordId: res.id,
      //   id: res.ornamentsId
      // };
      // tradeBuy(aa).then(res => {
      // });
      this.$router.push({
        path: "/delivery/zbtrecord",
        query: {
          id: res.ornamentId,
          t_id: res.id
        }
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
      deliverGoodslist(this.queryParams).then(res => {
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
