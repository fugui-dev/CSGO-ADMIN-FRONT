<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="维护设置">
        <el-form ref="form" :model="form" label-width="200px" v-loading="loading">
          <el-form-item label="全站维护">
            <el-select v-model="form.websiteMaintenance" placeholder="请选择活动区域">
              <el-option label="正常" value="0"></el-option>
              <el-option label="维护" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商城维护">
            <el-select v-model="form.shoppingMaintenance" placeholder="请选择活动区域">
              <el-option label="正常" value="0"></el-option>
              <el-option label="维护" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="roll房维护">
            <el-select v-model="form.rollMaintenance" placeholder="请选择活动区域">
              <el-option label="正常" value="0"></el-option>
              <el-option label="维护" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="对战维护">
            <el-select v-model="form.fightMaintenance" placeholder="请选择活动区域">
              <el-option label="正常" value="0"></el-option>
              <el-option label="维护" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="汰换维护">
            <el-select v-model="form.compoundMaintenance" placeholder="请选择活动区域">
              <el-option label="正常" value="0"></el-option>
              <el-option label="维护" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开箱维护">
            <el-select v-model="form.bindBoxMaintenance" placeholder="请选择活动区域">
              <el-option label="正常" value="0"></el-option>
              <el-option label="维护" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  getParameterSetting,
  updateParameterSetting
} from "@/api/skins/ttSetting/api";
export default {
  data() {
    return {
      loading: false,
      form: {},
      datas: {},
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    resetForm() {
      this.formreset = this.form;
    },
    onSubmit() {
      this.$confirm("正在修改网站设置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          updateParameterSetting(this.form).then(res => {
            this.getList();
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    },
    getList() {
      this.loading = true;
      getParameterSetting(this.queryParams).then(res => {
        this.loading = false;
        this.form = res.data;
        this.datas = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>