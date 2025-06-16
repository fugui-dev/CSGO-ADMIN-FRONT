<template>
  <div class="home">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable />
      </el-form-item>
<!--      <el-form-item label="用户昵称" prop="nickName">-->
<!--        <el-input v-model="queryParams.nickName" placeholder="请输入用户昵称" clearable />-->
<!--      </el-form-item>-->
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input v-model="queryParams.phoneNumber" placeholder="请输入手机号码" clearable />
      </el-form-item>
      <el-form-item label="变动场景">
        <el-select v-model="queryParams.source" placeholder="请选择变动场景" clearable>
          <el-option
            v-for="dict in dict.type.user_credits_records"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="变动类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择变动类型" clearable>
          <el-option label="支出" value="0" />
          <el-option label="收入" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="id" label="弹药流水记录ID"></el-table-column>
      <el-table-column align="center" prop="userId" label="用户ID	"></el-table-column>
      <el-table-column align="center" prop="credits" label="变动弹药		"></el-table-column>
      <el-table-column align="center" prop="finalCredits" label="最终弹药		"></el-table-column>
      <el-table-column align="center" prop="type" label="变动类型">
        <template slot-scope="scope">
          <div v-if="scope.row.type==0" class="df">
            <span class="ds" style="background-color:#f3c192;"></span>支出
          </div>
          <div v-if="scope.row.type==1" class="df">
            <span class="ds" style="background-color:#dd4b39;"></span>收入
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="remark" label="变动来源"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间	"></el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { userCreditsRecords } from "@/api/skins/ttuser/api";
import { getUserBlendErcash } from "@/api/skins/ttUserBlendErcash/api";
export default {
  dicts: ["user_credits_records"],

  data() {
    return {
      loading: false,
      showSearch: true,
      total: 1,
      tableData: [],
      queryParams: {
        page: 1,
        size: 10,
        nickName: null,
        phoneNumber: null,
        source: null,
        type: null,
        userId: null,
        moneyType: 2
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    resetQuery() {
      this.queryParams = {
        page: 1,
        size: 10,
        nickName: null,
        phoneNumber: null,
        source: null,
        type: null,
        userId: null,
        moneyType: 2
      };
      this.getList();
    },
    handleQuery() {
      this.getList();
    },
    getList() {
      this.loading = true;
      // userCreditsRecords(this.queryParams).then(res => {
      //   this.loading = false;
      //   this.tableData = res.rows;
      //   this.total = res.total;
      // });
      getUserBlendErcash(this.queryParams).then(res => {
        this.loading = false;
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
}
.ds {
  width: 8px;
  height: 8px;
  margin-right: 10px;
  border-radius: 50%;
  display: inline-block;
}
.df {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
