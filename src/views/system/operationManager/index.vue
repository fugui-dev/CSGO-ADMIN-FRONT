<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="登录账号" prop="loginAccount">
        <el-input
          v-model="queryParams.loginAccount"
          placeholder="请输入登录账号"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="团队名称" prop="teamName">
        <el-input
          v-model="queryParams.teamName"
          placeholder="请输入团队名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['admin:operationManager:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['admin:operationManager:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['admin:operationManager:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['admin:operationManager:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="operationManagerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="80" />
      <el-table-column label="头像" align="center" prop="avatar" width="80">
        <template slot-scope="scope">
          <el-avatar v-if="scope.row.avatar" :src="scope.row.avatar" :size="40"></el-avatar>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="团队名称" align="center" prop="teamName" :show-overflow-tooltip="true" />
      <el-table-column label="登录账号" align="center" prop="loginAccount" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['admin:operationManager:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-link"
            @click="handleBindAnchor(scope.row)"
            v-hasPermi="['admin:operationManager:edit']"
          >绑定主播</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['admin:operationManager:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改运营管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="团队名称" prop="teamName">
              <el-input v-model="form.teamName" placeholder="请输入团队名称" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录账号" prop="loginAccount">
              <el-input v-model="form.loginAccount" placeholder="请输入登录账号" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="form.id ? '新密码' : '密码'" prop="password">
              <el-input v-model="form.password" :placeholder="form.id ? '留空则不修改密码' : '请输入密码'" type="password" maxlength="50" show-password/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="头像" prop="avatar">
              <el-select v-model="form.avatar" placeholder="请选择头像" filterable style="width: 100%">
                <el-option
                  v-for="item in avatarList"
                  :key="item.id"
                  :label="item.avatar"
                  :value="item.avatar"
                >
                  <div style="display: flex; align-items: center;">
                    <el-avatar :src="item.avatar" :size="30" style="margin-right: 10px;"></el-avatar>
                    <span>{{ item.avatar }}</span>
                  </div>
                </el-option>
              </el-select>
              <div v-if="form.avatar" style="margin-top: 10px;">
                <el-avatar :src="form.avatar" :size="50"></el-avatar>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 绑定主播对话框 -->
    <el-dialog title="绑定主播" :visible.sync="bindAnchorOpen" width="800px" append-to-body>
      <div style="margin-bottom: 20px;">
        <el-select
          v-model="selectedAnchorIds"
          multiple
          filterable
          placeholder="请选择要绑定的主播"
          style="width: 100%"
        >
          <el-option
            v-for="anchor in anchorList"
            :key="anchor.userId"
            :label="anchor.nickName + ' (' + anchor.userName + ')'"
            :value="anchor.userId"
          >
            <div style="display: flex; align-items: center;">
              <el-avatar :src="anchor.avatar" :size="30" style="margin-right: 10px;"></el-avatar>
              <span>{{ anchor.nickName }} ({{ anchor.userName }})</span>
            </div>
          </el-option>
        </el-select>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4>已绑定的主播：</h4>
        <el-table :data="bindAnchorList" style="width: 100%">
          <el-table-column label="头像" width="80">
            <template slot-scope="scope">
              <el-avatar :src="getAnchorAvatar(scope.row.anchorId)" :size="40"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="主播昵称" prop="anchorNickName"></el-table-column>
          <el-table-column label="主播账号" prop="anchorUserName"></el-table-column>
          <el-table-column label="绑定时间" prop="bindTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.bindTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleUnbindAnchor(scope.row)"
              >解绑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBindAnchor">确 定</el-button>
        <el-button @click="bindAnchorOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOperationManager, getOperationManager, delOperationManager, addOperationManager, updateOperationManager, exportOperationManager, bindAnchors, unbindAnchor, getBindAnchors } from "@/api/system/operationManager";
import { getuserAvatar } from "@/api/skins/ttSetting/api";
import { listUser } from "@/api/skins/ttuser/api";

export default {
  name: "OperationManager",
  data() {
    return {
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
      // 运营管理表格数据
      operationManagerList: [],
      // 头像列表
      avatarList: [],
      // 绑定主播相关
      bindAnchorOpen: false,
      currentOperationManagerId: null,
      anchorList: [],
      selectedAnchorIds: [],
      bindAnchorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        loginAccount: undefined,
        teamName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        loginAccount: [
          { required: true, message: "登录账号不能为空", trigger: "blur" },
          { min: 3, max: 50, message: "登录账号长度必须介于 3 和 50 之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur", validator: this.validatePassword }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getAvatarList();
    this.getAnchorList();
  },
  methods: {
    // 密码验证器
    validatePassword(rule, value, callback) {
      if (!this.form.id && !value) {
        callback(new Error("密码不能为空"));
      } else if (value && (value.length < 6 || value.length > 50)) {
        callback(new Error("密码长度必须介于 6 和 50 之间"));
      } else {
        callback();
      }
    },
    /** 查询运营管理列表 */
    getList() {
      this.loading = true;
      listOperationManager(this.queryParams).then(response => {
        this.operationManagerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询头像列表 */
    getAvatarList() {
      getuserAvatar({ pageNum: 1, pageSize: 1000, status: '0' }).then(response => {
        this.avatarList = response.rows || [];
      });
    },
    /** 查询主播列表 */
    getAnchorList() {
      listUser({ userType: '01', pageNum: 1, pageSize: 1000 }).then(response => {
        this.anchorList = response.rows || [];
      });
    },
    /** 绑定主播按钮操作 */
    handleBindAnchor(row) {
      this.currentOperationManagerId = row.id;
      this.selectedAnchorIds = [];
      this.bindAnchorOpen = true;
      this.getBindAnchorList();
    },
    /** 查询已绑定的主播列表 */
    getBindAnchorList() {
      if (!this.currentOperationManagerId) return;
      getBindAnchors(this.currentOperationManagerId).then(response => {
        this.bindAnchorList = response.data || [];
        // 填充主播信息
        this.bindAnchorList.forEach(item => {
          const anchor = this.anchorList.find(a => a.userId === item.anchorId);
          if (anchor) {
            item.anchorNickName = anchor.nickName;
            item.anchorUserName = anchor.userName;
            item.anchorAvatar = anchor.avatar;
          }
        });
      });
    },
    /** 获取主播头像 */
    getAnchorAvatar(anchorId) {
      const anchor = this.anchorList.find(a => a.userId === anchorId);
      return anchor ? anchor.avatar : '';
    },
    /** 提交绑定主播 */
    submitBindAnchor() {
      if (!this.selectedAnchorIds || this.selectedAnchorIds.length === 0) {
        this.$modal.msgWarning("请至少选择一个主播");
        return;
      }
      bindAnchors(this.currentOperationManagerId, this.selectedAnchorIds).then(response => {
        this.$modal.msgSuccess("绑定成功");
        this.getBindAnchorList();
        this.selectedAnchorIds = [];
      });
    },
    /** 解绑主播 */
    handleUnbindAnchor(row) {
      this.$modal.confirm('确认要解绑该主播吗？').then(() => {
        unbindAnchor(row.id).then(response => {
          this.$modal.msgSuccess("解绑成功");
          this.getBindAnchorList();
        });
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
        id: undefined,
        name: undefined,
        avatar: undefined,
        teamName: undefined,
        loginAccount: undefined,
        password: undefined,
        remark: undefined
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.name + '"吗？').then(() => {
        const updateData = {
          id: row.id,
          status: row.status
        };
        return updateOperationManager(updateData);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(() => {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加运营管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids[0];
      getOperationManager(id).then(response => {
        this.form = response.data;
        this.form.password = ""; // 清空密码
        this.open = true;
        this.title = "修改运营管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 如果是修改且密码为空，则不传密码字段
          if (this.form.id && !this.form.password) {
            const submitData = { ...this.form };
            delete submitData.password;
            updateOperationManager(submitData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            if (this.form.id) {
              updateOperationManager(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addOperationManager(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除运营管理编号为"' + ids + '"的数据项？').then(() => {
        return delOperationManager(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('admin/operationManager/export', {
        ...this.queryParams
      }, `operationManager_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

