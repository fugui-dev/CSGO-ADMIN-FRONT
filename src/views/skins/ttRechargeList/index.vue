<template>
  <div class="home">
    <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd">新增</el-button>
    <el-table :data="tableData" style="width: 100%;margin-top:20px;" v-loading="loading">
      <el-table-column align="center" prop="id" label="id" width="180"></el-table-column>
      <el-table-column align="center" prop="cardLink" label="卡密链接" width="180"></el-table-column>
      <el-table-column align="center" prop="price" label="充值金额"></el-table-column>
      <el-table-column align="center" prop="productA" label="金币"></el-table-column>
      <el-table-column align="center" prop="productC" label="弹药"></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="'0'"
            :inactive-value="'1'"
            active-color="#5CB85C"
            inactive-color="#D9534F"
            inactive-text="启用"
            active-text="禁用"
            @change="handleChangeType(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleChange(scope.row)">修改</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="卡密链接" :label-width="formLabelWidth" prop="cardLink">
          <el-input v-model="form.cardLink" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="充值金额" :label-width="formLabelWidth" prop="price">
          <el-input-number size="small" v-model="form.price" :min="0" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="金币" :label-width="formLabelWidth" prop="price">
          <el-input-number size="small" v-model="form.productA" :min="0" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="弹药" :label-width="formLabelWidth" prop="price">
          <el-input-number size="small" v-model="form.productC" :min="0" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="卡密状态" :label-width="formLabelWidth">
          <el-radio-group v-model="form.status" size="small">
            <el-radio-button label="0">启用</el-radio-button>
            <el-radio-button label="1">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="title == '新增'" type="primary" @click="handleSubmit('ruleForm')">确 定</el-button>
        <el-button v-if="title == '修改'" type="primary" @click="handleSubmits('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRechargeList,
  getRechargeListid,
  changeRechargeList,
  addRechargeList,
  delRechargeList
} from "@/api/skins/ttRecharge/api";

export default {
  data() {
    return {
      formLabelWidth: "120px",
      dialogFormVisible: false,
      title: "新增",
      total: 1,
      loading: false,
      tableData: [],
      form: {
        price: 0.01,
        cardLink: null,
        status: 0,
        productA: null,
        productC: null
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: null,
        outTradeNo: null,
        parentId: null,
        startTime: null,
        endTime: null,
        userId: null
      },
      rules: {
        price: [{ required: true, message: "请输入金额", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleChange(res) {
      this.title = "修改";
      getRechargeListid(res.id).then(res => {
        this.form = res.data;
        this.dialogFormVisible = true;
      });
    },
    handleDelete(res) {
      this.$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRechargeList(res.id).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSubmits(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          changeRechargeList(this.form).then(res => {
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.getList();
          });
        } else {
          return false;
        }
      });
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addRechargeList(this.form).then(res => {
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "新增成功!"
            });
            this.getList();
          });
        } else {
          return false;
        }
      });
    },
    handleAdd() {
      this.title = "新增";
      this.dialogFormVisible = true;
      this.form = { price: 0.01, cardLink: null, status: 0 };
    },
    handleChangeType(res) {
      let data = res;
      changeRechargeList(data)
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          document.body.click();
          this.getList();
        })
        .catch(res => {
          this.getList();
        });
    },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10
      };
      this.getList();
    },
    getList() {
      this.loading = true;
      getRechargeList(this.queryParams).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
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
