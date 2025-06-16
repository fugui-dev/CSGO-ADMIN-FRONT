<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button plain size="mini" @click="handleAdd" v-hasPermi="['system:bonus:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:bonus:edit']"
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
          v-hasPermi="['system:bonus:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:bonus:export']"
        >导出</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bonusList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="福利ID" align="center" prop="id" />
      <el-table-column label="福利名称" align="center" prop="name" />
      <el-table-column label="封面图片" align="center" prop="coverPicture">
        <template slot-scope="scope">
          <image-preview :src="scope.row.coverPicture" :width="50" :height="50" />
        </template>
      </el-table-column>

      <el-table-column label="充值门槛" align="center" prop="rechargeThreshold" />
      <el-table-column label="奖励区间" align="center" prop="awardSection" />
      <el-table-column label="启用状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="'0'"
            :inactive-value="'1'"
            inactive-color="#D9534F"
            active-color="#5CB85C"
            inactive-text="是"
            active-text="否"
            @change="updateUserStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sortBy" />
      <el-table-column label="条件类型" align="center" prop="conditionType">
        <template slot-scope="scope">
          <div v-if="scope.row.conditionType == '0'" class="df">
            <span class="ds" style="background: #00a65a;"></span>
            日充值
          </div>
          <div v-if="scope.row.conditionType == '1'" class="df">
            <span class="ds" style="background: #00a65a;"></span>
            周充值
          </div>
          <div v-if="scope.row.conditionType == '2'" class="df">
            <span class="ds" style="background: #f39c12;"></span>
            月充值
          </div>
          <div v-if="scope.row.conditionType == '3'" class="df">
            <span class="ds" style="background: #DD4B39;"></span>
            总充值
          </div>
          <div v-if="scope.row.conditionType == '4'" class="df">
            <span class="ds" style="background: #DD4B39;"></span>
            单笔充值
          </div>
        </template>
      </el-table-column>
      <el-table-column label="福利描述" align="center" prop="description" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="更新时间" align="center" prop="updateTime" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:bonus:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:bonus:remove']"
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

    <!-- 添加或修改福利数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="福利名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入福利名称" />
        </el-form-item>

        <el-form-item label="封面图片" prop="coverPicture">
          <image-upload v-model="form.coverPicture" />
          <!-- <el-input v-model="form.coverPicture" placeholder="请输入封面图片" /> -->
        </el-form-item>
        <el-form-item label="充值门槛" prop="rechargeThreshold">
          <el-input v-model="form.rechargeThreshold" placeholder="请输入充值门槛" />
        </el-form-item>

        <el-form-item label="奖励区间" prop="awardSectionmin">
          <el-row>
            <el-col :span="10">
              <el-input
                v-model="form.awardSectionmin"
                placeholder="请输入最小值"
                @input="change($event)"
              />
            </el-col>
            <el-col :span="1" style="text-align: center;">-</el-col>
            <el-col :span="10">
              <el-form-item prop="awardSectionmax">
                <el-input
                  v-model="form.awardSectionmax"
                  placeholder="请输入最大值"
                  @input="change($event)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="条件类型" prop="conditionType">
          <el-select v-model="form.conditionType" placeholder="请选择条件类型" clearable>
            <el-option
              v-for="dict in dict.type.sys_bonus_conditiontype"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="sortBy">
          <el-radio-group v-model="form.status" size="small">
            <el-radio-button label="0">启用</el-radio-button>
            <el-radio-button label="1">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="福利描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入福利描述" />
        </el-form-item>
        <el-form-item label="排序依据" prop="sortBy">
          <el-input-number v-model="form.sortBy" :step="1" :min="0" size="mini"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBonus,
  addBonus,
  getBonusid,
  delBonus,
  updateBonus
} from "@/api/skins/ttBonus/api";

export default {
  name: "Bonus",
  dicts: ["sys_bonus_conditiontype"],
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
      // 福利数据表格数据
      bonusList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        description: null,
        coverPicture: null,
        type: 2,
        conditionType: null,
        rechargeThreshold: null,
        awardSection: null,
        status: null,
        sortBy: null
      },
      // 表单参数
      form: { type: 2, status: "'0'" },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "福利名称不能为空", trigger: "blur" }
        ],
        conditionType: [
          { required: true, message: "条件类型不能为空", trigger: "change" }
        ],
        rechargeThreshold: [
          { required: true, message: "充值门槛不能为空", trigger: "blur" }
        ],
        awardSectionmin: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        awardSectionmax: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        status: [
          { required: true, message: "启用状态不能为空", trigger: "change" }
        ],
        createBy: [
          { required: true, message: "创建者不能为空", trigger: "blur" }
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
    updateUserStatus(res) {
      // res.coverPicture = "";
      let aa = JSON.parse(res.awardSection);

      res.awardSection = "[" + aa[0] + "," + aa[1] + "]";
      this.form = res;
      updateBonus(this.form)
        .then(response => {
          this.$modal.msgSuccess("修改成功");
          this.getList();
        })
        .catch(res => {
          this.getList();
        });
    },

    change(e) {
      this.$forceUpdate();
    },
    /** 查询福利数据列表 */
    getList() {
      this.loading = true;
      getBonus(this.queryParams).then(response => {
        this.bonusList = response.rows;
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
        name: null,
        description: null,
        coverPicture: null,
        type: null,
        conditionType: null,
        rechargeThreshold: null,
        awardSection: null,
        status: null,
        sortBy: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
      this.title = "添加福利数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBonusid(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改福利数据";

        this.form.awardSection = JSON.parse(response.data.awardSection);
        this.form.awardSectionmin = this.form.awardSection[0];
        this.form.awardSectionmax = this.form.awardSection[1];
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.awardSection =
              "[" +
              this.form.awardSectionmin +
              "," +
              this.form.awardSectionmax +
              "]";
            updateBonus(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.awardSection =
              "[" +
              this.form.awardSectionmin +
              "," +
              this.form.awardSectionmax +
              "]";
            addBonus(this.form).then(response => {
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
        .confirm('是否确认删除福利数据编号为"' + ids + '"的数据项？')
        .then(function() {
          return delBonus(ids);
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
        "system/bonus/export",
        {
          ...this.queryParams
        },
        `bonus_${new Date().getTime()}.xlsx`
      );
    }
  }
};
</script>
<style scoped lang="scss">
.df {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.ds {
  width: 8px;
  height: 8px;
  margin-right: 10px;
  border-radius: 50%;
  display: inline-block;
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
