<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" :model="queryParams" label-width="68px" size="small">
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          clearable
          placeholder="请输入登录地址"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          clearable
          placeholder="请输入用户名称"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="list.slice((pageNum-1)*pageSize,pageNum*pageSize)"
      style="width: 100%;"
    >
      <el-table-column align="center" label="序号" type="index">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会话编号" prop="token"/>
      <el-table-column :show-overflow-tooltip="true" align="center" label="用户昵称" prop="nickName"/>
      <el-table-column :show-overflow-tooltip="true" align="center" label="用户账号" prop="userName"/>
      <el-table-column :show-overflow-tooltip="true" align="center" label="主机" prop="ipaddr"/>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        label="登录地点"
        prop="loginLocation"
      />
      <el-table-column align="center" label="浏览器" prop="browser"/>
      <el-table-column align="center" label="操作系统" prop="os"/>
      <el-table-column align="center" label="登录时间" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
    />
  </div>
</template>
<script>
import {listUser_Online} from "@/api/skins/ttuser/api";

export default {
  data() {
    return {
      loading: true,
      total: 0,
      list: [],
      pageNum: 1,
      pageSize: 10,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        ipaddr: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;

      listUser_Online(this.queryParams).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
