<template>
  <div class="home">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" size="small">
      <el-form-item label="对战ID">
        <el-input v-model="queryParams.id" placeholder="请输入对战ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建用户ID">
        <el-input v-model="queryParams.userId" placeholder="请输入创建用户ID查询	" clearable></el-input>
      </el-form-item>
      <el-form-item label="对战状态">
        <el-select v-model="queryParams.status" placeholder="请选择对战状态" clearable>
          <el-option label="等待中" value="0"></el-option>
          <el-option label="已结束" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="id" label="对战ID"></el-table-column>
      <el-table-column align="center" prop="userId" label="创建者ID"></el-table-column>
      <el-table-column align="center" label="宝箱" width="180">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-link"
            type="text"
            @click="handleOpen(scope.row)"
            class="under"
          >{{scope.row.num}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="boxPriceTotal" label="创建宝箱价格总数" width="180"></el-table-column>
      <el-table-column align="center" prop="model" label="对战模式">
        <template slot-scope="scope">
          <div v-if="scope.row.model == '0'">欧皇模式</div>
          <div v-if="scope.row.model == '1'">非酋模式</div>
          <div v-if="scope.row.model == '2'">组队模式</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="playerNum" label="对战人数"></el-table-column>
      <el-table-column
        align="left"
        prop="status"
        label="对战状态"
        width="200"
        style="padding-left: 305px !important;"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.status == '0'" class="df">
            <span style=" background-color: #00a65a;" class="ds"></span>
            等待中
          </div>
          <div v-if="scope.row.status == '2'" class="df">
            <span class="ds" style="background-color: #dd4b39;"></span>
            已结束
            <el-button type="text" @click="handleView(scope.row)" style="margin-left: 45px;">查看结果</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />
    <el-dialog title="对战宝箱" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column align="center" property="boxId" label="宝箱ID	"></el-table-column>
        <el-table-column align="center" property="boxImg01" label="宝箱图片1">
          <template slot-scope="scope">
            <img :src="scope.row.boxImg01" alt width="50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" property="boxImg02" label="宝箱图片2">
          <template slot-scope="scope">
            <img :src="scope.row.boxImg02" alt width="50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" property="boxName" label="宝箱名称"></el-table-column>
        <el-table-column align="center" property="price" label="宝箱开启价格"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFightlist,
  getFightBoxList,
  getFightResult
} from "@/api/skins/ttFight/api";

export default {
  data() {
    return {
      total: 1,
      loading: false,
      dialogTableVisible: false,
      tableData: [],
      gridData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        status: null,
        userId: null
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleOpen(res) {
      this.dialogTableVisible = true;
      getFightBoxList(res.id).then(res => {
        this.gridData = res.rows;
      });
    },
    handleView(res) {
      this.$router.push({
        path: "/ttFight/fightResult",
        query: {
          id: res.id
        }
      });
    },
    onSubmit() {
      this.getList();
    },
    getList() {
      this.loading = true;
      getFightlist(this.queryParams).then(res => {
        this.total = res.total;
        this.loading = false;
        res.rows.num = 0;
        res.rows.forEach(element => {
          element.boxData = Object.values(element.boxData);
          element.num = 0;
          element.boxData.forEach(index => {
            element.num += Number(index.number);
          });
        });
        this.tableData = res.rows;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
}
::v-deep.under {
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
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