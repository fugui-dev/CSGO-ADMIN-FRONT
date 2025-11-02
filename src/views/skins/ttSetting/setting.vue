<template>
  <div>
    <el-row type="flex" style="justify-content: space-between;">
      <el-col :span="11">
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="基础设置" name="first">
            <el-form ref="form" :model="form" label-width="200px">
              <el-form-item label="网站饰品价格溢价率">
                <el-input v-model="form.usePricePremiumRate	"></el-input>
                <span style="color: #737373;">
                  <i class="el-icon-info">1表示直接使用在售最低价显示</i>
                </span>
              </el-form-item>
              <el-form-item label="弹药价格比例">
                <el-input v-model="form.exchangePriceRatio"></el-input>
              </el-form-item>

              <el-form-item label="注册红包奖励金额">
                <el-input-number
                  v-model="form.registerRedPacket"
                  :precision="2"
                  :step="0.1"
                  :max="1000"
                ></el-input-number>
                <div style="color: #737373;">
                  <i class="el-icon-info">新用户注册红包奖励金额</i>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="汰换设置" name="second">
            <el-form ref="form" :model="form" label-width="200px">
              <el-form-item label="汰换价格区间最大值溢价率">
                <el-input v-model="form.compoundMaxPremiumRate"></el-input>
              </el-form-item>
              <el-form-item label="汰换价格区间最小值溢价率">
                <el-input v-model="form.compoundMinPremiumRate"></el-input>
              </el-form-item>
              <el-form-item label="汰换最低价">
                <el-input v-model="form.compoundMinPrice"></el-input>
              </el-form-item>
              <el-form-item label="最大汰换数量">
                <el-input v-model="form.maxCompoundNum"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="11">
        <el-tabs type="border-card" size="small">
          <el-tab-pane label="发货设置">
            <el-form ref="form" :model="form">
              <el-form-item label="当前发货渠道">
                <el-select placeholder="请选择发货渠道" v-model="pt">
                  <el-option label="CS2PIFA" value="7"></el-option>
                </el-select>
              </el-form-item>
              <div v-if="pt==7">
                <el-form-item label="CS2PIFA平台币种汇率">
                  <el-input v-model="form.CS2PIFAParities"></el-input>
                </el-form-item>
                <el-form-item label="CS2PIFA平台自动发货价格溢价率">
                  <el-input v-model="form.buyPricePremiumRate"></el-input>
                </el-form-item>
                <el-form-item label="CS2PIFA平台自动发货最低价">
                  <el-input v-model="form.autoDeliveryMinPrice"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row style="text-align: right;">
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-row>
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
      pt: 7,
      activeName: "first",
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
      // this.formreset = this.form;
      this.getList();
    },
    onSubmit() {
      this.$confirm("正在修改网站设置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
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
      getParameterSetting(this.queryParams).then(res => {
        this.form = res.data;
        this.datas = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
