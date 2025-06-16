<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button plain size="mini" @click="handleAdd" v-hasPermi="['system:ornaments:add']">批量添加</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="ornamentsList">
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="饰品ID" align="center" prop="ornamentId"></el-table-column>
      <el-table-column label="图片" align="center" prop="imageUrl">
        <template slot-scope="scope">
          <image-preview :src="scope.row.imageUrl" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" prop="itemName" />
      <el-table-column label="价格" align="center" prop="usePrice" />
      <el-table-column label="级别" align="center" prop="level">
        <template slot-scope="scope">
          <el-popover placement="top" popper-class="layout">
            <div style="text-align: center;">
              <el-row>
                <el-col :span="18">
                  <el-select v-model="scope.row.ornamentLevelId" placeholder="请选择颜色">
                    <el-option
                      v-for="item in levelList"
                      :key="item.id"
                      :label="item.level"
                      :value="item.id"
                      @change="handleChangeType(scope.row)"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <div style="text-align: right; margin: 0;line-height:36px">
                    <el-button size="mini" type="text" @click="handleR">取消</el-button>
                    <el-button type="text" size="mini" @click="handleChangeType(scope.row)">确定</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>

            <el-button
              slot="reference"
              type="text"
              class="under"
              icon="el-icon-edit"
            >{{ scope.row.level }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="typeName"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="更新时间" align="center" prop="updateTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:ornaments:remove']"
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

    <!-- 添加或修改幸运升级失败奖励数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="升级饰品列表ID" prop="upgradeId">
          <el-input v-model="form.upgradeId" placeholder="请输入升级饰品列表ID" />
        </el-form-item>
        <el-form-item label="失败奖励饰品ID" prop="ornamentId">
          <el-input v-model="form.ornamentId" placeholder="请输入失败奖励饰品ID" />
        </el-form-item>
        <el-form-item label="饰品级别ID" prop="ornamentLevelId">
          <el-input v-model="form.ornamentLevelId" placeholder="请输入饰品级别ID" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量填货" :visible.sync="dialogFormVisible" width="85%">
      <el-tabs v-model="activeName" type="card" @tab-click="tabclick">
        <el-tab-pane label="选择饰品" name="first">
          <el-form ref="queryForm" :inline="true" :model="orform" label-width="68px" size="small">
            <el-row>
              <el-col :span="4">
                <el-form-item label="饰品ID" class="orform">
                  <el-input v-model="orform.id" placeholder="请输入饰品ID" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="饰品名称" class="orform">
                  <el-input v-model="orform.name" placeholder="请输入饰品名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="外观" class="orform">
                  <el-select v-model="orform.exterior" placeholder="请选择" clearable>
                    <el-option
                      v-for="dict in dict.type.ornaments_exterior_name"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="类型" class="orform">
                  <el-select v-model="orform.type" placeholder="请选择" clearable>
                    <el-option
                      v-for="dict in dict.type.ornaments_type_name"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="价格区间 " class="orform max">
                  <div style="display:flex;">
                    <el-input v-model="orform.minPrice" placeholder="最小值" clearable></el-input>
                    <div style="width: 50px; "></div>
                    <el-input v-model="orform.maxPrice" placeholder="最大值" clearable></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button
                    icon="el-icon-search"
                    size="mini"
                    type="primary"
                    @click="orhandleClick"
                  >搜索</el-button>
                  <el-button icon="el-icon-refresh" size="mini" @click="orresetQuery">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-table
            :data="orList"
            style="width: 100%"
            @selection-change="selectPrize"
            v-loading="loadings"
          >
            <el-table-column align="center" type="selection" width="55" fixed></el-table-column>
            <el-table-column align="center" prop="name" label="名称" width="350"></el-table-column>
            <el-table-column align="center" prop="usePrice" label="价格"></el-table-column>
            <el-table-column align="center" prop="quantity" label="在售数量"></el-table-column>
            <el-table-column align="center" label="外观名称" prop="exteriorName">
              <template slot-scope="scope">{{ scope.row.exteriorName || '无涂装' }}</template>
            </el-table-column>
            <el-table-column align="center" label="稀有度">
              <template slot-scope="scope">
                <el-tag
                  :color="scope.row.rarityColor"
                  style="color: #fff;"
                >{{ scope.row.rarityName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="封面">
              <template slot-scope="scope">
                <image-preview :src="scope.row.imageUrl" :width="50" :height="50" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="类型">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.typeName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="更新时间" prop="updateTime" />
          </el-table>

          <pagination
            v-show="ortotal>0"
            :limit.sync="orform.pageSize"
            :page.sync="orform.pageNum"
            :total="ortotal"
            @pagination="serchornaments"
          />
        </el-tab-pane>
        <el-tab-pane label="选择道具" name="second" v-if="false">
          <el-table
            :data="orList"
            style="width: 100%"
            @selection-change="selectPrize"
            v-loading="loadings"
          >
            <el-table-column align="center" type="selection" width="55" fixed></el-table-column>
            <el-table-column align="center" label="道具名称" prop="itemName" />
            <el-table-column align="center" label="道具图片" prop="levelImg">
              <template slot-scope="scope">
                <image-preview :src="scope.row.imageUrl" :width="50" :height="50" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="道具价格" prop="usePrice" />
            <el-table-column align="center" label="创建时间" prop="createTime" />
          </el-table>

          <pagination
            v-show="ortotal>0"
            :limit.sync="orform.pageSize"
            :page.sync="orform.pageNum"
            :total="ortotal"
            @pagination="serchornaments"
          />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitone(false)">单个应用</el-button>
        <el-button type="primary" @click="handleSubmitone(true)">应用到所有</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFail, delFail, addFail, upFail } from "@/api/skins/ttUpgrade/api";
import { listOrnaments, getWebsiteProperty } from "@/api/skins/ttOrnaments/api";
import { listLevel } from "@/api/skins/ttOrnamentsLevel/api";

export default {
  dicts: [
    "shopping_isputaway_status",
    "ornaments_exterior_name",
    "ornaments_type_name"
  ],
  data() {
    return {
      orform: {
        itemName: null,
        pageNum: 1,
        pageSize: 10
      },
      ortotal: 1,
      activeName: "first",

      dialogFormVisible: false,
      // 遮罩层
      loading: true,
      loadings: true,
      // 选中数组
      ids: [],
      orList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 幸运升级失败奖励数据表格数据
      ornamentsList: [],
      levelList: [],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        upgradeOrnamentId: this.$route.query.id,
        id: this.$route.query.id
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        upgradeId: [
          { required: true, message: "升级饰品列表ID不能为空", trigger: "blur" }
        ],
        ornamentId: [
          { required: true, message: "失败奖励饰品ID不能为空", trigger: "blur" }
        ],
        ornamentLevelId: [
          { required: true, message: "饰品级别ID不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleR() {
      document.body.click();
      this.getList();
    },
    handleChangeType(res) {
      let data = res;
      upFail(data)
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
    serchprop() {
      this.loadings = true;
      getWebsiteProperty(this.orform).then(res => {
        this.orList = res.rows;
        this.loadings = false;
        this.ortotal = res.total;
      });
    },
    serchornaments() {
      this.loadings = true;
      listOrnaments(this.orform).then(res => {
        this.orList = res.data.records;
        this.loadings = false;
        this.ortotal = res.data.total;
      });
    },
    orhandleClick() {
      if (this.activeName == "first") {
        this.serchornaments();
      } else if (this.activeName == "second") {
        this.serchprop();
      } else {
        return;
      }
    },
    orresetQuery() {
      this.orform = {};
      if (this.activeName == "first") {
        this.serchornaments();
      } else if (this.activeName == "second") {
        this.serchprop();
      } else {
      }
    },
    selectPrize(selection) {
      this.prizeIds = selection.map(item => item.id);
    },
    tabclick() {
      // alert("66");
      if (this.activeName == "first") {
        this.serchornaments();
      } else if (this.activeName == "second") {
        this.serchprop();
      } else {
        return;
      }
    },
    handleSubmitone(allFlag) {
      console.log(this.queryParams.id)
      let data = {
        upgradeId: this.queryParams.id,
        ornamentsIds: this.prizeIds,
        useAllFlag : allFlag
      }
      addFail(data).then(res => {
        this.dialogFormVisible = false;
        this.$modal.msgSuccess("添加成功");
        this.getList();
      });
    },

    /** 查询幸运升级失败奖励数据列表 */
    getList() {
      this.loading = true;
      getFail(this.queryParams).then(response => {
        this.ornamentsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listLevel(this.queryParams).then(response => {
        this.levelList = response.rows;
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
        upgradeId: null,
        ornamentId: null,
        ornamentLevelId: null,
        createTime: null,
        updateTime: null,
        ornamentsIds: [],
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
      this.dialogFormVisible = true;

      if (this.activeName == "first") {
        this.serchornaments();
      } else if (this.activeName == "second") {
        this.serchprop();
      } else {
        return;
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      //   getOrnaments(id).then(response => {
      //     this.form = response.data;
      //     this.open = true;
      //     this.title = "修改幸运升级失败奖励数据";
      //   });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            upFail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFail(this.form).then(response => {
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
      this.$modal
        .confirm(
          '是否确认删除幸运升级失败奖励数据编号为"' + ids + '"的数据项？'
        )
        .then(function() {
          return delFail(ids);
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
        "system/ornaments/export",
        {
          ...this.queryParams
        },
        `ornaments_${new Date().getTime()}.xlsx`
      );
    }
  }
};
</script>
