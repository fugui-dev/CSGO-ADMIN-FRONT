<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
      label-width="68px"
      size="small"
    >
      <el-form-item label="饰品ID">
        <el-input v-model="queryParams.id" placeholder="请输入饰品ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="饰品名称">
        <el-input v-model="queryParams.name" placeholder="请输入饰品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="queryParams.type" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.ornaments_type_name"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="价格区间 ">
        <div style="width: 50%; display:flex;">
          <el-input v-model="queryParams.minPrice" placeholder="最小值" clearable></el-input>
          <div style="width: 50px; "></div>
          <el-input v-model="queryParams.maxPrice" placeholder="最大值" clearable></el-input>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
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
          type="primary"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['admin:ornamentsLevel:edit']"
          :disabled="single"
          icon="el-icon-edit"
          plain
          size="mini"
          type="success"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['admin:ornamentsLevel:remove']"
          :disabled="multiple"
          icon="el-icon-delete"
          plain
          size="mini"
          type="danger"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="levelList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="道具ID" prop="ornamentId" />
      <el-table-column align="center" label="道具名称" prop="ornamentName" />
      <el-table-column align="center" label="道具图片" prop="ornamentImgUrl">
        <template slot-scope="scope">
          <image-preview :src="scope.row.ornamentImgUrl" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="道具价格" prop="ornamentPrice" />
      <el-table-column align="center" label="道具类型" prop="typeName" />
      <el-table-column align="center" label="创建时间" prop="createTime" />
      <el-table-column align="center" label="更新时间" prop="updateTime" />
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleGrant(scope.row)">发放饰品</el-button>
          <el-button
            v-hasPermi="['admin:ornamentsLevel:edit']"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['admin:ornamentsLevel:remove']"
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="道具名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入饰品级别" />
        </el-form-item>
        <el-form-item label="道具价格" prop="usePrice">
          <el-input v-model="form.usePrice" placeholder="请输入饰品级别" />
        </el-form-item>
        <el-form-item label="道具类型" prop="usePrice">
          <el-select v-model="form.type" placeholder="请选择" clearable>
            <el-option
              v-for="dict in dict.type.ornaments_type_name"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
              @click.native="changeType(dict.label)"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="道具图片" prop="imageUrl">
          <image-upload v-model="form.imageUrl"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="道具发放" :visible.sync="dialogFormVisible">
      <el-form :model="forms" label-width="80px" :rules="ruless" ref="ruleFormfa">
        <el-form-item label="用户" prop="userId">
          <el-popover placement="bottom-start" width="460" trigger="hover" ref="morePop">
            <el-input
              slot="reference"
              v-model="forms.nickName"
              placeholder="用户 "
              readonly
              suffix-icon="el-icon-caret-bottom"
            ></el-input>
            <el-form>
              <el-row>
                <el-col :span="18">
                  <el-input
                    v-model="queryParams.nickName"
                    placeholder="请输入用户名称"
                    @input="serchornaments"
                  ></el-input>
                </el-col>
                <el-col :span="6">
                  <el-button @click="serchornaments" style="margin-left: 35px;">搜索</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-form v-loading="loadings" v-if="userList !== null">
                  <div class="magicbox" @scroll="scrollEventFn" v-if="userList.length > 0">
                    <div
                      class="magic"
                      v-for="(item,index) in userList"
                      :key="index"
                      @click="addOr(item)"
                    >
                      <div>{{item.nickName}}</div>
                      <div style="color: 8492a6;">{{item.phoneNumber}}</div>
                    </div>
                  </div>
                  <div v-else>
                    <div style="margin:0 auto; text-align:center; margin-top:10px;">无此用户</div>
                  </div>
                </el-form>
                <el-form v-else>
                  <div style="margin:0 auto; text-align:center; margin-top:10px;">请输入用户昵称</div>
                </el-form>
              </el-row>
            </el-form>
          </el-popover>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数量" prop="num">
              <el-input v-model="forms.num" placeholder="输入数量" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别" prop="ornamentsLevelId">
              <el-select v-model="forms.ornamentsLevelId" clearable placeholder="请选择级别">
                <el-option
                  v-for="item in listLevel"
                  :key="item.id"
                  :label="item.level"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancellation('ruleFormfa')">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('ruleFormfa')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addWebsiteProperty,
  delWebsiteProperty,
  getWebsitePropertyid,
  getWebsiteProperty,
  changeWebsiteProperty,
  grantOrnaments
} from "@/api/skins/ttOrnaments/api";
import { listLevel } from "@/api/skins/ttOrnamentsLevel/api";

import { listUser } from "@/api/skins/ttuser/api";
export default {
  dicts: [
    "shopping_isputaway_status",
    "ornaments_exterior_name",
    "ornaments_type_name"
  ],
  name: "Level",
  data() {
    return {
      forms: {
        userId: null,
        ornamentsId: null,
        num: null,
        nickName: null,
        level: null,
        ornamentsLevelId: null
      },
      formAdd: {
        num: null,
        ornamentsId: null,
        userId: null,
        ornamentsLevelId: null
      },
      dialogFormVisible: false,
      userList: [],
      loadings: false,
      listLevel: [],
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        level: null,
        levelImg: null,
        type:null,
        name: null,
        id:null
      },
      // 表单参数
      form: {},
      // 表单校验
      ruless: {
        userId: [
          { required: true, message: "请选择发放用户", trigger: "change" }
        ],
        ornamentsLevelId: [
          { required: true, message: "请选择饰品等级", trigger: "change" }
        ],
        num: [{ required: true, message: "请选择数量", trigger: "blur" }]
      },
      rules: {
        level: [
          { required: true, message: "道具级别不能为空", trigger: "blur" }
        ],
        itemName: [
          { required: true, message: "道具名称不能为空", trigger: "blur" }
        ],
        usePrice: [
          { required: true, message: "道具级别不能为空", trigger: "blur" }
        ],
        levelImg: [
          { required: true, message: "道具级别图片不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeType(label){
      this.form.typeName = label;
    },
    cancellation(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    scrollEventFn(e) {
      if (
        e.srcElement.scrollTop + e.srcElement.clientHeight >=
        e.srcElement.scrollHeight
      ) {
        this.queryParams.pageNum += 1;
        listUser(this.queryParams).then(res => {
          this.userList.push.apply(this.userList, res.rows);
        });
      }
    },
    addOr(res) {
      this.forms.nickName = "";
      this.forms.nickName = res.nickName;
      this.forms.userId = res.userId;
      this.$refs.morePop.doClose();
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
                addWebsiteProperty(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                });
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
    serchornaments() {
      this.loadings = true;
      listUser(this.queryParams).then(response => {
        this.userList = response.rows;
        this.loadings = false;
      });
      listLevel(this.queryParams).then(res => {
        this.listLevel = res.rows;
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
    /** 查询饰品级别数据列表 */
    getList() {
      this.loading = true;
      getWebsiteProperty(this.queryParams).then(response => {
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
      this.ids = selection.map(item => item.ornamentId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加饰品级别数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.ornamentId || this.ids;
      getWebsitePropertyid(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改饰品级别数据";
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.ornamentId || this.ids;
      this.$modal
        .confirm('是否确认删除饰品级别数据编号为"' + ids + '"的数据项？')
        .then(function() {
          return delWebsiteProperty(ids);
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
      background-color: #409eff;
      transition: all ease 0.3s;
    }
  }
}
</style>
