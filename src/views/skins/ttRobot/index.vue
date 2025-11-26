<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="机器人ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入机器人ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="空闲" :value="0" />
          <el-option label="使用中" :value="1" />
          <el-option label="已禁用" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="robotList">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="success">空闲</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="warning">使用中</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="info">已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="总开箱次数" align="center" prop="totalOpenBoxCount" />
      <el-table-column label="总对战次数" align="center" prop="totalFightCount" />
      <el-table-column label="最后使用时间" align="center" prop="lastUseTime" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.lastUseTime">{{ parseTime(scope.row.lastUseTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.createTime">{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
          >详情</el-button>
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

    <!-- 机器人详情对话框 -->
    <el-dialog title="机器人详情" :visible.sync="detailOpen" width="1200px" append-to-body>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="机器人ID">{{ robotDetail.robot && robotDetail.robot.id }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{ robotDetail.robot && robotDetail.robot.userId }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag v-if="robotDetail.robot && robotDetail.robot.status === 0" type="success">空闲</el-tag>
              <el-tag v-else-if="robotDetail.robot && robotDetail.robot.status === 1" type="warning">使用中</el-tag>
              <el-tag v-else-if="robotDetail.robot && robotDetail.robot.status === 2" type="info">已禁用</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="总开箱次数">{{ (robotDetail.robot && robotDetail.robot.totalOpenBoxCount) || 0 }}</el-descriptions-item>
            <el-descriptions-item label="总对战次数">{{ (robotDetail.robot && robotDetail.robot.totalFightCount) || 0 }}</el-descriptions-item>
            <el-descriptions-item label="最后使用时间">
              {{ robotDetail.robot && robotDetail.robot.lastUseTime ? parseTime(robotDetail.robot.lastUseTime, '{y}-{m}-{d} {h}:{i}:{s}') : '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ robotDetail.robot && robotDetail.robot.createTime ? parseTime(robotDetail.robot.createTime, '{y}-{m}-{d} {h}:{i}:{s}') : '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ robotDetail.robot && robotDetail.robot.updateTime ? parseTime(robotDetail.robot.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') : '-' }}
            </el-descriptions-item>
          </el-descriptions>
          <el-divider>用户信息</el-divider>
          <el-descriptions :column="2" border v-if="robotDetail.user">
            <el-descriptions-item label="用户昵称">{{ robotDetail.user.nickName }}</el-descriptions-item>
            <el-descriptions-item label="手机号码">{{ robotDetail.user.phoneNumber }}</el-descriptions-item>
            <el-descriptions-item label="金币余额">{{ robotDetail.user.accountAmount }}</el-descriptions-item>
            <el-descriptions-item label="弹药余额">{{ robotDetail.user.accountCredits }}</el-descriptions-item>
            <el-descriptions-item label="总充值">{{ robotDetail.user.totalRecharge }}</el-descriptions-item>
            <el-descriptions-item label="用户状态">
              <el-tag v-if="robotDetail.user.status === '0'" type="success">正常</el-tag>
              <el-tag v-else type="danger">停用</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="开箱记录" name="boxRecords">
          <el-table v-loading="boxRecordsLoading" :data="boxRecordsList" border>
            <el-table-column label="记录ID" align="center" prop="boxRecordId" width="100" />
            <el-table-column label="宝箱名称" align="center" prop="boxName" />
            <el-table-column label="宝箱价格" align="center" prop="boxPrice" />
            <el-table-column label="饰品名称" align="center" prop="ornamentName" />
            <el-table-column label="饰品价格" align="center" prop="ornamentsPrice" />
            <el-table-column label="状态" align="center" prop="status">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === '0' || scope.row.status === 0" type="success">在背包</el-tag>
                <el-tag v-else type="info">已分解</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.createTime">{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="boxRecordsTotal > 0"
            :total="boxRecordsTotal"
            :page.sync="boxRecordsQueryParams.pageNum"
            :limit.sync="boxRecordsQueryParams.pageSize"
            @pagination="handleBoxRecordsPagination"
          />
        </el-tab-pane>
        <el-tab-pane label="对战记录" name="fights">
          <el-table v-loading="fightsLoading" :data="fightsList" border>
            <el-table-column label="对战ID" align="center" prop="id" width="100" />
            <el-table-column label="房间总值" align="center" prop="boxPriceTotal" />
            <el-table-column label="玩家数量" align="center" prop="playerNum" />
            <el-table-column label="状态" align="center" prop="status">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 0" type="info">等待中</el-tag>
                <el-tag v-else-if="scope.row.status === 1" type="warning">进行中</el-tag>
                <el-tag v-else-if="scope.row.status === 2" type="success">已结束</el-tag>
                <el-tag v-else-if="scope.row.status === 3" type="danger">已取消</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.createTime">{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" prop="endTime" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.endTime">{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="fightsTotal > 0"
            :total="fightsTotal"
            :page.sync="fightsQueryParams.pageNum"
            :limit.sync="fightsQueryParams.pageSize"
            @pagination="handleFightsPagination"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { listRobot, getRobot, getRobotBoxRecords, getRobotFights } from '@/api/skins/ttRobot/api'

export default {
  name: 'Robot',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 机器人表格数据
      robotList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        userId: null,
        status: null
      },
      // 详情对话框
      detailOpen: false,
      activeTab: 'info',
      currentRobotId: null,
      robotDetail: {
        robot: {},
        user: {}
      },
      // 开箱记录
      boxRecordsLoading: false,
      boxRecordsList: [],
      boxRecordsTotal: 0,
      boxRecordsQueryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 对战记录
      fightsLoading: false,
      fightsList: [],
      fightsTotal: 0,
      fightsQueryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询机器人列表 */
    getList() {
      this.loading = true
      listRobot(this.queryParams).then(response => {
        this.robotList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 查看详情 */
    handleDetail(row) {
      this.detailOpen = true
      this.activeTab = 'info'
      this.currentRobotId = row.id
      
      // 获取机器人详情
      getRobot(this.currentRobotId).then(response => {
        this.robotDetail = response.data || { robot: {}, user: {} }
      })
      
      // 重置分页并获取开箱记录
      this.boxRecordsQueryParams.pageNum = 1
      this.getBoxRecords(this.currentRobotId)
      
      // 重置分页并获取对战记录
      this.fightsQueryParams.pageNum = 1
      this.getFights(this.currentRobotId)
    },
    /** 获取开箱记录 */
    getBoxRecords(robotId) {
      this.boxRecordsLoading = true
      getRobotBoxRecords(robotId, this.boxRecordsQueryParams).then(response => {
        this.boxRecordsList = response.rows || []
        this.boxRecordsTotal = response.total || 0
        this.boxRecordsLoading = false
      }).catch(() => {
        this.boxRecordsLoading = false
      })
    },
    /** 获取对战记录 */
    getFights(robotId) {
      this.fightsLoading = true
      getRobotFights(robotId, this.fightsQueryParams).then(response => {
        this.fightsList = response.rows || []
        this.fightsTotal = response.total || 0
        this.fightsLoading = false
      }).catch(() => {
        this.fightsLoading = false
      })
    },
    /** 开箱记录分页事件 */
    handleBoxRecordsPagination() {
      if (this.currentRobotId) {
        this.getBoxRecords(this.currentRobotId)
      }
    },
    /** 对战记录分页事件 */
    handleFightsPagination() {
      if (this.currentRobotId) {
        this.getFights(this.currentRobotId)
      }
    }
  }
}
</script>

