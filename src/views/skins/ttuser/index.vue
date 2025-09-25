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
      <el-form-item label="用户ID" prop="userName">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户类型" prop="userType">
        <el-select v-model="queryParams.userType" placeholder="请选择用户类型" clearable>
          <el-option
            v-for="dict in dict.type.user_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择用户状态" clearable>
          <el-option
            v-for="dict in dict.type.user_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邀请码" prop="invitationCode">
        <el-input
          v-model="queryParams.invitationCode"
          placeholder="请输入邀请码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上级ID" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入上级ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推广渠道id" prop="bdChannelId">
        <el-input
          v-model="queryParams.bdChannelId"
          placeholder="请输入推广渠道id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否结算主播佣金" prop="commissionRate">
        <el-select v-model="queryParams.commissionRate" placeholder="是否结算主播佣金" clearable>
          <el-option key="1" label="是" value="1" />
          <el-option key="0" label="否" value="0" />

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
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['admin:user:edit']"
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
          v-hasPermi="['admin:user:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['admin:user:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          icon="el-icon-circle-plus-outline"
          type="success"
          size="mini"
          @click="addNewUser = true"
        >生成账号</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="ID" align="center" prop="userId" />
      <el-table-column label="用户昵称" align="center" prop="nickName" />
      <el-table-column label="头像" align="center" prop="avatar">
        <template slot-scope="scope">
          <image-preview :src="scope.row.avatar" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center" prop="phoneNumber" />
      <el-table-column label="上级" align="center" prop="parentId" />
      <el-table-column label="邀请码" align="center" prop="invitationCode" />
      <el-table-column label="用户类型" align="center" prop="userType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_type" :value="scope.row.userType" />
        </template>
      </el-table-column>
      <el-table-column label="返佣比例" align="center" prop="commissionRate" :formatter="changeToPercentage"/>
      <el-table-column label="账户金额" align="center" prop="accountAmount" />
      <el-table-column label="账户弹药" align="center" prop="accountCredits" />
      <el-table-column label="帐号状态" align="center" prop="status" class="kg">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="'1'"
            :inactive-value="'0'"
            active-color="#D9534F"
            inactive-color="#5CB85C"
            active-text="正常"
            inactive-text="停用"
            @change="updateUserStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="提货状态" align="center" prop="deliveryStatus" class="kg">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.deliveryStatus"
            :active-value="'1'"
            :inactive-value="'0'"
            active-color="#D9534F"
            inactive-color="#5CB85C"
            active-text="启用"
            inactive-text="禁用"
            @change="updateUserStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="主播充值" align="center" prop="autoRecharge" class="kg">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.autoRecharge"
            :active-value="0"
            :inactive-value="1"
            active-color="#D9534F"
            inactive-color="#5CB85C"
            active-text="启用"
            inactive-text="禁用"
            @change="updateUserStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="主播秀" align="center" prop="autoRecharge" class="kg">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isAnchorShow"
            :active-value=false
            :inactive-value=true
            active-color="#D9534F"
            inactive-color="#5CB85C"
            active-text="启用"
            inactive-text="禁用"
            @change="updateUserStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="推广等级" align="center" prop="promotionLevel">
        <template slot-scope="scope">LV{{scope.row.promotionLevel }}</template>
      </el-table-column>
      <el-table-column label="VIP等级" align="center" prop="vipLevel">
        <template slot-scope="scope">VIP{{scope.row.vipLevel }}</template>
      </el-table-column>
      <el-table-column label="最后登录IP" align="center" prop="loginIp" />
      <el-table-column label="最后登录时间" align="center" prop="loginDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleCount(scope.row)">统计</el-button>
          <el-button size="mini" type="text" @click="handlePsack(scope.row)">背包</el-button>
          <el-dropdown size="mini">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-hasPermi="['admin:user:edit']"
                @click.native="handleUpdate(scope.row)"
              >修改</el-dropdown-item>
              <el-dropdown-item
                v-hasPermi="['admin:user:remove']"
                @click.native="handleView(scope.row)"
              >详情</el-dropdown-item>
              <el-dropdown-item
                v-hasPermi="['admin:user:remove']"
                @click.native="handleDelete(scope.row)"
              >删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 生成账号 -->
    <el-dialog title="新增用户" :visible.sync="addNewUser" width="600px">
      <el-form>
        <el-form-item label="请选择数量:" style="margin-bottom: 2px;">
          <el-input-number size="mini" v-model="newNumber" :min="1" :max="10" label="描述文字"></el-input-number>
        </el-form-item>
        <div style="font-size:14px;color:#797979;">
          <i class="el-icon-info"></i> 要生成的账号数量
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addNewUser = false">取 消</el-button>
        <el-button type="primary" @click="generateAccount">确 定</el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改注册用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择用户类型">
            <el-option
              v-for="dict in dict.type.user_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item label="头像地址" prop="avatar">
          <image-upload v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号码"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="账户金额" prop="accountAmount">
          <el-input v-model="form.accountAmount" placeholder="请输入账户金额" />
        </el-form-item>
        <el-form-item label="账户弹药" prop="accountCredits">
          <el-input v-model="form.accountCredits" placeholder="请输入账户弹药" />
        </el-form-item>
        <el-form-item label="用户邀请码" prop="invitationCode">
          <el-input v-model="form.invitationCode" placeholder="请输入用户邀请码" />
        </el-form-item>

        <el-form-item label="上级ID" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入上级ID" />
        </el-form-item>
        <el-form-item label="steam交易链接" prop="transactionLink">
          <el-input v-model="form.transactionLink" placeholder="请输入steam交易链接" />
        </el-form-item>
        <el-form-item label="实名认证状态" prop="isRealCheck">
          <el-radio-group v-model="form.isRealCheck">
            <el-radio :label="'1'">已实名</el-radio>
            <el-radio :label="'0'">未实名</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="佣金(1%=0.01)" prop="commissionRate">
          <el-input v-model="form.commissionRate" placeholder="请输入佣金比例" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 用户详情 -->
    <el-dialog title="用户详情" :visible.sync="openView" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户ID：">{{ form.userId }}</el-form-item>
            <el-form-item label="账号：">{{ form.userName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称：">{{ form.nickName }}</el-form-item>
            <el-form-item label="密码：">{{ form.remark }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码：">{{ form.phoneNumber }}</el-form-item>
            <el-form-item label="用户邮箱：">{{ form.email }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户类型：" prop="userType">
              <span v-if="form.userType === '00'">系统用户</span>
              <span v-if="form.userType === '01'">主播</span>
              <span v-if="form.userType === '02'">普通用户</span>
            </el-form-item>
            <el-form-item label="用户状态：">
              <span v-if="form.status === '0'">正常</span>
              <span v-if="form.status === '1'">停用</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="余额：">{{ form.accountAmount }}</el-form-item>
            <el-form-item label="弹药：">{{ form.accountCredits }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邀请码：">{{ form.invitationCode }}</el-form-item>
            <el-form-item label="上级：">{{ form.parentId }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="steamId：">{{ form.steamId }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="steam交易链接：">{{ form.transactionLink }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名：">{{ form.realName }}</el-form-item>
            <el-form-item label="身份证号：">{{ form.idNum }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实名流程号：">{{ form.certifyId }}</el-form-item>
            <el-form-item label="是否实名：">
              <span v-if="form.isRealCheck === '0'">未实名</span>
              <span v-if="form.isRealCheck === '1'">已实名</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后登录ip：">{{ form.loginIp }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后登录时间：">{{ form.loginDate }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建自：">{{ form.createBy }}</el-form-item>
            <el-form-item label="注册时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新自：">{{ form.updateBy }}</el-form-item>
            <el-form-item label="更新时间：">{{ form.updateTime }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openView = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 统计 -->
    <el-dialog title="用户利润统计" :visible.sync="countVisible" width="600px">
      <el-row style="display: flex;   justify-content: center;">
        <div id="main"></div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  updateUser,
  generateAccount,
  getUserProfitStatistics
} from "@/api/skins/ttuser/api";
import { getInfo } from "@/api/login";
import * as echarts from "echarts";

export default {
  name: "User",
  dicts: ["user_type", "user_status"],
  data() {
    return {
      countVisible: false,
      openView: false,
      newNumber: 1,
      addNewUser: false,
      isSystemOperation: false, // 是否为system-operation角色
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
        status: null,
        certifyId: null,
        userId: null,
        userName: null,
        userType: null,
        bdChannelId: null,
        commissionRate: null
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
    this.checkUserRole();
    this.getList();
  },
  methods: {
    // 检查用户角色
    checkUserRole() {
      const roles = this.$store.getters.roles;
      this.isSystemOperation = roles && roles.includes('system-operation');
      console.log('用户角色:', roles);
      console.log('是否为system-operation:', this.isSystemOperation);
    },
    
    initEcharts(res) {
      var chartDom = document.getElementById("main");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        xAxis: {
          type: "category",
          data: []
        },
        legend: {
          data: ["日出货总金额", "日开启次数", "日利润"]
        },
        tooltip: {
          trigger: "axis"
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [res.totalRecharge],
            type: "bar",
            name: "总充值",
            label: {
              show: true,
              position: "top",
              formatter: "总充值：" + "{c}"
            }
          },
          {
            data: [res.totalDelivery],
            type: "bar",
            name: "总提货",

            label: {
              show: true,
              position: "top",
              formatter: "提货：" + "{c}"
            }
          },
          {
            data: [res.totalProfit],
            type: "bar",
            name: "总利润",
            label: {
              show: true,
              position: "top",
              formatter: "总利润：" + "{c}"
            }
          }
        ]
      };

      option && myChart.setOption(option);
    },
    handleCount(res) {
      this.countVisible = true;
      getUserProfitStatistics(res.userId).then(res => {
        this.initEcharts(res.data);
      });
    },
    handlePsack(res) {
      this.$router.push({
        path: "/user/userPack",
        query: {
          id: res.userId,
          status: 0
        }
      });
    },
    handleView(res) {
      this.form = [];
      this.openView = true;
      getUser(res.userId).then(response => {
        this.form = response.data;
      });
    },
    /* 生成账号 */
    generateAccount() {
      generateAccount(this.newNumber).then(res => {
        this.getList();
        (this.newNumber = null), (this.addNewUser = false);
        const blob = new Blob([res], {
          type: "text/plain;charset=utf-8"
        });
        const objectURL = URL.createObjectURL(blob);
        const aTag = document.createElement("a");
        aTag.href = objectURL;
        aTag.download = `账号数据_${new Date().getTime()}.txt`;
        aTag.click();
        URL.revokeObjectURL(objectURL);
      });
    },
    /** 查询注册用户列表 */
    getList() {
      this.loading = true;
      
      const queryParams = { ...this.queryParams };
      
      // 如果是system-operation角色，添加parentId参数并设置pageSize为1000
      if (this.isSystemOperation) {
        queryParams.pageSize = 1000; // 设置pageSize为1000
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
          
          console.log('查询用户列表参数:', queryParams);
          listUser(queryParams).then(response => {
            this.userList = response.rows;
            this.total = response.total;
            this.loading = false;
            console.log('获取到的用户列表:', response.rows);
          });
        }).catch(error => {
          console.error('获取用户信息失败:', error);
          listUser(queryParams).then(response => {
            this.userList = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        });
      } else {
        console.log('查询用户列表参数:', queryParams);
        listUser(queryParams).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }
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
        idNum: null,
        certifyId: null,
        isRealCheck: null,
        loginIp: null,
        loginDate: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        delFlag: null
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
      this.ids = selection.map(item => item.userId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改用户状态操作 */
    updateUserStatus(row) {
      this.loading = true;
      updateUser(row).then(res => {
        this.$notify({
          title: "成功",
          message: "修改成功",
          type: "success"
        });
        this.getList();
        this.loading = false;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改注册用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != null) {
            updateUser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal
        .confirm('是否确认删除注册用户编号为"' + userIds + '"的数据项？')
        .then(function() {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "admin/user/export",
        {
          ...this.queryParams
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    changeToPercentage(row, column){
      var data1 = (row[column.property] * 100)+"%"
      return data1
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
#main {
  width: 500px;
  height: 400px;
}
</style>
