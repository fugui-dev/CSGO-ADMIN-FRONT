<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="等级" width="180"></el-table-column>
      <el-table-column prop="name" label="累充门槛" width="180"></el-table-column>
      <el-table-column prop="name" label="充返比率(%)" width="180"></el-table-column>
      <el-table-column prop="name" label="奖励红包" width="180"></el-table-column>
      <el-table-column prop="name" label="描述" width="180"></el-table-column>
      <el-table-column prop="name" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="name" label="更新时间" width="180"></el-table-column>
      <el-table-column prop="address" label="操作"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>