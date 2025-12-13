<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: 18px; font-weight: bold;">夺冠之路宝箱设置</span>
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
        <el-table-column align="center" label="奖励类型" prop="rewardTypeName" width="150" />
        <el-table-column align="center" label="宝箱ID" prop="boxId" width="100" />
        <el-table-column align="center" label="宝箱名称" prop="boxName" width="200" />
        <el-table-column align="center" label="状态" prop="status" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="remark" />
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
          <el-form-item label="奖励类型" prop="rewardType">
            <el-select
              v-model="form.rewardType"
              placeholder="请选择奖励类型"
              style="width: 100%"
              :disabled="!!form.id"
            >
              <el-option label="冠军宝箱" :value="1" />
              <el-option label="亚军宝箱" :value="2" />
              <el-option label="淘汰奖励宝箱" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="奖励类型名称" prop="rewardTypeName">
            <el-input
              v-model="form.rewardTypeName"
              placeholder="请输入奖励类型名称"
              :disabled="!!form.id"
            />
          </el-form-item>
          <el-form-item label="选择宝箱" prop="boxId">
            <el-select
              v-model="form.boxId"
              placeholder="请选择宝箱"
              style="width: 100%"
              filterable
              @change="handleBoxChange"
            >
              <el-option
                v-for="box in boxList"
                :key="box.boxId"
                :label="`${box.boxName} (ID: ${box.boxId})`"
                :value="box.boxId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="宝箱名称" prop="boxName">
            <el-input
              v-model="form.boxName"
              placeholder="宝箱名称（自动填充）"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
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
  getMatchRewardBoxConfigListApi,
  createMatchRewardBoxConfigApi,
  updateMatchRewardBoxConfigApi,
  deleteMatchRewardBoxConfigApi
} from "@/api/skins/ttChampion/api";
import { listBox } from "@/api/skins/ttBox/api";

export default {
  name: "MatchRewardBoxConfig",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 配置列表
      configList: [],
      // 宝箱列表
      boxList: [],
      // 对话框显示
      dialogVisible: false,
      // 对话框标题
      dialogTitle: "",
      // 表单数据
      form: {
        id: null,
        rewardType: null,
        rewardTypeName: "",
        boxId: null,
        boxName: "",
        status: 0,
        remark: ""
      },
      // 表单校验
      rules: {
        rewardType: [
          { required: true, message: "请选择奖励类型", trigger: "change" }
        ],
        rewardTypeName: [
          { required: true, message: "请输入奖励类型名称", trigger: "blur" }
        ],
        boxId: [
          { required: true, message: "请选择宝箱", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getBoxList();
  },
  methods: {
    /** 查询配置列表 */
    getList() {
      this.loading = true;
      getMatchRewardBoxConfigListApi()
        .then(res => {
          if (res.code === 200) {
            this.configList = res.data || [];
          } else {
            this.$modal.msgError(res.msg || "获取配置列表失败");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 获取宝箱列表 */
    getBoxList() {
      listBox({ pageNum: 1, pageSize: 1000 })
        .then(response => {
          if (response.rows) {
            this.boxList = response.rows;
          } else if (response.data && response.data.records) {
            this.boxList = response.data.records;
          } else if (Array.isArray(response.data)) {
            this.boxList = response.data;
          }
        })
        .catch(() => {
          this.$modal.msgError("获取宝箱列表失败");
        });
    },
    /** 刷新列表 */
    refreshList() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.dialogTitle = "新增宝箱配置";
      this.dialogVisible = true;
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.form = {
        id: row.id,
        rewardType: row.rewardType,
        rewardTypeName: row.rewardTypeName,
        boxId: row.boxId,
        boxName: row.boxName,
        status: row.status,
        remark: row.remark || ""
      };
      this.dialogTitle = "编辑宝箱配置";
      this.dialogVisible = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除"' + row.rewardTypeName + '"的配置？')
        .then(() => {
          return deleteMatchRewardBoxConfigApi(row.id);
        })
        .then(res => {
          if (res.code === 200) {
            this.$modal.msgSuccess("删除成功");
            this.getList();
          } else {
            this.$modal.msgError(res.msg || "删除失败");
          }
        })
        .catch(() => {});
    },
    /** 宝箱选择变化 */
    handleBoxChange(boxId) {
      const selectedBox = this.boxList.find(box => box.boxId === boxId);
      if (selectedBox) {
        this.form.boxName = selectedBox.boxName;
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 根据奖励类型自动设置名称
          if (!this.form.rewardTypeName) {
            const typeMap = {
              1: "冠军宝箱",
              2: "亚军宝箱",
              3: "淘汰奖励宝箱"
            };
            this.form.rewardTypeName = typeMap[this.form.rewardType];
          }

          if (this.form.id) {
            // 更新
            updateMatchRewardBoxConfigApi(this.form)
              .then(res => {
                if (res.code === 200) {
                  this.$modal.msgSuccess("更新成功");
                  this.dialogVisible = false;
                  this.getList();
                } else {
                  this.$modal.msgError(res.msg || "更新失败");
                }
              });
          } else {
            // 创建
            createMatchRewardBoxConfigApi(this.form)
              .then(res => {
                if (res.code === 200) {
                  this.$modal.msgSuccess("创建成功");
                  this.dialogVisible = false;
                  this.getList();
                } else {
                  this.$modal.msgError(res.msg || "创建失败");
                }
              });
          }
        }
      });
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: null,
        rewardType: null,
        rewardTypeName: "",
        boxId: null,
        boxName: "",
        status: 0,
        remark: ""
      };
      this.resetForm("form");
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
