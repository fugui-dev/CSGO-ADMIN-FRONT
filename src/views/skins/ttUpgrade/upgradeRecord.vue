<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="recordList">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" :width="50" :height="50" />
        </template>
      </el-table-column>

      <el-table-column label="昵称" align="center" prop="nickName" />

      <el-table-column label="投入金额" align="center" prop="amountConsumed" />
      <el-table-column label="目标饰品" align="center">
        <el-table-column label="id" align="center" prop="targetOrnamentId" />
        <el-table-column label="名称" align="center" prop="targetOrnamentName" />
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <image-preview :src="scope.row.targetOrnamentImg	" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center" prop="targetOrnamentPrice" />
      </el-table-column>
      <el-table-column label="获得饰品" align="center">
        <el-table-column label="id" align="center">
          <template slot-scope="scope">
            {{JSON.parse(scope.row.gainOrnamentList)[0].ornamentId}}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            {{JSON.parse(scope.row.gainOrnamentList)[0].ornamentName}}
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <image-preview :src="JSON.parse(scope.row.gainOrnamentList)[0].ornamentImgUrl" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center">
          <template slot-scope="scope">
            {{JSON.parse(scope.row.gainOrnamentList)[0].ornamentPrice}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="开启时间" align="center" prop="openTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.openTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结果" align="center" prop="result">
        <template slot-scope="scope">
          {{ scope.row.isVictory ? "胜利" : "失败" }}
        </template>
      </el-table-column>
      <el-table-column label="利润" align="center" prop="profit" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改幸运升级记录数据对话框 -->
  </div>
</template>

<script>
import { getupgradeRecord } from "@/api/skins/ttUpgrade/api";

export default {
  name: "Record",
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
      // 幸运升级记录数据表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        userId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        amountConsumed: [
          { required: true, message: "消耗金额不能为空", trigger: "blur" }
        ],
        targetUpgradeId: [
          { required: true, message: "升级饰品列表ID不能为空", trigger: "blur" }
        ],
        targetOrnamentsId: [
          { required: true, message: "目标饰品ID不能为空", trigger: "blur" }
        ],
        targetOrnamentsPrice: [
          { required: true, message: "目标饰品价格不能为空", trigger: "blur" }
        ],
        gainUpgradeFailId: [
          {
            required: true,
            message: "升级失败奖励列表ID不能为空",
            trigger: "blur"
          }
        ],
        gainOrnamentsId: [
          { required: true, message: "获得饰品ID不能为空", trigger: "blur" }
        ],
        gainOrnamentsPrice: [
          { required: true, message: "获得饰品价格不能为空", trigger: "blur" }
        ],
        openTime: [
          { required: true, message: "开启时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询幸运升级记录数据列表 */
    getList() {
      this.loading = true;
      getupgradeRecord(this.queryParams).then(response => {
        this.recordList = response.data.records;
        this.total = response.data.total;
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
        userId: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
    // 多选框选中数据

    /** 新增按钮操作 */

    /** 修改按钮操作 */

    /** 提交按钮 */

    /** 删除按钮操作 */

    /** 导出按钮操作 */
  }
};
</script>
