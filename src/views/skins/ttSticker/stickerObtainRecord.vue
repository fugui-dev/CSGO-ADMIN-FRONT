<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="贴纸编码" prop="stickerCode">
        <el-input
          v-model="queryParams.stickerCode"
          placeholder="请输入贴纸编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="贴纸名称" prop="stickerName">
        <el-input
          v-model="queryParams.stickerName"
          placeholder="请输入贴纸名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="获得来源" prop="obtainSource">
        <el-input
          v-model="queryParams.obtainSource"
          placeholder="请输入获得来源"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="recordList" border>
      <el-table-column label="ID" align="center" prop="id" width="80" />
      <el-table-column label="用户ID" align="center" prop="userId" width="120" />
      <el-table-column label="贴纸ID" align="center" prop="stickerId" width="120" />
      <el-table-column label="贴纸编码" align="center" prop="stickerCode" width="120" />
      <el-table-column label="贴纸名称" align="center" prop="stickerName" min-width="150" />
      <el-table-column label="获取数量" align="center" prop="quantity" width="100" />
      <el-table-column label="获得来源" align="center" prop="obtainSource" min-width="200" />
      <el-table-column label="获得时间" align="center" prop="obtainTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.obtainTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
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
import { listStickerObtainRecord } from "@/api/skins/ttSticker/api";

export default {
  name: "StickerObtainRecord",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 记录列表
      recordList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        stickerId: null,
        stickerCode: null,
        stickerName: null,
        obtainSource: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询记录列表 */
    getList() {
      this.loading = true;
      listStickerObtainRecord(this.queryParams).then(response => {
        this.recordList = response.rows || response.data || [];
        this.total = response.total || 0;
        this.loading = false;
      }).catch(() => {
        this.recordList = [];
        this.total = 0;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>

