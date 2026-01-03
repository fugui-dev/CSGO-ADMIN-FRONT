<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 18px; font-weight: bold;">日流水排行榜奖励配置</span>
        <div style="float: right;">
          <el-button
            icon="el-icon-plus"
            plain
            size="mini"
            type="primary"
            @click="handleAdd"
            style="margin-right: 10px;"
          >新增配置</el-button>
          <el-button style="padding: 3px 0" type="text" @click="refreshList">刷新</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="configList" border style="width: 100%">
        <el-table-column align="center" label="排名范围" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.rankStart === scope.row.rankEnd">
              第{{ scope.row.rankStart }}名
            </span>
            <span v-else>
              第{{ scope.row.rankStart }}-{{ scope.row.rankEnd }}名
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖励金额" prop="rewardAmount" width="120">
          <template slot-scope="scope">
            <span style="color: #409EFF; font-weight: bold;">
              {{ formatAmount(scope.row.rewardAmount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖励类型" prop="rewardType" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.rewardType === 1 ? 'success' : 'warning'">
              {{ scope.row.rewardType === 1 ? '金币' : '弹药' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="status" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" prop="sortOrder" width="100" />
        <el-table-column align="center" label="备注" prop="remark" show-overflow-tooltip />
        <el-table-column align="center" label="创建时间" prop="createTime" width="180" />
        <el-table-column align="center" label="更新时间" prop="updateTime" width="180" />
        <el-table-column align="center" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑对话框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="600px"
        append-to-body
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="排名起始" prop="rankStart">
            <el-input-number
              v-model="form.rankStart"
              :min="1"
              :max="100"
              controls-position="right"
              style="width: 100%"
            />
            <div style="color: #909399; font-size: 12px; margin-top: 5px;">
              包含此排名（1-100）
            </div>
          </el-form-item>
          <el-form-item label="排名结束" prop="rankEnd">
            <el-input-number
              v-model="form.rankEnd"
              :min="1"
              :max="100"
              controls-position="right"
              style="width: 100%"
            />
            <div style="color: #909399; font-size: 12px; margin-top: 5px;">
              包含此排名，必须大于等于起始排名
            </div>
          </el-form-item>
          <el-form-item label="奖励金额" prop="rewardAmount">
            <el-input-number
              v-model="form.rewardAmount"
              :min="0"
              :precision="2"
              :step="10"
              controls-position="right"
              style="width: 100%"
            />
            <div style="color: #909399; font-size: 12px; margin-top: 5px;">
              奖励金额，支持小数
            </div>
          </el-form-item>
          <el-form-item label="奖励类型" prop="rewardType">
            <el-radio-group v-model="form.rewardType">
              <el-radio :label="1">金币</el-radio>
              <el-radio :label="2">弹药</el-radio>
            </el-radio-group>
            <div style="color: #909399; font-size: 12px; margin-top: 5px;">
              选择奖励发放到金币账户还是弹药账户
            </div>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="true">启用</el-radio>
              <el-radio :label="false">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" prop="sortOrder">
            <el-input-number
              v-model="form.sortOrder"
              :min="0"
              :max="9999"
              controls-position="right"
              style="width: 100%"
            />
            <div style="color: #909399; font-size: 12px; margin-top: 5px;">
              数字越小越靠前
            </div>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getRewardConfigList,
  getRewardConfig,
  addRewardConfig,
  updateRewardConfig,
  deleteRewardConfig
} from "@/api/skins/dailyFlowRanking/api";

export default {
  name: "DailyFlowRankingRewardConfig",
  data() {
    return {
      loading: false,
      configList: [],
      dialogVisible: false,
      dialogTitle: "",
      form: {
        id: null,
        rankStart: 1,
        rankEnd: 1,
        rewardAmount: 0,
        rewardType: 1, // 1=金币，2=弹药
        status: true,
        sortOrder: 0,
        remark: ""
      },
      rules: {
        rankStart: [
          { required: true, message: "请输入排名起始", trigger: "blur" },
          { type: "number", min: 1, max: 100, message: "排名起始必须在1-100之间", trigger: "blur" }
        ],
        rankEnd: [
          { required: true, message: "请输入排名结束", trigger: "blur" },
          { type: "number", min: 1, max: 100, message: "排名结束必须在1-100之间", trigger: "blur" }
        ],
        rewardAmount: [
          { required: true, message: "请输入奖励金额", trigger: "blur" },
          { type: "number", min: 0, message: "奖励金额必须大于等于0", trigger: "blur" }
        ],
        rewardType: [
          { required: true, message: "请选择奖励类型", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询配置列表 */
    getList() {
      this.loading = true;
      getRewardConfigList()
        .then(res => {
          if (res.code === 200) {
            this.configList = res.data || [];
          } else {
            this.$modal.msgError(res.msg || "获取配置列表失败");
          }
        })
        .catch(() => {
          this.$modal.msgError("获取配置列表失败");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 刷新列表 */
    refreshList() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.dialogTitle = "新增奖励配置";
      this.dialogVisible = true;
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      getRewardConfig(row.id)
        .then(res => {
          if (res.code === 200) {
            this.form = {
              id: res.data.id,
              rankStart: res.data.rankStart,
              rankEnd: res.data.rankEnd,
              rewardAmount: res.data.rewardAmount,
              rewardType: res.data.rewardType || 1,
              status: res.data.status !== false,
              sortOrder: res.data.sortOrder || 0,
              remark: res.data.remark || ""
            };
            this.dialogTitle = "编辑奖励配置";
            this.dialogVisible = true;
          } else {
            this.$modal.msgError(res.msg || "获取配置详情失败");
          }
        })
        .catch(() => {
          this.$modal.msgError("获取配置详情失败");
        });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除排名"' + (row.rankStart === row.rankEnd ? `第${row.rankStart}名` : `第${row.rankStart}-${row.rankEnd}名`) + '"的奖励配置？').then(() => {
        return deleteRewardConfig(row.id);
      }).then(res => {
        if (res.code === 200) {
          this.$modal.msgSuccess("删除成功");
          this.getList();
        } else {
          this.$modal.msgError(res.msg || "删除失败");
        }
      }).catch(() => {});
    },
    /** 提交表单 */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 验证排名范围
          if (this.form.rankStart > this.form.rankEnd) {
            this.$modal.msgError("排名结束必须大于等于排名起始");
            return;
          }

          if (this.form.id) {
            // 编辑
            updateRewardConfig(this.form)
              .then(res => {
                if (res.code === 200) {
                  this.$modal.msgSuccess("修改成功");
                  this.dialogVisible = false;
                  this.getList();
                } else {
                  this.$modal.msgError(res.msg || "修改失败");
                }
              })
              .catch(() => {
                this.$modal.msgError("修改失败");
              });
          } else {
            // 新增
            addRewardConfig(this.form)
              .then(res => {
                if (res.code === 200) {
                  this.$modal.msgSuccess("新增成功");
                  this.dialogVisible = false;
                  this.getList();
                } else {
                  this.$modal.msgError(res.msg || "新增失败");
                }
              })
              .catch(() => {
                this.$modal.msgError("新增失败");
              });
          }
        }
      });
    },
    /** 重置表单 */
    reset() {
      this.form = {
        id: null,
        rankStart: 1,
        rankEnd: 1,
        rewardAmount: 0,
        rewardType: 1,
        status: true,
        sortOrder: 0,
        remark: ""
      };
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    /** 格式化金额 */
    formatAmount(amount) {
      if (amount == null) return '0.00';
      return parseFloat(amount).toFixed(2);
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

