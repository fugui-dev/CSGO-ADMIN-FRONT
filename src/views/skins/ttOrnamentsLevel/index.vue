<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-hasPermi="['admin:ornamentsLevel:add']" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['admin:ornamentsLevel:edit']"
          plain
          size="mini"
          @click="handleReset"
        >重置</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="levelList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="饰品级别ID" prop="id" />
      <el-table-column align="center" label="饰品级别" prop="level" />
      <el-table-column align="center" label="饰品级别图片" prop="levelImg">
        <template slot-scope="scope">
          <image-preview :src="scope.row.levelImg" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['admin:ornamentsLevel:edit']"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
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
    <el-dialog :title="title" :visible.sync="open1" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="饰品级别" prop="level">
          <el-input v-model="form.level" placeholder="请输入饰品级别" />
        </el-form-item>
        <el-form-item label="饰品级别图片" prop="levelImg">
          <image-upload v-model="form.levelImg" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="open">
      <el-form :model="form" v-if="title=='新增'">
        <el-form-item label="最大饰品等级" :label-width="formLabelWidth">
          <el-input-number v-model="form.num" controls-position="right" :min="0" :max="10000"></el-input-number>
        </el-form-item>
      </el-form>
      <el-form :model="form" v-if="title=='修改'">
        <el-form-item label="饰品等级" :label-width="formLabelWidth">
          <el-input v-model="form.level" autocomplete="off" placeholder="请输入饰品等级"></el-input>
        </el-form-item>
        <el-form-item label="饰品图标" :label-width="formLabelWidth">
          <image-upload v-model="form.levelImg" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button v-if="title=='新增'" type="primary" @click="submitForm()">确 定</el-button>
        <el-button v-if="title=='修改'" type="primary" @click="submitForms()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addLevel,
  getLevel,
  listLevel,
  updateLevel,
  resetLevel
} from "@/api/skins/ttOrnamentsLevel/api";

export default {
  dicts: [
    "shopping_isputaway_status",
    "ornaments_exterior_name",
    "ornaments_type_name"
  ],
  name: "Level",
  data() {
    return {
      formLabelWidth: "120px",
      total: "新增",
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
      // 饰品级别数据表格数据
      levelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      open1: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        level: null,
        levelImg: null
      },
      // 表单参数
      form: {
        level: 0
      },
      // 表单校验
      rules: {
        level: [
          { required: true, message: "饰品级别不能为空", trigger: "blur" }
        ],
        levelImg: [
          { required: true, message: "饰品级别图片不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleReset() {
      this.$modal
        .confirm("是否确认重置饰品等级列表数据？")
        .then(() => {
          resetLevel().then(res => {
            this.getList();
          });
          this.$modal.msgSuccess("重置成功");
        })
        .catch(() => {
          this.getList();
        });
    },
    /** 查询饰品级别数据列表 */
    getList() {
      this.loading = true;
      listLevel(this.queryParams).then(response => {
        this.levelList = response.rows;
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
        level: null,
        levelImg: null
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = "修改";
      this.reset();
      const id = row.id || this.ids;
      getLevel(id).then(response => {
        this.form = response.data;
        this.open = true;
      });
    },
    /** 提交按钮 */
    submitForms() {
      updateLevel(this.form).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.open = false;
        this.getList();
      });
    },
    submitForm() {
      addLevel(this.form.num).then(response => {
        this.$modal.msgSuccess("新增成功");
        this.open = false;
        this.getList();
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除饰品级别数据编号为"' + ids + '"的数据项？')
        .then(function() {
          return delLevel(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    }
  }
};
</script>
