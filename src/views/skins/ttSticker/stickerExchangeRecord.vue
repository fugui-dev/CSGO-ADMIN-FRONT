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
      <el-form-item label="奖励ID" prop="rewardId">
        <el-input
          v-model="queryParams.rewardId"
          placeholder="请输入奖励ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="奖励名称" prop="rewardName">
        <el-input
          v-model="queryParams.rewardName"
          placeholder="请输入奖励名称"
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
      <el-table-column label="奖励ID" align="center" prop="rewardId" width="120" />
      <el-table-column label="奖励名称" align="center" prop="rewardName" min-width="200" />
      <el-table-column label="使用的贴纸" align="center" prop="usedStickers" min-width="300">
        <template slot-scope="scope">
          <div v-if="scope.row.usedStickers">
            <el-tag
              v-for="(req, index) in parseStickerRequirement(scope.row.usedStickers)"
              :key="index"
              style="margin-right: 5px; margin-bottom: 5px"
            >
              {{ getStickerName(req.stickerCode) }} x{{ req.quantity }}
            </el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换时间" align="center" prop="exchangeTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.exchangeTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
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
import { listStickerExchangeRecord } from "@/api/skins/ttSticker/api";
import { listSticker } from "@/api/skins/ttSticker/api";

export default {
  name: "StickerExchangeRecord",
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
      // 贴纸列表（用于显示贴纸名称）
      stickerList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        rewardId: null,
        rewardName: null
      }
    };
  },
  created() {
    this.getStickerList();
    this.getList();
  },
  methods: {
    /** 查询贴纸列表 */
    getStickerList() {
      listSticker().then(response => {
        this.stickerList = response.rows || response.data || [];
      });
    },
    /** 查询记录列表 */
    getList() {
      this.loading = true;
      listStickerExchangeRecord(this.queryParams).then(response => {
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
    },
    /** 解析贴纸需求JSON */
    parseStickerRequirement(requirement) {
      if (!requirement) return [];
      try {
        return JSON.parse(requirement);
      } catch (e) {
        return [];
      }
    },
    /** 获取贴纸名称 */
    getStickerName(stickerCode) {
      const sticker = this.stickerList.find(s => s.stickerCode === stickerCode);
      return sticker ? sticker.stickerName : stickerCode;
    }
  }
};
</script>

