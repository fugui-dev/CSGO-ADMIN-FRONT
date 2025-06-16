<template>
  <div class="home">
    <el-form :inline="true" :model="queryParams" size="small">
      <el-form-item label="宝箱分类ID" prop="id">
        <el-input v-model="queryParams.id" placeholder="请输入宝箱记录ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="宝箱名称" prop="userId">
        <el-input v-model="queryParams.name" placeholder="请输入用户ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否对战" prop="isFightType">
        <el-select v-model="queryParams.isFightType" placeholder="请选择" clearable>
          <el-option label="是" value="0" />
          <el-option label="否" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-button @click="handleCreat" type="success" icon="el-icon-plus" size="mini">新增</el-button>
    </el-form>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="id" label="Id"></el-table-column>
      <el-table-column align="center" prop="icon" label="宝箱分类图标">
        <template slot-scope="scope">
          <image-preview :src="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="宝箱分类名称"></el-table-column>
      <el-table-column align="center" prop="isFightType" label="是否对战类型">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isFightType"
            :active-value="'0'"
            :inactive-value="'1'"
            inactive-color="#D9534F"
            active-color="#5CB85C"
            inactive-text="是"
            active-text="否"
            @change="updateUserStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="宝箱分类排序"></el-table-column>
      <el-table-column align="center" prop="sort" label="宝箱分类排序">
        <template slot-scope="scope">
          <el-button type="text" @click="handleChange(scope.row)">修改</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getlist"
    />

    <el-dialog title="新增宝箱分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="宝箱分类图标" :label-width="formLabelWidth">
          <image-upload v-model="form.icon" />
        </el-form-item>
        <el-form-item label="宝箱分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="宝箱分类排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" autocomplete="off"></el-input>
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
  boxType,
  boxTypelist,
  boxTypeChange,
  boxTypeId,
  delBoxType
} from "@/api/skins/ttBox/api";
export default {
  data() {
    return {
      type: 1,
      loading: false,
      formLabelWidth: "80",
      dialogFormVisible: false,
      form: { icon: null, name: null, sort: null },
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isFightType: this.$route.query.type,
        name: null,
        id: null
      },
      total: 0
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        isFightType: null,
        name: null,
        id: null
      };
      this.getlist();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getlist();
    },
    updateUserStatus(res) {
      let data = res;
      data.icon = "";
      boxTypeChange(data)
        .then(response => {
          this.$modal.msgSuccess("修改成功");
          this.open = false;
          this.getlist();
        })
        .catch(err => {
          this.getlist();
        });
    },
    handleDelete(res) {
      this.$modal
        .confirm('是否确认删除编号为"' + res.id + '"的数据项？')
        .then(() => {
          this.loading = true;
          delBoxType(res.id).then(res => {
            this.getlist();
            this.$modal.msgSuccess("删除成功");
          });
        })
        .catch(() => {});
    },
    handleChange(res) {
      this.type = 2;
      this.dialogFormVisible = true;
      boxTypeId(res.id).then(response => {
        this.form = response.data;
      });
    },
    handleSubmit() {
      if (this.type == 1) {
        boxType(this.form).then(res => {
          this.$modal.msgSuccess("添加成功");
          (this.form = { icon: null, name: null, sort: null }), this.getlist();
          this.dialogFormVisible = false;
        });
      } else if (this.type == 2) {
        boxTypeChange(this.form).then(res => {
          this.$modal.msgSuccess("添加成功");
          (this.form = { icon: null, name: null, sort: null }), this.getlist();
          this.dialogFormVisible = false;
        });
      }
    },
    handleCreat() {
      this.type = 1;
      this.dialogFormVisible = true;
    },
    getlist() {
      this.loading = true;
      boxTypelist(this.queryParams).then(res => {
        this.tableData = res.rows;
        this.loading = false;
        this.total = res.total;
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
