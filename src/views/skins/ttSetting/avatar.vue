<template>
  <div class="home">
    <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd">新增</el-button>
    <el-table :data="tableData" style="width: 100%;margin-top:20px;" v-loading="loading">
      <el-table-column align="center" prop="id" label="Id"></el-table-column>
      <el-table-column align="center" prop="avatar" label="图片">
        <template slot-scope="scope">
          <image-preview :src="scope.row.avatar" width="50px" height="50px" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="图片排序"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="'0'"
            :inactive-value="'1'"
            inactive-color="#D9534F"
            active-color="#5CB85C"
            active-text="禁用"
            inactive-text="启用"
            @change="updateUserStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isDefault" label="是否默认">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDefault"
            :active-value="'0'"
            :inactive-value="'1'"
            active-color="#D9534F"
            inactive-color="#5CB85C"
            active-text="是"
            inactive-text="否"
            @change="updateUserStatus(scope.row)"
          ></el-switch>
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
        <el-form-item label="头像" :label-width="formLabelWidth">
          <image-upload v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="是否默认" :label-width="formLabelWidth">
          <el-radio-group v-model="form.isDefault" size="small">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number size="small" v-model="form.sort" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio-group v-model="form.status" size="small">
            <el-radio-button label="0">正常</el-radio-button>
            <el-radio-button label="1">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="title == '新增头像'" type="primary" @click="handleSubmit()">确 定</el-button>
        <el-button v-if="title == '修改头像'" type="primary" @click="handleSubmits()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getuserAvatar,
  adduserAvatar,
  changheuserAvatar,
  deluserAvatar,
  getuserAvatarid
} from "@/api/skins/ttSetting/api";

export default {
  data() {
    return {
      title: "新增头像",
      tableData: [],
      formLabelWidth: "100px",
      form: {
        avatar: null,
        isDefault: 0,
        sort: 0,
        status: 0
      },
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
      this.title = "修改头像";
      this.dialogFormVisible = true;
      getuserAvatarid(res.id).then(res => {
        this.form = res.data;
      });
    },
    handleDelete(res) {
      deluserAvatar(res.id).then(res => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getList();
      });
    },
    updateUserStatus(res) {
      changheuserAvatar(res)
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.getList();
        })
        .catch(err => {
          this.getList();
        });
    },
    handleSubmits() {
      changheuserAvatar(this.form).then(res => {
        this.dialogFormVisible = false;
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.getList();
      });
    },
    handleSubmit() {
      adduserAvatar(this.form).then(res => {
        this.dialogFormVisible = false;
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.getList();
      });
    },
    handleAdd() {
      this.title = "新增头像";
      this.dialogFormVisible = true;
      this.form = { avatar: null, isDefault: 0, sort: 0, status: 0 };
    },
    getList() {
      this.loading = true;
      getuserAvatar(this.queryParams).then(res => {
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
