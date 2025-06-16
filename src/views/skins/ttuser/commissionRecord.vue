<template>
  <div class="app-container">
      <el-select v-model="changeUser" placeholder="请选择主播" clearable>
        <el-option
          v-for="item in userList"
          :key="item.userId"
          :label="item.nickName"
          :value="item.userId"
          @click.native="loadCommissionRecord(item.userId)"
        >
          <span style="float: left">{{ item.nickName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.phoneNumber }}</span>
        </el-option>
      </el-select>

    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop="summaryTime" label="佣金日期" width="180" />
      <el-table-column prop="commission" label="佣金金额" />
      <el-table-column prop="operationBy" label="领取方式" />
      <el-table-column prop="claimStatus" label="领取状态">
        <template slot-scope="scope">
          <span v-if="scope.row.claimStatus === '0'">未领取</span>
          <span v-else-if="scope.row.claimStatus === '1'">已领取</span>
          <span v-else>未知类型</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="claimTime"
        label="领取时间"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-bank-card"
            :disabled="scope.row.claimStatus == '1'"
            @click="getCommission(scope.row.id)"
          >发放佣金</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getCommissionById, getCommissionList, listUser } from '@/api/skins/ttuser/api'

export default {
  name : 'commissionRecord',
  data() {
    return {
      changeUser: null,
      changeUserId: null,
      tableData: [],
      userList: [
        {
          userId: 1,
          nickName: "测试名称",
          phoneNumber: "123456789"
        }
      ]
    }
  },
  created() {
    //渲染主播用户下拉框
    let query = {
      userType : '01',
      pageSize : 500
    }
    listUser(query).then(rsp=>{
      // console.log("主播用户数据...", rsp)
      this.userList = rsp.rows;
    })


    this.getCommissionListData()
  },
  methods: {
    loadCommissionRecord(userId){
      this.changeUserId = userId;
      getCommissionList(this.changeUserId).then(response => {
        this.tableData = response.data
      })
    },
    getCommissionListData() {
      // getCommissionList().then(response => {
      //   this.tableData = response.data
      // })
    },
    getCommission(commissionId) {
      getCommissionById(commissionId).then(rsp => {
        if (rsp.code === 200) {
          this.$message.success(rsp.msg)
        }

        // 刷新列表
        getCommissionList(this.changeUserId).then(response => {
          this.tableData = response.data
        })
      })


    }
  }
}
</script>
