<template>
  <div class="home">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" size="small">
      <el-form-item label="宝箱记录ID" prop="id">
        <el-input v-model="queryParams.id" placeholder="请输入宝箱记录ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="持有者ID" prop="holderUserId">
        <el-input v-model="queryParams.holderUserId" placeholder="请输入持有者ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="饰品ID" prop="ornamentsId">
        <el-input v-model="queryParams.ornamentsId" placeholder="请输入饰品ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="饰品名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入饰品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="宝箱状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.box_record_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="宝箱类型" prop="boxId">
        <el-select v-model="queryParams.boxId" placeholder="请选择" clearable>
          <el-option
            v-for="item in typeData"
            :key="item.boxId"
            :label="item.boxName"
            :value="item.boxId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="boxRecordId" label="宝箱记录ID"></el-table-column>
      <el-table-column align="center" prop="userId" label="开启者ID "></el-table-column>
      <el-table-column align="center" prop="holderUserId" label="持有者ID"></el-table-column>
      <el-table-column align="center" prop="boxId" label="宝箱ID"></el-table-column>
      <el-table-column align="center" prop="boxName" label="宝箱名称"></el-table-column>
      <el-table-column align="center" prop="boxPrice" label="宝箱价格"></el-table-column>
      <el-table-column align="center" prop="ornamentName" label="饰品名称"></el-table-column>
      <el-table-column align="center" label="饰品封面">
        <template slot-scope="scope">
          <image-preview :src="scope.row.ornamentImgUrl" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="ornamentsPrice" label="饰品价格"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == '0'" class="df">
            <span style="  background-color: #3c8dbc;" class="ds"></span>
            背包
          </div>
          <div v-if="scope.row.status == '1'" class="df">
            <span class="ds" style="background-color: #f39c12;"></span>
            已分解
          </div>
          <div v-if="scope.row.status == '2'" class="df">
            <span class="ds" style="background-color: #DD4B39;"></span>
            已提取
          </div>
          <div v-if="scope.row.status == '3'" class="df">
            <span class="ds" style="background-color: green;"></span>
            已汰换
          </div>
          <div v-if="scope.row.status == '4'" class="df">
            <span class="ds" style="background-color: #DD4B39;"></span>
            对战待分配
          </div>
          <div v-if="scope.row.status == '5'" class="df">
            <span class="ds" style="background-color: #DD4B39;"></span>
            已注入/分解/对战自动分解
          </div>
          <div v-if="scope.row.status == '8'" class="df">
            <span class="ds" style="background-color: #DD4B39;"></span>
            已投入汰换（熔炼）
          </div>

          <div v-if="scope.row.status == '6'" class="df">
            <span class="ds" style="background-color: #DD4B39;"></span>
            Roll房待分配
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
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
import { getBoxRecords, listBox } from "@/api/skins/ttBox/api";
export default {
  name: "box",
  dicts: ["box_record_type"],

  data() {
    return {
      tableData: [],
      typeData: [],
      showSearch: true,
      total: 1,
      loading: false,
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        boxId: null,
        holderUserId: null,
        itemName: null,
        ornamentsId: null,
        status: null,
        userId: null
      }
    };
  },
  created() {
    this.getList();
    this.getBoxType();
  },
  methods: {
    resetQuery() {
      this.queryParams = {
        pageSize: 10,
        pageNum: 1,
        boxId: null,
        holderUserId: null,
        itemName: null,
        ornamentsId: null,
        status: null,
        userId: null
      };
      this.getList();
    },
    handleQuery() {
      this.getList();
    },
    getList() {
      this.loading = true;
      getBoxRecords(this.queryParams).then(res => {
        this.tableData = res.rows;
        this.loading = false;
        this.total = res.total;
      });
    },
    getBoxType() {
      listBox(this.queryParams).then(res => {
        this.typeData = res.rows;
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
