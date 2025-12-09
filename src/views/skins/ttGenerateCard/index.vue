<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="卡密ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额" prop="rechargeListId">
        <el-select v-model="queryParams.rechargeListId" filterable placeholder="请选择金额" clearable>
          <el-option
            v-for="item in rechangeList"
            :key="item.id"
            :label="item.price"
            :value="item.id"
          >
            <span style="float: left">{{ item.price }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态" prop="status">
        <el-select v-model="queryParams.status">
          <el-option label="未使用" value="0"></el-option>
          <el-option label="已使用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡密" prop="password">
        <el-input
          v-model="queryParams.password"
          placeholder="请输入卡密"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="使用者ID" prop="useUserId">
        <el-input
          v-model="queryParams.useUserId"
          placeholder="请输入使用者ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主播ID" prop="parentId">
        <el-select v-model="queryParams.parentId" filterable placeholder="请选择主播" clearable>
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          >
            <span style="float: left">{{ item.nickName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
          </el-option>
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
          v-hasPermi="['admin:ornamentsLevel:add']"
          icon="el-icon-plus"
          plain
          size="mini"
          @click="handleAdd"
        >生成卡密</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['admin:ornamentsLevel:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['admin:ornamentsLevel:edit']"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="levelList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="卡密ID" prop="id" />
      <el-table-column align="center" label="卡密" prop="password" />
      <el-table-column align="center" label="金额" prop="price"></el-table-column>
      <el-table-column align="center" label="充值列表ID" prop="rechargeListId" />
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.status == 0" class="df">
              <span class="ds" style="background-color: #00a65a;"></span>
              未使用
            </div>
            <div v-if="scope.row.status == 1" class="df">
              <span class="ds" style="background-color: #dd4b39;"></span> 已使用
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用时间" prop="useTime" />
      <el-table-column align="center" label="使用者ID" prop="useUserId" />
      <el-table-column align="center" label="创建时间" prop="createTime" />
      <el-table-column align="center" label="创建者" prop="createBy" />
      <el-table-column align="center" label="更新时间" prop="updateTime" />
      <el-table-column align="center" label="更新者" prop="updateBy" />
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['admin:ornamentsLevel:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改饰品级别数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <div>
          <el-form-item label="生成数量" prop="num">
            <el-input-number v-model="form.num" :min="0" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="金额" prop="rechargeListId">
            <el-select v-model="form.rechargeListId" filterable placeholder="请选择充值列表ID" clearable>
              <el-option
                v-for="item in rechangeList"
                :key="item.id"
                :label="item.price"
                :value="item.id"
              >
                <span style="float: left">{{ item.price }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="kami" v-loading="loadingadd">
          <div v-for="(item,index ) in overList" :key="index" style=" margin-top:1px;">{{ item }}</div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')" v-if="status == 1">确 定</el-button>
        <el-button @click="cancel" v-if="status == 1">取 消</el-button>
        <el-button @click="cancel" v-if="status == 2">关 闭</el-button>
        <!-- <el-button @click="handleCopy" v-if="status == 2">复 制</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRechargeCard,
  addRechargeCard,
  delRechargeCard
} from "@/api/skins/ttGenerateCard/api";
import { getRechargeList } from "@/api/skins/ttRecharge/api";
import { listUser } from "@/api/skins/ttuser/api";
import { getInfo } from "@/api/login";
export default {
  dicts: [
    "shopping_isputaway_status",
    "ornaments_exterior_name",
    "ornaments_type_name"
  ],
  name: "Level",
  data() {
    return {
      loadingadd: false,
      status: 1,
      forms: {
        userId: null,
        ornamentsId: null,
        num: 0,
        nickName: null,
        level: null,
        ornamentsLevelId: null
      },
      // 表单校验
      //
      formAdd: {
        num: null,
        ornamentsId: null,
        userId: null,
        ornamentsLevelId: null
      },
      dialogFormVisible: false,
      userList: [],
      loadings: false,
      isSystemOperation: false, // 是否为system-operation角色
      types: {
        userType: "01",
        pageSize: 1000
      },
      rechangeList: [],
      rechangeParams: {
        pageNum: 1,
        pageSize: 99,
        status: 0
      },
      total: 1,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      overList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 饰品级别数据表格数据
      levelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        password: null,
        rechargeListId: null,
        status: null,
        useUserId: null,
        parentId: null
      },
      // 表单参数
      form: {
        num: 0
      },
      // 表单校验
      rules: {
        num: [{ required: true, message: "请输入生成数量", trigger: "change" }],
        rechargeListId: [
          { required: true, message: "请选择充值列表", trigger: "change" }
        ]
      },
      ruless: {
        userId: [
          { required: true, message: "请选择发放用户", trigger: "change" }
        ],
        ornamentsLevelId: [
          { required: true, message: "请选择饰品等级", trigger: "change" }
        ],
        num: [{ required: true, message: "请选择数量", trigger: "blur" }]
      }
    };
  },
  created() {
    this.checkUserRole();
    this.getList();
    this.getRechargeList();
    // 延迟获取用户列表，确保用户信息已加载
    this.$nextTick(() => {
      this.getUser();
    });
  },
  methods: {
    // 检查用户角色
    checkUserRole() {
      const roles = this.$store.getters.roles;
      // 角色是字符串数组，直接检查是否包含'system-operation'
      this.isSystemOperation = roles && roles.includes('system-operation');
      console.log('用户角色:', roles);
      console.log('是否为system-operation:', this.isSystemOperation);
    },
    
    // 获取主播列表
    getUser() {
      const queryParams = { ...this.types };
      
      // 如果是system-operation角色，添加parentId参数
      if (this.isSystemOperation) {
        // 调用/getInfo接口获取用户信息
        getInfo().then(res => {
          const userInfo = res.user;
          const currentUserId = userInfo && userInfo.userId;
          console.log('用户信息:', userInfo);
          console.log('当前用户ID:', currentUserId);
          
          if (currentUserId) {
            queryParams.parentId = currentUserId;
            console.log('添加parentId参数:', currentUserId);
          } else {
            console.log('用户ID为空，无法添加parentId参数');
          }
          
          console.log('查询主播列表参数:', queryParams);
          listUser(queryParams).then(res => {
            this.userList = res.rows;
            console.log('获取到的主播列表:', res.rows);
          });
        }).catch(error => {
          console.error('获取用户信息失败:', error);
          // 如果获取用户信息失败，仍然调用listUser但不添加parentId
          listUser(queryParams).then(res => {
            this.userList = res.rows;
            console.log('获取到的主播列表:', res.rows);
          });
        });
      } else {
        // 非system-operation角色，直接调用listUser
        console.log('查询主播列表参数:', queryParams);
        listUser(queryParams).then(res => {
          this.userList = res.rows;
          console.log('获取到的主播列表:', res.rows);
        });
      }
    },
    
    getRechargeList() {
      getRechargeList(this.rechangeParams).then(res => {
        this.rechangeList = res.rows;
      });
    },
    cancellation(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    /** 提交按钮 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs["form"].validate(valid => {
            if (valid) {
              if (this.form.id != null) {
                changeWebsiteProperty(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
              } else {
                this.loadingadd = true;
                addRechargeCard(this.form.rechargeListId, this.form.num).then(
                  response => {
                    this.loadingadd = false;
                    this.status = 2;
                    this.overList = response.data;
                    this.$modal.msgSuccess("新增成功");
                    // this.open = false;
                    this.getList();
                  }
                );
              }
            }
          });
        } else {
          return false;
        }
      });
    },

    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let a = {
            ornamentsLevelId: this.forms.ornamentsLevelId
          };
          grantOrnaments(
            a,
            this.forms.userId,
            this.forms.ornamentsId,
            this.forms.num
          ).then(res => {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.forms = {
              nickName: null,
              userId: null,
              ornamentsId: null,
              num: null
            };
            this.dialogFormVisible = false;
            this.getList();
          });
        } else {
          return false;
        }
      });
    },
    handleGrant(res) {
      this.forms = {
        userId: null,
        ornamentsId: null,
        num: null,
        nickName: null,
        level: null,
        ornamentsLevelId: null
      };
      this.serchornaments();
      this.dialogFormVisible = true;
      this.forms.ornamentsId = res.id;
    },
    getList() {
      this.loading = true;
      
      const queryParams = { ...this.queryParams };
      
      // 如果是system-operation角色且主播列表不为空，添加useUserList参数
      if (this.isSystemOperation && this.userList.length > 0) {
        queryParams.useUserList = this.userList.map(item => item.userId);
        console.log('添加useUserList参数:', queryParams.useUserList);
      } else if (this.isSystemOperation && this.userList.length === 0) {
        console.log('主播列表为空，不查询卡密记录');
        this.levelList = [];
        this.total = 0;
        this.loading = false;
        return;
      }
      
      console.log('查询卡密记录参数:', queryParams);
      getRechargeCard(queryParams).then(response => {
        this.levelList = response.rows;
        this.total = response.total;
        this.loading = false;
        console.log('获取到的卡密记录:', response.rows);
      });
    },

    handleExport() {
      this.download(
        "/admin/rechargeCard/export",
        {
          ...this.queryParams
        },
        `卡密_${new Date().getTime()}.txt`
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        num: 0
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
      this.queryParams.parentId = null;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.status = 1;
      this.overList = [];
      this.reset();
      this.open = true;
      this.title = "生成卡密";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除卡密编号为"' + ids + '"的数据项？').then(() => {
        return delRechargeCard(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
};
</script>
<style scoped lang="scss">
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
.kami {
  padding: 15px;
  background-color: #c3d1e4;
  color: #373232;
  border: 1px solid #8492a6;
  width: 95%;
  margin: 0 auto;
}
.ds {
  width: 8px;
  height: 8px;
  margin-right: 10px;
  border-radius: 50%;
  display: inline-block;
}
.df {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
