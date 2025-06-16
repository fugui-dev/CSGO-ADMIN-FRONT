<template>
  <div class="home">
    <el-button size="mini" @click="hadleClick()">生成推广列表</el-button>
    <el-button size="mini" @click="hadleReset()">重置</el-button>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="id" label="推广等级ID"></el-table-column>
      <el-table-column align="center" prop="name" label="推广等级名称"></el-table-column>
      <el-table-column align="center" prop="icon" label="推广等级图标">
        <template slot-scope="scope">
          <image-preview :src="scope.row.icon" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="rechargeThreshold" label="推广等级达标金额	"></el-table-column>
      <el-table-column align="center" prop="addedBonus" label="等级达标奖励红包金额"></el-table-column>
      <el-table-column align="center" prop="commissions" label="推广返佣比例	"></el-table-column>
      <el-table-column align="center" prop="description" label="描述"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleChange(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" v-if="title=='生成'">
        <el-form-item label="本网站最大推广等级" :label-width="formLabelWidth">
          <el-input-number v-model="form.num" controls-position="right" :min="0" :max="10000"></el-input-number>
        </el-form-item>
      </el-form>
      <el-form :model="form" v-if="title=='修改'">
        <el-form-item label="推广等级图标" :label-width="formLabelWidth">
          <image-upload v-model="form.icon" />
        </el-form-item>
        <el-form-item label="推广等级名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="推广返佣比例" :label-width="formLabelWidth">
          <el-input-number
            v-model="form.commissions"
            controls-position="right"
            :min="0"
            :max="10000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="推广等级达标金额" :label-width="formLabelWidth">
          <el-input-number
            v-model="form.rechargeThreshold"
            controls-position="right"
            :min="0"
            :max="10000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="等级达标奖励红包金额	" :label-width="formLabelWidth">
          <el-input-number
            v-model="form.addedBonus"
            controls-position="right"
            :min="0"
            :max="10000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="title=='生成'" type="primary" @click="hadleSubmit()">确 定</el-button>
        <el-button v-if="title=='修改'" type="primary" @click="hadleSubmits()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPromotionLevel,
  generatePromotionLevel,
  changePromotionLevel,
  resetPromotionLevel,
  getPromotionLevelid
} from "@/api/skins/ttSetting/api";

export default {
  data() {
    return {
      loading: false,
      title: "生成",
      dialogFormVisible: false,
      formLabelWidth: "150px",
      form: {
        num: 0
      },
      tableData: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleChange(res) {
      this.title = "修改";
      getPromotionLevelid(res.id).then(res => {
        this.form = res.data;
        this.dialogFormVisible = true;
      });
      this.dialogFormVisible = true;
    },
    hadleReset() {
      this.$modal
        .confirm("是否确认重置推广列表数据？")
        .then(() => {
          resetPromotionLevel().then(res => {
            this.getList();
          });
          this.$modal.msgSuccess("重置成功");
        })
        .catch(() => {
          this.getList();
        });
    },
    hadleSubmit() {
      generatePromotionLevel(this.form.num).then(res => {
        this.dialogFormVisible = false;
        this.$message({
          type: "success",
          message: "生成成功!"
        });
        this.getList();
      });
    },
    hadleSubmits() {
      changePromotionLevel(this.form).then(res => {
        this.dialogFormVisible = false;
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.getList();
      });
    },
    hadleClick() {
      this.form.num = 0;
      this.title = "生成";
      this.dialogFormVisible = true;
    },
    getList() {
      this.loading = true;
      getPromotionLevel().then(res => {
        this.tableData = res.rows;
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
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
</style>
