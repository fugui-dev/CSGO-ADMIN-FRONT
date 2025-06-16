<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="渠道名称" prop="channelName">
        <el-input
          v-model="queryParams.channelName"
          placeholder="请输入渠道名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道域名" prop="channelDomain">
        <el-input
          v-model="queryParams.channelDomain"
          placeholder="请输入渠道域名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择启用状态" clearable>
          <el-option
            v-for="dict in dict.type.channel_enable_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['promotion:channel:add']"
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
          v-hasPermi="['promotion:channel:edit']"
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
          v-hasPermi="['promotion:channel:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-link"
          size="mini"
          @click="openTestView"
        >联调</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="channelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="渠道id" align="center" prop="id" width="80"/>
      <el-table-column label="渠道名称" align="center" prop="channelName" />
      <el-table-column label="渠道域名" align="center" prop="channelDomain" />
      <el-table-column label="百度token" align="center" prop="bdToken" />
<!--      <el-table-column label="登录密码" align="center" prop="password" />-->
      <el-table-column label="启用状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.channel_enable_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="报表" align="center" prop="status">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="lookReportInfo(scope.row)"
            v-hasPermi="['promotion:channel:query']"
          >查看报表</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="isFightType" label="启用开关">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value=1
            :inactive-value=0
            inactive-color="#D9534F"
            active-color="#5CB85C"
            inactive-text="是"
            active-text="否"
            @change="updateChannelStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="创建人" align="center" prop="createBy" />-->
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="更新人" align="center" prop="updateBy" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['promotion:channel:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['promotion:channel:remove']"
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

    <!-- 添加或修改推广渠道通道对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="渠道名称" prop="channelName">
          <el-input v-model="form.channelName" placeholder="请输入渠道名称" />
        </el-form-item>
        <el-form-item label="渠道域名" prop="channelDomain">
          <el-input v-model="form.channelDomain" placeholder="请输入渠道域名" />
        </el-form-item>
        <el-form-item label="百度token" prop="bdToken">
          <el-input v-model="form.bdToken" placeholder="请输入百度token" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="form.password" placeholder="输入则重置为新密码" />
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.channel_enable_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="渠道数据" :visible.sync="openReportView" width="500px" append-to-body>
      {{'注册用户：' + this.registerNum }}<br>
      {{'付费用户：' + this.firstChargeNum }}<br>
      {{'累计充值：' }}{{this.totalCharge == null ? 0 : this.totalCharge}}
    </el-dialog>


    <el-dialog title="联调测试" :visible.sync="openTestApiView" width="500px" append-to-body>
<!--      <el-form-item label="联调测试" prop="channelName">-->
      请在下方输入联调测试链接:
      <br><br><br>
      <el-input v-model="logidUrl" placeholder="联调之前请确认已经打开该域名的状态开关！" />
      <br><br><br>
      <el-button type="primary" @click="testApi">测试联调</el-button>
<!--      </el-form-item>-->
    </el-dialog>


  </div>
</template>

<script>
import { listChannel, getChannel, delChannel, addChannel, updateChannel , reportInfo , bdPromotionTestApi} from "@/api/skins/promotionChannel/api";

export default {
  name: "Channel",
  dicts: ['channel_enable_status'],
  data() {
    return {
      logidUrl: null,
      openTestApiView: false,
      registerNum: 0,
      firstChargeNum: 0,
      totalCharge: 0,
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
      // 推广渠道通道表格数据
      channelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openReportView: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        channelName: null,
        channelDomain: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    lookReportInfo(row){
      const id = row.id
      reportInfo(id).then(rsp=>{
        this.title = "渠道推广报表"
        this.openReportView = true;

        this.registerNum = rsp.data.registerNum;
        this.firstChargeNum = rsp.data.firstChargeNum;
        this.totalCharge = rsp.data.totalCharge;
      })


    },
    updateChannelStatus(res) {
      let data = res;
      updateChannel(data)
        .then(response => {
          this.$modal.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        })
        .catch(err => {
          this.getList();
        });
    },
    /** 查询推广渠道通道列表 */
    getList() {
      this.loading = true;
      listChannel(this.queryParams).then(response => {
        this.channelList = response.rows;
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
        id: null,
        channelName: null,
        channelDomain: null,
        bdToken: null,
        password: null,
        status: null,
        remark: null,
        createTime: null,
        updateTime: null,
        createBy: null,
        updateBy: null,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加推广渠道";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getChannel(id).then(response => {
        this.form = response.data;
        this.form.password = null;
        this.open = true;
        this.title = "修改推广渠道";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateChannel(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addChannel(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除推广渠道通道编号为"' + ids + '"的数据项？').then(function() {
        return delChannel(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('promotion/channel/export', {
        ...this.queryParams
      }, `channel_${new Date().getTime()}.xlsx`)
    },
    //联通测试百度api接口
    testApi(){
      if (this.logidUrl == null){
        this.$modal.msgWarning("请输入完整模拟的联调链接！");
        return;
      }
      let paramData = {
        "logidUrl" : this.logidUrl
      }
      bdPromotionTestApi(paramData).then(rsp=>{
        console.log("响应内容：", rsp)
        if (rsp.code == 200){
          this.openTestApiView = false;
          this.$modal.msgSuccess("联调成功！");
        }else {
          this.$modal.msgWarning(rsp.msg);
        }
      })

    },
    openTestView(){
      this.logidUrl = null;
      this.openTestApiView = true;
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
