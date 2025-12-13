<template>
  <div class="home">
    <el-button type="primary" size="mini" @click="handleAdd()">新增VIP设置</el-button>
    <el-table :data="tableData" style="width: 100%" v-loading="loading" border>
      <el-table-column align="center" prop="id" label="ID" width="80"></el-table-column>
      <el-table-column align="center" prop="level" label="VIP等级" width="100"></el-table-column>
      <el-table-column align="center" prop="name" label="VIP等级名称" width="150"></el-table-column>
      <el-table-column align="center" prop="growthValue" label="成长值（消费金额）" width="150">
        <template slot-scope="scope">
          {{ scope.row.growthValue }} 元
        </template>
      </el-table-column>
      <el-table-column align="center" prop="rebateRate" label="消费返点比例" width="150">
        <template slot-scope="scope">
          {{ scope.row.rebateRate }} %
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sortOrder" label="排序" width="100"></el-table-column>
      <el-table-column align="center" prop="description" label="描述" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间" width="180"></el-table-column>
      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" style="color: #f56c6c" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px">
        <el-form-item label="VIP等级" prop="level">
          <el-input-number
            v-model="form.level"
            controls-position="right"
            :min="1"
            :max="100"
            :disabled="isEdit"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="VIP等级名称" prop="name">
          <el-input v-model="form.name" placeholder="例如：VIP1"></el-input>
        </el-form-item>
        <el-form-item label="成长值（消费金额）" prop="growthValue">
          <el-input-number
            v-model="form.growthValue"
            controls-position="right"
            :min="0"
            :precision="2"
            :step="100"
            style="width: 100%"
          ></el-input-number>
          <div style="color: #909399; font-size: 12px; margin-top: 5px;">
            达到此消费金额即可获得该VIP等级
          </div>
        </el-form-item>
        <el-form-item label="消费返点比例（%）" prop="rebateRate">
          <el-input-number
            v-model="form.rebateRate"
            controls-position="right"
            :min="0"
            :max="100"
            :precision="2"
            :step="0.1"
            style="width: 100%"
          ></el-input-number>
          <div style="color: #909399; font-size: 12px; margin-top: 5px;">
            例如：5 表示 5%，即消费100元返点5元
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number
            v-model="form.sortOrder"
            controls-position="right"
            :min="0"
            :max="9999"
            style="width: 100%"
          ></el-input-number>
          <div style="color: #909399; font-size: 12px; margin-top: 5px;">
            数字越小越靠前
          </div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description" :rows="3" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getVipConfig,
  addVipConfig,
  changeVipConfig,
  delVipConfig,
  getVipConfigId
} from "@/api/skins/ttSetting/api";

export default {
  name: "VipConfig",
  data() {
    return {
      loading: false,
      dialogTitle: "新增VIP设置",
      dialogFormVisible: false,
      isEdit: false,
      tableData: [],
      form: {
        id: null,
        level: 1,
        name: "",
        growthValue: 0,
        rebateRate: 0,
        sortOrder: 0,
        description: ""
      },
      rules: {
        level: [
          { required: true, message: "请输入VIP等级", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入VIP等级名称", trigger: "blur" }
        ],
        growthValue: [
          { required: true, message: "请输入成长值", trigger: "blur" }
        ],
        rebateRate: [
          { required: true, message: "请输入消费返点比例", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      getVipConfig().then(res => {
        this.tableData = res.rows || [];
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleAdd() {
      this.dialogTitle = "新增VIP设置";
      this.isEdit = false;
      this.form = {
        id: null,
        level: 1,
        name: "",
        growthValue: 0,
        rebateRate: 0,
        sortOrder: 0,
        description: ""
      };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },
    handleEdit(row) {
      this.dialogTitle = "修改VIP设置";
      this.isEdit = true;
      getVipConfigId(row.id).then(res => {
        this.form = { ...res.data };
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          if (this.$refs.form) {
            this.$refs.form.clearValidate();
          }
        });
      });
    },
    handleDelete(row) {
      this.$modal.confirm('是否确认删除VIP设置"' + row.name + '"？').then(() => {
        return delVipConfig(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            changeVipConfig(this.form).then(res => {
              this.$modal.msgSuccess("修改成功");
              this.dialogFormVisible = false;
              this.getList();
            });
          } else {
            addVipConfig(this.form).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.dialogFormVisible = false;
              this.getList();
            });
          }
        }
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
