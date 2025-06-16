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
        <el-input v-model="queryParams.itemName" placeholder="请输入饰品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="外观">
        <el-select v-model="queryParams.exterior" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.ornaments_exterior_name"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['admin:ornaments:export']"
          icon="el-icon-download"
          plain
          size="mini"
          type="warning"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ornamentsList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="饰品ID" prop="id" width="100" />
      <el-table-column align="center" label="饰品名称" prop="name" width="300" />
      <el-table-column align="center" label="外观名称" prop="exteriorName">
        <template slot-scope="scope">{{ scope.row.exteriorName || '无涂装' }}</template>
      </el-table-column>
      <el-table-column align="center" label="稀有度">
        <template slot-scope="scope">
          <el-tag :color="scope.row.rarityColor" style="color: #fff;">{{ scope.row.rarityName }}</el-tag>
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
      <el-table-column align="center" label="本站价格" prop="usePrice" />
      <el-table-column align="center" label="在售数量" prop="quantity" />
      <el-table-column align="center" label="更新时间" prop="updateTime" />
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-date"
            size="mini"
            type="text"
            @click="handleGrant(scope.row)"
          >发放饰品</el-button>
          <el-button icon="el-icon-date" size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />
    <el-dialog title="饰品发放" :visible.sync="dialogFormVisible">
      <el-form :model="forms" label-width="80px" :rules="ruless" ref="ruleFormfa">
        <el-form-item label="用户" prop="nickName">
          <el-popover placement="bottom-start" width="460" trigger="hover" ref="morePop">
            <el-input
              slot="reference"
              v-model="forms.nickName"
              placeholder="请选择用户"
              suffix-icon="el-icon-caret-bottom"
              readonly
              clearable
            ></el-input>
            <el-form>
              <el-row>
                <el-col :span="18">
                  <el-input
                    v-model="queryParams.nickName"
                    clearable
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
                      <div style="color: #8492a6;">{{item.phoneNumber}}</div>
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
              <el-select v-model="forms.ornamentsLevelId" placeholder="请选择级别" clearable>
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
        <el-button @click="cancellation('ruleFormfa') ">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('ruleFormfa')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改饰品数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="饰品名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入饰品名称" />
        </el-form-item>
        <el-form-item label="本网站使用价格" prop="usePrice">
          <el-input v-model="form.usePrice" placeholder="请输入本网站使用价格" />
        </el-form-item>
        <el-form-item label="饰品图片地址" prop="imageUrl">
          <el-input v-model="form.imageUrl" placeholder="请输入饰品图片地址" />
        </el-form-item>
        <el-form-item label="饰品唯一名称英文" prop="marketHashName">
          <el-input v-model="form.marketHashName" placeholder="请输入饰品唯一名称英文" />
        </el-form-item>
        <el-form-item label="ZBT官网饰品id" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入ZBT官网饰品id" />
        </el-form-item>
        <el-form-item label="在售最低价" prop="price">
          <el-input v-model="form.price" placeholder="请输入在售最低价" />
        </el-form-item>
        <el-form-item label="短名称，去掉前缀" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入短名称，去掉前缀" />
        </el-form-item>
        <el-form-item label="steam类型中文" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入steam类型中文" />
        </el-form-item>
        <el-form-item label="品质" prop="quality">
          <el-input v-model="form.quality" placeholder="请输入品质" />
        </el-form-item>
        <el-form-item label="品质名称" prop="qualityName">
          <el-input v-model="form.qualityName" placeholder="请输入品质名称" />
        </el-form-item>
        <el-form-item label="品质颜色" prop="qualityColor">
          <el-input v-model="form.qualityColor" placeholder="请输入品质颜色" />
        </el-form-item>
        <el-form-item label="稀有度" prop="rarity">
          <el-input v-model="form.rarity" placeholder="请输入稀有度" />
        </el-form-item>
        <el-form-item label="稀有度名称" prop="rarityName">
          <el-input v-model="form.rarityName" placeholder="请输入稀有度名称" />
        </el-form-item>
        <el-form-item label="稀有度颜色" prop="rarityColor">
          <el-input v-model="form.rarityColor" placeholder="请输入稀有度颜色" />
        </el-form-item>
        <el-form-item label="外观" prop="exterior">
          <el-input v-model="form.exterior" placeholder="请输入外观" />
        </el-form-item>
        <el-form-item label="外观名称" prop="exteriorName">
          <el-input v-model="form.exteriorName" placeholder="请输入外观名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入内容" type="textarea" />
        </el-form-item>
        <el-form-item label="商城是否上架" prop="isPutaway">
          <el-input v-model="form.isPutaway" placeholder="请输入商城是否上架" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="Detialtitle" :visible.sync="isDetia">
      <el-form ref="form" :model="formDetial" :rules="rules" label-width="150px">
        <el-form-item label="饰品图片" prop="imageUrl">
          <image-preview :src="formDetial.imageUrl" :width="100" :height="100" />
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="饰品名称" prop="itemName">
            <el-input v-model="formDetial.itemName" placeholder="请输入饰品名称" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="本网站使用价格" prop="usePrice">
            <el-input v-model="formDetial.usePrice" placeholder="请输入本网站使用价格" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="饰品唯一名称英文" prop="marketHashName">
            <el-input v-model="formDetial.marketHashName" placeholder="请输入饰品唯一名称英文" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="ZBT官网饰品id" prop="itemId">
            <el-input v-model="formDetial.itemId" placeholder="请输入ZBT官网饰品id" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在售最低价" prop="price">
            <el-input v-model="formDetial.price" placeholder="请输入在售最低价" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="短名称，去掉前缀" prop="shortName">
            <el-input v-model="formDetial.shortName" placeholder="请输入短名称，去掉前缀" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="steam类型中文" prop="typeName">
            <el-input v-model="formDetial.typeName" placeholder="请输入steam类型中文" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品质" prop="quality">
            <el-input v-model="formDetial.quality" placeholder="请输入品质" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品质名称" prop="qualityName">
            <el-input v-model="formDetial.qualityName" placeholder="请输入品质名称" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品质颜色" prop="qualityColor">
            <el-input v-model="formDetial.qualityColor" placeholder="请输入品质颜色" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="稀有度" prop="rarity">
            <el-input v-model="formDetial.rarity" placeholder="请输入稀有度" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="稀有度名称" prop="rarityName">
            <el-input v-model="formDetial.rarityName" placeholder="请输入稀有度名称" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="稀有度颜色" prop="rarityColor">
            <el-input v-model="formDetial.rarityColor" placeholder="请输入稀有度颜色" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="外观" prop="exterior">
            <el-input v-model="formDetial.exterior" placeholder="请输入外观" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="外观名称" prop="exteriorName">
            <el-input v-model="formDetial.exteriorName" placeholder="请输入外观名称" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formDetial.remark" placeholder="请输入内容" type="textarea" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商城是否上架" prop="isPutaway">
            <el-input v-if="formDetial.isPutaway == 0" value="是" disabled />
            <el-input v-if="formDetial.isPutaway == 1" value="否" disabled />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDetia = false">取 消</el-button>
        <el-button type="primary" @click="isDetia = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addOrnaments,
  delOrnaments,
  getOrnaments,
  listOrnaments,
  updateOrnaments,
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
  name: "Ornaments",
  data() {
    return {
      //
      listLevel: [],
      //
      dialogFormVisible: false,
      //饰品详情
      Detialtitle: "",
      formDetial: {},
      isDetia: false,
      // 遮罩层
      loading: true,
      loadings: false,
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
      //用户
      userList: [],
      // 饰品数据表格数据
      ornamentsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        itemName: null,
        usePrice: null,
        imageUrl: null,
        marketHashName: null,
        itemId: null,
        price: null,
        shortName: null,
        type: null,
        typeName: null,
        quality: null,
        qualityName: null,
        qualityColor: null,
        rarity: null,
        rarityName: null,
        rarityColor: null,
        exterior: null,
        exteriorName: null,
        isPutaway: null
      },
      // 表单参数
      form: {},
      forms: {
        nickName: null,
        userId: null,
        ornamentsId: null,
        num: null
      },
      // 表单校验
      rules: {},
      ruless: {
        nickName: [
          { required: true, message: "请选择发放用户", trigger: "change" }
        ],
        ornamentsLevelId: [
          { required: true, message: "请选择饰品等级", trigger: "change" }
        ],
        num: [{ required: true, message: "请选择数量", trigger: "blur" }]
      },
      //
      formAdd: {
        num: null,
        ornamentsId: null,
        userId: null,
        ornamentsLevelId: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    cancellation(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    change(e) {
      this.$forceUpdate();
    },
    addOr(res) {
      this.forms.nickName = res.nickName;
      this.forms.userId = res.userId;
      this.$refs.morePop.doClose();
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
        nickName: null,
        userId: null,
        ornamentsId: null,
        num: null
      };
      this.serchornaments();
      this.dialogFormVisible = true;
      this.forms.ornamentsId = res.id;
    },
    /* */
    handleDetail(res) {
      this.formDetial = res;
      this.isDetia = true;
      this.Detialtitle = res.itemName;
    },
    /** 查询饰品数据列表 */
    getList() {
      this.loading = true;
      listOrnaments(this.queryParams).then(response => {
        this.ornamentsList = response.data.records;
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
      this.queryParams.id = "";
      this.queryParams.itemName = "";
      this.queryParams.isPutaway = "";
      this.queryParams.exterior = "";
      this.queryParams.maxPrice = "";
      this.queryParams.minPrice = "";
      this.queryParams.type = "";
      this.getList();
      this.form = {
        id: null,
        itemName: null,
        usePrice: null,
        imageUrl: null,
        marketHashName: null,
        itemId: null,
        price: null,
        shortName: null,
        type: null,
        typeName: null,
        quality: null,
        qualityName: null,
        qualityColor: null,
        rarity: null,
        rarityName: null,
        rarityColor: null,
        exterior: null,
        exteriorName: null,
        createTime: null,
        updateTime: null,
        remark: null,
        isPutaway: null
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
      this.queryParams = {
        id: null,
        pageNum: 1,
        pageSize: 10,
        itemName: null,
        usePrice: null,
        imageUrl: null,
        marketHashName: null,
        itemId: null,
        price: null,
        shortName: null,
        type: null,
        typeName: null,
        quality: null,
        qualityName: null,
        qualityColor: null,
        rarity: null,
        rarityName: null,
        rarityColor: null,
        exterior: null,
        exteriorName: null,
        isPutaway: null
      };
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
      this.title = "添加饰品数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getOrnaments(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改饰品数据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrnaments(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrnaments(this.form).then(response => {
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
        .confirm('是否确认删除饰品数据编号为"' + ids + '"的数据项？')
        .then(function() {
          return delOrnaments(ids);
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
    }
  }
};
</script>
<style lang="scss" scoped>
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
.home {
  padding: 20px;
}
</style>