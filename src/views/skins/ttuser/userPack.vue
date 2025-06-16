<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="持有者ID" prop="holderUserId">
        <el-input
          v-model="queryParams.holderUserId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对战ID" prop="fightId">
        <el-input
          v-model="queryParams.fightId"
          placeholder="请输入用户昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="roll房ID" prop="rollId">
        <el-input
          v-model="queryParams.rollId"
          placeholder="请输入邀请码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="饰品来源" prop="source">
        <el-select v-model="queryParams.source" placeholder="请选择用户类型" clearable>
          <el-option
            v-for="dict in dict.type.user_pack_from"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="饰品状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.user_pack_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['admin:ornamentsLevel:remove']"
          :disabled="multiple"
          icon="el-icon-delete"
          plain
          size="mini"
          type="danger"
          @click="handleDel"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column align="center" label="背包ID" prop="id" />
      <el-table-column align="center" label="持有人" prop="nickName" />
      <el-table-column align="center" label="饰品名称" prop="ornamentName" />
      <el-table-column align="center" label="饰品图片" prop="avatar">
        <template slot-scope="scope">
          <image-preview :src="scope.row.imageUrl" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="饰品价格" prop="ornamentsPrice" />

      <el-table-column align="center" label="来源" prop="source">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_pack_from" :value="scope.row.source" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_pack_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Roll房ID" prop="rollId" />

      <el-table-column align="center" label="对战ID" prop="fightId" />
      <el-table-column align="center" label="创建时间" prop="createTime" />
      <el-table-column align="center" label="更新时间" prop="updateTime" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import { getPackSack, removeUserPackSackData } from "@/api/skins/ttuser/api";

export default {
  name: "User",
  dicts: ["user_type", "user_status", "user_pack_status", "user_pack_from"],
  data() {
    return {
      multiple: true,

      ids: [],
      openView: false,
      newNumber: 1,
      addNewUser: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 注册用户表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: null,
        phoneNumber: null,
        status: "0",
        holderUserId: this.$route.query.id,
        userId: null,
        userName: null,
        source: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户账号不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        userType: [
          { required: true, message: "用户类型不能为空", trigger: "change" }
        ],
        accountAmount: [
          { required: true, message: "账户金额不能为空", trigger: "blur" }
        ],
        accountCredits: [
          { required: true, message: "账户弹药不能为空", trigger: "blur" }
        ],
        invitationCode: [
          { required: true, message: "邀请码不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "帐号状态不能为空", trigger: "change" }
        ],
        isRealCheck: [
          {
            required: true,
            message: "实名认证状态不能为空",
            trigger: "change"
          }
        ],
        delFlag: [
          { required: true, message: "删除标志不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleDel(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除编号为"' + ids + '"的数据项？')
        .then(function() {
          return removeUserPackSackData(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    getList() {
      this.loading = true;
      getPackSack(this.queryParams).then(response => {
        this.userList = response.rows;
        this.total = response.total;
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
        userId: null,
        userName: null,
        nickName: null,
        userType: null,
        email: null,
        phoneNumber: null,
        avatar: null,
        password: null,
        accountAmount: null,
        accountCredits: null,
        invitationCode: null,
        parentId: null,
        status: null,
        steamId: null,
        transactionLink: null,
        realName: null,
        idNum: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.holderUserId = null;
      // this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>
<style lang="scss" scoped>
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
