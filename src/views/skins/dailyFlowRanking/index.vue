<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 18px; font-weight: bold;">日用户流水排行榜</span>
        <div style="float: right;">
          <el-date-picker
            v-model="statDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            size="small"
            style="width: 180px; margin-right: 10px;"
            @change="handleDateChange"
          ></el-date-picker>
          <el-button
            icon="el-icon-refresh"
            plain
            size="mini"
            type="primary"
            @click="refreshList"
            style="margin-right: 10px;"
          >刷新</el-button>
          <el-button
            icon="el-icon-cpu"
            plain
            size="mini"
            type="success"
            @click="handleStatistics"
            style="margin-right: 10px;"
          >手动统计</el-button>
          <el-button
            icon="el-icon-money"
            plain
            size="mini"
            type="warning"
            @click="handleDistributeRewards"
          >手动发放奖励</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="rankingList" border style="width: 100%">
        <el-table-column align="center" label="排名" prop="rank" width="80" />
        <el-table-column align="center" label="用户ID" prop="userId" width="100" />
        <el-table-column align="center" label="用户名" prop="userName" width="150" />
        <el-table-column align="center" label="昵称" prop="nickName" width="150" />
        <el-table-column align="center" label="充值金额" prop="rechargeAmount" width="120">
          <template slot-scope="scope">
            {{ formatAmount(scope.row.rechargeAmount) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="消费金额" prop="consumeAmount" width="120">
          <template slot-scope="scope">
            {{ formatAmount(scope.row.consumeAmount) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总流水" prop="totalFlow" width="120">
          <template slot-scope="scope">
            <span style="color: #409EFF; font-weight: bold;">
              {{ formatAmount(scope.row.totalFlow) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖励金额" prop="rewardAmount" width="120">
          <template slot-scope="scope">
            {{ formatAmount(scope.row.rewardAmount) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖励状态" prop="isRewardSent" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isRewardSent ? 'success' : 'warning'">
              {{ scope.row.isRewardSent ? '已发放' : '未发放' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发放时间" prop="rewardSentTime" width="180">
          <template slot-scope="scope">
            {{ scope.row.rewardSentTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="统计日期" prop="statDate" width="120" />
      </el-table>

      <div style="margin-top: 20px; color: #909399; font-size: 12px;">
        <p>说明：</p>
        <p>1. 每日流水门槛为3000，只有达到门槛的用户才能上榜</p>
        <p>2. 排行榜显示前100名，按总流水从高到低排序</p>
        <p>3. 每日0:00自动统计前一天的流水数据</p>
        <p>4. 每日0:30自动根据排名发放奖励</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getDailyFlowRankingList,
  triggerStatistics,
  triggerDistributeRewards
} from "@/api/skins/dailyFlowRanking/api";

export default {
  name: "DailyFlowRanking",
  data() {
    return {
      loading: false,
      rankingList: [],
      statDate: this.getTodayDate() // 默认显示今天
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询排行榜列表 */
    getList() {
      this.loading = true;
      getDailyFlowRankingList(this.statDate)
        .then(res => {
          if (res.code === 200) {
            this.rankingList = res.data || [];
          } else {
            this.$modal.msgError(res.msg || "获取排行榜列表失败");
          }
        })
        .catch(() => {
          this.$modal.msgError("获取排行榜列表失败");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 刷新列表 */
    refreshList() {
      this.getList();
    },
    /** 日期改变 */
    handleDateChange() {
      this.getList();
    },
    /** 手动触发统计 */
    handleStatistics() {
      this.$modal.confirm('是否确认手动触发统计？将统计指定日期的流水数据。').then(() => {
        return triggerStatistics(this.statDate);
      }).then(res => {
        if (res.code === 200) {
          this.$modal.msgSuccess("统计完成");
          this.getList();
        } else {
          this.$modal.msgError(res.msg || "统计失败");
        }
      }).catch(() => {});
    },
    /** 手动触发发放奖励 */
    handleDistributeRewards() {
      this.$modal.confirm('是否确认手动触发发放奖励？将为指定日期的排行榜发放奖励。').then(() => {
        return triggerDistributeRewards(this.statDate);
      }).then(res => {
        if (res.code === 200) {
          this.$modal.msgSuccess("奖励发放完成");
          this.getList();
        } else {
          this.$modal.msgError(res.msg || "奖励发放失败");
        }
      }).catch(() => {});
    },
    /** 格式化金额 */
    formatAmount(amount) {
      if (amount == null) return '0.00';
      return parseFloat(amount).toFixed(2);
    },
    /** 获取今天的日期字符串 */
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.box-card {
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
}
</style>

