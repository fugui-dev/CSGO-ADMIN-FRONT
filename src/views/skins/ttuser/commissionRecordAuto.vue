<template>
  <div class="app-container">
    <div class="dashboard-editor-container" style="margin-bottom: 1vh">

      <el-form>
        <el-form-item label="请选择主播">

          <el-select v-model="changeUser" placeholder="请选择主播" clearable>
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
              @click.native="getPromotionDataInfo(item.userId)"
            >
              <span style="float: left">{{ item.nickName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.phoneNumber }}</span>
            </el-option>
          </el-select>

        </el-form-item>
      </el-form>
      <PanelGroupV1 ref="lineDataComponent"/>
    </div>


    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">

      <el-form-item label="时间明细" prop="dayTime">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="queryParams.dayTime"
          type="date"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeTime"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        单日充值：<span style="margin-right: 3vw; color: red">{{selectTotalRecharge}}</span>
        单日消费总计：<span style="margin-right: 3vw; color: red">{{selectTotalConsume}}</span>
      </el-form-item>
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
    </el-form>


    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="nickName" label="昵称" />
      <el-table-column prop="recharge" label="充值" />
      <el-table-column prop="beConsume" label="消费" />
    </el-table>
  </div>
</template>

<script>
import { listUser, teamDetailsList } from '@/api/skins/ttuser/api'
import PanelGroupV1 from '@/views/skins/ttuser/component/PanelGroupV1.vue'

export default {
  name : 'commissionRecord',
  components: { PanelGroupV1},
  data() {
    return {
      selectTotalRecharge: 0,
      selectTotalConsume: 0,
      queryParams:{
        dayTime:null
      },
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
      // commissionRate: 1,
      pageSize : 500
    }
    listUser(query).then(rsp=>{
      // console.log("主播用户数据...", rsp)
      this.userList = rsp.rows;
    })

    this.queryParams.dayTime = this.dateToString(new Date())

  },
  methods: {
    //加载子组件的数据
    loadLineData(){
      this.$refs.lineDataComponent.getCountData(this.changeUserId);
    },

    getPromotionDataInfo(userId){
      this.changeUserId = userId;

      //加载列表数据
      this.getList()

      //加载汇总数据
      this.loadLineData(userId);
    },


    //改变时间范围方法
    changeTime(){
      if (this.changeUserId == null){
        this.$modal.msgWarning("请先选择要查看的主播！");
        return;
      }

      this.getList();
    },


    //加载列表方法
    getList(){
      let param = {
        parentId : this.changeUserId,
        beginTime : this.queryParams.dayTime + ' 00:00:00',
        endTime : this.queryParams.dayTime + ' 23:59:59',
        pageSize : 1000,
        pageNum : 1,
      }
      console.log('请求列表参数...', param)
      teamDetailsList(param).then(response => {
        this.tableData = response.data.details;
        this.selectTotalRecharge = response.data.selectTotalRecharge;
        this.selectTotalConsume = response.data.selectTotalConsume;
      })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.pageNum = 1;
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
    },

    dateToString (date){
      var  year = date.getFullYear();
      var  month =(date.getMonth() + 1).toString();
      var  day = (date.getDate()).toString();
      if  (month.length == 1) {
        month =  "0"  + month;
      }
      if  (day.length == 1) {
        day =  "0"  + day;
      }
      var  dateTime = year +  "-"  + month +  "-"  + day;
      return  dateTime;
    },



}
}
</script>

<style scoped lang="scss">
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
