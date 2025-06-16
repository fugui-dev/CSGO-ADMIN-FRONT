<template>
  <div class="home">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="红包ID" prop="parentId">
        <el-input
          v-model="queryParams.redPacketId"
          placeholder="请输入红包ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="领取人ID" prop="parentId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入领取人ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="领取口令" prop="id">
        <el-input
          v-model="queryParams.receivePassword"
          placeholder="请输入领取口令"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="id" label="红包记录ID	"></el-table-column>
      <el-table-column align="center" prop="title" label="红包标题"></el-table-column>
      <el-table-column align="center" prop="userId" label="领取人ID"></el-table-column>
      <el-table-column align="center" prop="nickName" label="	领取人昵称"></el-table-column>
      <el-table-column align="center" prop="receiveAmount" label="领取金额"></el-table-column>
      <el-table-column align="center" prop="receivePassword" label="领取口令" width="280px"></el-table-column>
      <el-table-column align="center" prop="receiveTime" label="领取时间"></el-table-column>
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
import { getRedPacketRecordList } from "@/api/skins/ttredPacket/api";
export default {
  name: "box",
  dicts: ["box_record_type"],

  data() {
    return {
      id: this.$route.query.id,
      tableData: [],
      typeData: [],
      showSearch: true,
      total: 1,
      loading: false,
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        redPacketId: this.$route.query.id
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetQuery() {
      this.queryParams = {
        pageSize: 10,
        pageNum: 1,
        redPacketId: null
      };
      this.getList();
    },
    handleQuery() {
      this.getList();
    },
    getList() {
      this.loading = true;
      getRedPacketRecordList(this.queryParams).then(res => {
        this.tableData = res.rows;
        this.loading = false;
        this.total = res.total;
      });
    }
  }
};
</script>
<style scoped lang="scss">
.home {
  padding: 20px;
}
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
</style>