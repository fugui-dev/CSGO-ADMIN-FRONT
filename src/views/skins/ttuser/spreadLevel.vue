<template>
  <div style="width: 98%; margin:0 auto; margin-top:50px;">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="Id" width="100"></el-table-column>
      <el-table-column prop="nickName" label="称谓" width="100"></el-table-column>
      <el-table-column prop="lv" label="等级" width="100"></el-table-column>
      <el-table-column prop="Accumulated" label="下级累计充值" width="100"></el-table-column>
      <el-table-column prop="Rebate" label="返佣比例(%)" width="100"></el-table-column>
      <el-table-column prop="Registration" label="注册赠送" width="100"></el-table-column>
      <el-table-column prop="desc" label="描述"></el-table-column>
      <el-table-column prop="address" label="操作"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: 1,
          nickName: "LV1",
          lv: 1,
          Accumulated: 200.0,
          Rebate: 1.0,
          Registration: 0.0,
          desc: "	受邀用户累计充值200X币，玩家获得用户充值返佣1%"
        },
        {
          id: 2,
          nickName: "LV2",
          lv: 2,
          Accumulated: 1000.0,
          Rebate: 1.5,
          Registration: 0.0,
          desc: "	受邀用户累计充值1000X币，玩家获得用户充值返佣1.5%"
        },
        {
          id: 3,
          nickName: "LV3",
          lv: 3,
          Accumulated: 5000.0,
          Rebate: 2.0,
          Registration: 0.0,
          desc: "	受邀用户累计充值5000X币，玩家获得用户充值返佣2%"
        },
        {
          id: 4,
          nickName: "LV4",
          lv: 4,
          Accumulated: 10000.0,
          Rebate: 2.5,
          Registration: 0.0,
          desc: "	受邀用户累计充值10000X币，玩家获得用户充值返佣2.5%"
        },
        {
          id: 5,
          nickName: "LV5",
          lv: 5,
          Accumulated: 20000.0,
          Rebate: 3.0,
          Registration: 0.0,
          desc: "	受邀用户累计充值20000X币，玩家获得用户充值返佣3%"
        }
      ]
    };
  }
};
</script>