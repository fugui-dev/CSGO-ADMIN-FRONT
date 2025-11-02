<template>
  <div class="home">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="网站维护管理" name="first">
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
              <div style="margin-top:10px;">
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">保存</el-button>
                  <el-button @click="hanleReset">重置</el-button>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="网站设置" name="second">
        <div>
          <el-row type="flex" style="justify-content: space-between;">
            <el-col :span="11">
              <el-tabs type="border-card" v-model="settingactiveName">
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

                    <el-form-item label="实名福利金币">
                      <el-input-number
                        v-model="form.registerRedPacket"
                        :precision="2"
                        :step="0.1"
                        :max="1000"
                      ></el-input-number>
                      <div style="color: #737373;">
                        <i class="el-icon-info">新用户实名红包奖励金额</i>
                      </div>
                    </el-form-item>
                    <el-form-item label="实名福利弹药">
                      <el-input-number
                        v-model="form.registerRedPacket"
                        :precision="2"
                        :step="0.1"
                        :max="1000"
                      ></el-input-number>
                      <div style="color: #737373;">
                        <i class="el-icon-info">新用户实名红包奖励弹药</i>
                      </div>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="汰换设置" name="second">
                  <el-form ref="form" :model="form" label-width="200px">
                    <el-form-item label="汰换价格区间最大值溢价率">
                      <el-input v-model="form.compoundMaxPremiumRate"></el-input>
                      <div style="color: #737373;">
                        <i class="el-icon-info">单位：% 例:5% 即为用户所选饰品价格的5%</i>
                      </div>
                    </el-form-item>
                    <el-form-item label="汰换价格区间最小值溢价率">
                      <el-input v-model="form.compoundMinPremiumRate"></el-input>
                      <div style="color: #737373;">
                        <i class="el-icon-info">单位：% 例:5% 即为用户所选饰品价格的5%</i>
                      </div>
                    </el-form-item>
                    <el-form-item label="汰换最低价">
                      <el-input v-model="form.compoundMinPrice"></el-input>
                      <div style="color: #737373;">
                        <i class="el-icon-info">用户选择汰换物品最低价</i>
                      </div>
                    </el-form-item>
                    <el-form-item label="最大汰换数量">
                      <el-input v-model="form.maxCompoundNum"></el-input>
                      <div style="color: #737373;">
                        <i class="el-icon-info">用户选择汰换物品最大数量</i>
                      </div>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </el-col>
            <el-col :span="11">
              <div v-if="mainteanaceactiveName=='first'">
                <el-tabs type="border-card" size="small">
                  <el-tab-pane label="发货设置">
                    <el-form ref="form" :model="form">
                      <el-form-item label="当前发货渠道">
                        <el-select placeholder="请选择发货渠道" v-model="pt">
                          <el-option label="CS2PIFA" value="7"></el-option>
                        </el-select>
                        <div style="color: #737373;">
                          <i class="el-icon-info">表示当前平台选择的发货渠道</i>
                        </div>
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
              </div>
            </el-col>
          </el-row>
          <el-row style="text-align: right;">
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="hanleReset">重置</el-button>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="2" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="1" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import setting from "./setting.vue";
import maintenance from "./maintenance.vue";
import {
  getParameterSetting,
  updateParameterSetting
} from "@/api/skins/ttSetting/api";
export default {
  data() {
    return {
      pt: 7,
      mainteanaceactiveName: "first",
      activeName: "first",
      settingactiveName: "first",
      loading: false,
      form: {},
      datas: {},
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },

      activeName: "first"
    };
  },
  components: {
    setting,
    maintenance
  },
  mounted() {
    this.getList();
  },
  methods: {
    hanleReset() {
      this.resetForm("form");
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
.home {
  padding: 20px;
}
</style>
