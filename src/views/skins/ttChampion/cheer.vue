<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
          @click="handleAdd"
        >创建</el-button>
      </el-col>
      
      <right-toolbar @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cheerList">
      <el-table-column align="center" label="id" prop="id" width="55" />
      <el-table-column align="center" label="阶段类型" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.champion_stage_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="助威奖励倍数" prop="bonusTimes" width="100" />
      <el-table-column align="center" label="助威积分比例" prop="scoreProportion" width="100" />
      <el-table-column align="center" label="创建时间" prop="createTime" width="170" />
      <el-table-column align="center" label="更新时间" prop="updateTime" width="170" />
      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建助威配置 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="阶段类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择" clearable :disabled="form.id != null">
            <el-option
              v-for="dict in dict.type.champion_stage_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="助威奖励倍数" prop="bonusTimes" class="number">
          <el-input-number v-model="form.bonusTimes" :precision="2" :step="0.01" :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item label="助威积分比例" prop="scoreProportion" class="number">
          <el-input-number v-model="form.scoreProportion" :precision="2" :step="0.1" :max="10000"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCheerListApi, addCheerApi, updateCheerApi, deleteCheerApi } from "@/api/skins/ttChampion/api";

export default {
  name: "Cheer",
  dicts: [
    "champion_stage_type"
  ],
  data() {
    return {
      // 遮罩层
      loading: true,
      
      // 总条数
      total: 0,
      // 助威配置列表
      cheerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      formAdd: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: "阶段类型不能为空", trigger: "change" }
        ],
        bonusTimes: [
          { required: true, message: "助威奖励倍数不能为空", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 10000,
            message: "请输入合理的奖励倍数",
            trigger: "blur"
          }
        ],
        scoreProportion: [
          { required: true, message: "助威积分比例不能为空", trigger: "blur" },
          {
            type: "number",
            min: 0,
            max: 10000,
            message: "请输入合理的积分比例",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      getCheerListApi({}).then(res => {
        if (res.code === 200) {
          this.cheerList = res.data
          this.total = res.total
        } else {
          this.$modal.msgError("请求失败");
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        type: null,
        bonusTimes: null,
        scoreProportion: null
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "创建助威配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      // 深拷贝，避免表单数据被修改
      this.form = {
        id: row.id,
        type: row.type,
        bonusTimes: parseFloat(row.bonusTimes),
        scoreProportion: parseFloat(row.scoreProportion)
      };
      this.open = true;
      this.title = "编辑助威配置";
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除助威配置编号为"' + id + '"的数据项？').then(() => {
        return deleteCheerApi(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            // 编辑
            updateCheerApi(this.form).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess(res.msg || "修改成功");
                this.open = false;
                this.getList();
              } else {
                this.$modal.msgError(res.msg);
              }
            });
          } else {
            // 新增
            addCheerApi(this.form).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess(res.msg || "新增成功");
                this.open = false;
                this.getList();
              } else {
                this.$modal.msgError(res.msg);
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep.number {
  .el-input--medium {
    width: 100px;
  }
  .el-input__inner {
    padding: 0;
  }
  .el-input-number__increase {
    display: none;
  }
  .el-input-number__decrease {
    display: none;
  }
}
::v-deep.under {
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
}
::v-deep .el-switch {
  border-radius: 0px !important;
  height: 24px !important;
}
::v-deep .el-switch__core {
  width: 70px !important;
  height: 24px;
  border-radius: 3px;
  border: none;
}
::v-deep .el-switch__core::after {
  width: 50%;
  height: 24px;
  border-radius: 0px;
  top: 0px !important;
  right: 0px !important;
  left: 0px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
::v-deep .el-switch.is-checked .el-switch__core::after {
  margin-left: -35px;
  box-sizing: border-box;
  top: 0px !important;
  right: 0px !important;
  border: 1px solid #ccc;
  border-radius: 3px;
  text-align: center;
}
/*关闭时文字位置设置*/
::v-deep .el-switch__label--right {
  text-align: center;
  position: absolute;
  width: 40%;
  z-index: 1;
  right: 6px;
  margin-left: 0px;
  color: rgba(255, 255, 255, 1);
  span {
    font-size: 13px;
    box-sizing: border-box;
    color: #fff;
  }
}
/* 激活时另一个文字消失 */
::v-deep .el-switch__label.is-active {
  text-align: center;
  display: none;
}
/*开启时文字位置设置*/
::v-deep .el-switch__label--left {
  text-align: center;
  position: absolute;
  width: 40%;
  z-index: 1;
  left: 5px;
  margin-right: 0px;
  color: rgba(255, 255, 255, 1);
  span {
    font-size: 13px;
    box-sizing: border-box;
    color: #fff;
  }
}
.magicbox {
  margin: 0 auto;
  margin-top: 5px;
  height: 300px;
  overflow-y: scroll;
  .magic {
    height: 32px;
    padding: 2px 5px;
    line-height: 32px;
    &:hover {
      background-color: #409eff;
      transition: all ease 0.3s;
    }
  }
}
.orform ::v-deep {
  .el-form-item__content {
    width: 65%;
  }
}
.max ::v-deep {
  .el-form-item__content {
    .el-input {
      .el-input__inner {
        padding-right: 10px;
      }
    }
  }
}
.box1 {
  padding: 14px;
  font-size: 16px;
  text-align: center;
}
.box2 {
  color: red;
}
#main {
  width: 500px;
  height: 400px;
}
</style>
