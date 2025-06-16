<template>
  <div class="home">
    <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd">新增</el-button>
    <el-table :data="tableData" style="width: 100%;margin-top:20px;" v-loading="loading">
      <el-table-column align="center" prop="id" label="Id"></el-table-column>
      <el-table-column align="center" prop="title" label="标题"></el-table-column>

      <el-table-column align="center" prop="picture" label="图片">
        <template slot-scope="scope">
          <image-preview :src="scope.row.picture" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="jumpLink" label="跳转链接">
        <template slot-scope="scope">
          <el-popover placement="top" width="290" popper-class="layout">
            <el-row>
              <el-col :span="18">
                <el-input v-model="scope.row.jumpLink" clearable></el-input>
              </el-col>
              <el-col :span="6">
                <div style="text-align: right; margin: 0;line-height:36px">
                  <el-button size="mini" type="text" @click="handleR">取消</el-button>
                  <el-button type="text" size="mini" @click="handleChangeType(scope.row)">确定</el-button>
                </div>
              </el-col>
            </el-row>
            <el-button
              slot="reference"
              type="text"
              class="under"
              icon="el-icon-edit"
            >{{scope.row.jumpLink}}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
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
      <el-table-column align="center" prop="sort" label="图片排序">
        <template slot-scope="scope">
          <el-popover placement="top" width="290" popper-class="layout">
            <el-row>
              <el-col :span="18">
                <el-input v-model="scope.row.sort" clearable></el-input>
              </el-col>
              <el-col :span="6">
                <div style="text-align: right; margin: 0;line-height:36px">
                  <el-button size="mini" type="text" @click="handleR">取消</el-button>
                  <el-button type="text" size="mini" @click="handleChangeType(scope.row)">确定</el-button>
                </div>
              </el-col>
            </el-row>
            <el-button
              slot="reference"
              type="text"
              class="under"
              icon="el-icon-edit"
            >{{scope.row.sort}}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleChange(scope.row)">修改</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="banner图片" :label-width="formLabelWidth">
          <image-upload v-model="form.picture" />
        </el-form-item>
        <el-form-item label="banner名称" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="banner排序" :label-width="formLabelWidth">
          <el-input-number size="small" v-model="form.sort" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="banner状态" :label-width="formLabelWidth">
          <el-radio-group v-model="form.status" size="small">
            <el-radio-button label="0">正常</el-radio-button>
            <el-radio-button label="1">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="title == '新增图片'" type="primary" @click="handleSubmit()">确 定</el-button>
        <el-button v-if="title == '修改图片'" type="primary" @click="handleSubmits()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBanner,
  addBanner,
  changeBanner,
  delBanner,
  getBannerid
} from "@/api/skins/ttSetting/api";

export default {
  data() {
    return {
      title: "新增图片",
      form: {
        jumpLink: null,
        picture: null,
        sort: null,
        status: 1,
        title: null
      },
      formLabelWidth: "120px",
      tableData: [],
      loading: false,
      dialogFormVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 20
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleChange(res) {
      this.title = "修改图片";
      getBannerid(res.id).then(res => {
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
          delBanner(res.id).then(res => {
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
    handleR() {
      document.body.click();
    },
    handleChangeType(res) {
      let data = res;
      // data.picture = "";
      changeBanner(data)
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
    handleSubmits() {
      changeBanner(this.form).then(res => {
        this.dialogFormVisible = false;
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.getList();
      });
    },
    handleSubmit() {
      addBanner(this.form).then(res => {
        this.dialogFormVisible = false;
        this.$message({
          type: "success",
          message: "新增成功!"
        });
        this.getList();
      });
    },
    handleAdd() {
      this.form = {
        jumpLink: null,
        picture: null,
        sort: null,
        status: 1,
        title: null
      };
      this.title = "新增图片";
      this.dialogFormVisible = true;
    },
    getList() {
      this.loading = true;
      getBanner(this.queryParams).then(res => {
        this.loading = false;
        this.tableData = res.rows;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
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
</style>
