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
      <el-form-item label="饰品名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入饰品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="饰品类型" prop="type">
        <el-select v-model="queryParams.type" clearable placeholder="请选择饰品类型">
          <el-option
            v-for="dict in dict.type.ornaments_type_name"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="饰品类型" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择饰品状态" clearable>
          <el-option label="启用" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button plain size="mini" @click="handleAdd" v-hasPermi="['system:ornaments:add']">批量填货</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="ornamentsList">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="itemName" />
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <image-preview :src="scope.row.imageUrl" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center">
        <template slot-scope="scope">
          <el-popover placement="top" popper-class="layout">
            <div style="text-align: center;">
              <el-row>
                <el-col :span="18">
                  <el-input-number
                    v-model="editPrice"
                    :precision="2"
                    :min="0"
                    :step="0.01"
                    placeholder="请输入价格"
                    style="width: 100%"
                  ></el-input-number>
                </el-col>
                <el-col :span="6">
                  <div style="text-align: right; margin: 0;line-height:36px">
                    <el-button size="mini" type="text" @click="handleR">取消</el-button>
                    <el-button type="text" size="mini" @click="handleChangePrice(scope.row)">确定</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-button
              slot="reference"
              type="text"
              class="under"
              icon="el-icon-edit"
              @click="handleChangePriceClick(scope.row.ornamentPrice || scope.row.usePrice)"
            >{{ scope.row.ornamentPrice || scope.row.usePrice }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="级别" align="center" prop="level">
        <template slot-scope="scope">
          <el-popover placement="top" popper-class="layout">
            <div style="text-align: center;">
              <el-row>
                <el-col :span="18">
                  <el-select v-model="scope.row.ornamentsLevelId" placeholder="请选择颜色">
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
      <el-table-column label="类型" align="center" prop="typeName" />
      <el-table-column label="普通用户" align="center">
        <el-table-column label="幸运区间(单位:%)" align="center" prop="luckSection">
          <template slot-scope="scope">
            <el-popover placement="top" popper-class="layout">
              <div style="text-align: center;">
                <el-row>
                  <el-col :span="8">
                    <el-input v-model="luckSection.minluckSection" placeholder="最小区间">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
                  <el-col :span="2">
                    <i class="el-icon-minus" style="margin-top:10px"></i>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="luckSection.maxluckSection" placeholder="最大区间">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
                  <el-col :span="6">
                    <div style="text-align: right; margin: 0;line-height:36px">
                      <el-button size="mini" type="text" @click="handleR">取消</el-button>
                      <el-button
                        type="text"
                        size="mini"
                        @click="handleChangeInterval(scope.row,'p')"
                      >确定</el-button>
                    </div>
                  </el-col>
                </el-row>
              </div>

              <el-button
                slot="reference"
                type="text"
                class="under"
                @click="handleChange(scope.row.luckSection ,'p')"
              >{{ scope.row.luckSection }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="本轮出货所需金额" align="center" prop="amountRequired"></el-table-column>
        <el-table-column label="本轮已投金额" align="center" prop="amountInvested"></el-table-column>
      </el-table-column>
      <el-table-column label="主播用户" align="center">
        <el-table-column label="幸运区间(单位:%)" align="center" prop="anchorLuckSection">
          <template slot-scope="scope">
            <el-popover placement="top" popper-class="layout">
              <div style="text-align: center;">
                <el-row>
                  <el-col :span="8">
                    <el-input v-model="anchorLuckSection.minanchorLuckSection" placeholder="最小区间">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
                  <el-col :span="2">
                    <i class="el-icon-minus" style="margin-top:10px"></i>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="anchorLuckSection.maxanchorLuckSection" placeholder="最大区间">
                      <template slot="append">%</template>
                    </el-input>
                  </el-col>
                  <el-col :span="6">
                    <div style="text-align: right; margin: 0;line-height:36px">
                      <el-button size="mini" type="text" @click="handleR">取消</el-button>
                      <el-button
                        type="text"
                        size="mini"
                        @click="handleChangeInterval(scope.row,'z')"
                      >确定</el-button>
                    </div>
                  </el-col>
                </el-row>
              </div>

              <el-button
                slot="reference"
                type="text"
                class="under"
                @click="handleChange(scope.row.anchorLuckSection,'z')"
              >{{ scope.row.anchorLuckSection }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="本轮出货所需金额" align="center" prop="anchorAmountRequired"></el-table-column>
        <el-table-column label="本轮已投金额" align="center" prop="anchorAmountInvested"></el-table-column>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="'1'"
            :inactive-value="'0'"
            active-color="#D9534F"
            inactive-color="#5CB85C"
            active-text="启用"
            inactive-text="禁用"
            @change="handleChangeType(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleCount(scope.row)"
            v-hasPermi="['system:ornaments:edit']"
          >统计</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:ornaments:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:ornaments:edit']"
          >失败奖励</el-button>
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

    <!-- 添加或修改幸运升级数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="升级饰品ID" prop="ornamentsId">
          <el-input v-model="form.ornamentsId" placeholder="请输入升级饰品ID" />
        </el-form-item>
        <el-form-item label="饰品级别ID" prop="ornamentsLevelId">
          <el-input v-model="form.ornamentsLevelId" placeholder="请输入饰品级别ID" />
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
                  <el-input v-model="orform.itemName" placeholder="请输入饰品名称" clearable></el-input>
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
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitone">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="升级饰品利润统计" :visible.sync="countVisible" width="600px">
      <el-row style="display: flex;   justify-content: center;">
        <div id="main"></div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// import { listOrnaments, getOrnaments, delOrnaments, addOrnaments, updateOrnaments } from "@/api/system/ornaments";
import {
  getupgradeOrnaments,
  getUpgradeOrnamentsid,
  delUpgradeOrnaments,
  addUpgradeOrnaments,
  updateUpgradeOrnaments,
  getUserProfitStatistics
} from "@/api/skins/ttUpgrade/api";
import { listOrnaments, getWebsiteProperty } from "@/api/skins/ttOrnaments/api";
import { listLevel } from "@/api/skins/ttOrnamentsLevel/api";
import * as echarts from "echarts";

export default {
  name: "Ornaments",
  dicts: [
    "shopping_isputaway_status",
    "ornaments_exterior_name",
    "ornaments_type_name"
  ],
  data() {
    return {
      anchorLuckSection: {
        maxanchorLuckSection: null,
        minanchorLuckSection: null
      },
      luckSection: {
        maxluckSection: null,
        minluckSection: null
      },
      editPrice: null, // 用于编辑价格
      levelList: [],

      ortotal: 1,

      prizeIds: [],
      orList: [],
      dialogFormVisible: false,
      activeName: "first",
      // 遮罩层
      loading: true,
      loadings: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      countVisible: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 幸运升级数据表格数据
      ornamentsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      orform: {
        itemName: null,
        pageNum: 1,
        pageSize: 10
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ornamentsId: null,
        ornamentsLevelId: null,
        luckSection: null,
        type: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ornamentsId: [
          { required: true, message: "升级饰品ID不能为空", trigger: "blur" }
        ],
        ornamentsLevelId: [
          { required: true, message: "饰品级别ID不能为空", trigger: "blur" }
        ],
        luckSection: [
          { required: true, message: "幸运区间不能为空", trigger: "blur" }
        ],
        anchorLuckSection: [
          { required: true, message: "幸运区间不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ]
      },
      num: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
            data: [res.totalAmountConsumed],
            type: "bar",
            name: "总投入金额",

            label: {
              show: true,
              position: "top",
              formatter: "总投入金额：" + "{c}"
            }
          },
          {
            data: [res.totalGainPrice],
            type: "bar",
            name: "总获得金额",
            label: {
              show: true,
              position: "top",
              formatter: "总获得金额：" + "{c}"
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
      getUserProfitStatistics(res.id).then(res => {
        this.initEcharts(res.data);
      });
    },
    handleChange(res, type) {
      let data = JSON.stringify(res);
      if (type == "p") {
        this.luckSection.minluckSection = res.split(",")[0].slice(1);
        this.luckSection.maxluckSection = res.split(",")[1].slice(0, -1);
      } else if (type == "z") {
        this.anchorLuckSection.minanchorLuckSection = res
          .split(",")[0]
          .slice(1);
        this.anchorLuckSection.maxanchorLuckSection = res
          .split(",")[1]
          .slice(0, -1);
      }
    },
    handleChangePriceClick(price) {
      this.editPrice = price;
    },
    handleChangePrice(row) {
      if (this.editPrice === null || this.editPrice < 0) {
        this.$message({
          type: "warning",
          message: "请输入有效的价格!"
        });
        return;
      }
      let data = { ...row };
      data.ornamentPrice = this.editPrice;
      updateUpgradeOrnaments(data)
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          document.body.click();
          this.editPrice = null;
          this.getList();
        })
        .catch(res => {
          this.getList();
        });
    },
    handleChangeInterval(res, type) {
      if (type == "p") {
        res.luckSection =
          "[" +
          this.luckSection.minluckSection +
          "," +
          this.luckSection.maxluckSection +
          "]";
        updateUpgradeOrnaments(res).then(res => {
          document.body.click();

          this.getList();
          this.luckSection.minluckSection = null;
          this.luckSection.maxluckSection = null;
        });
      } else if (type == "z") {
        res.anchorLuckSection =
          "[" +
          this.anchorLuckSection.minanchorLuckSection +
          "," +
          this.anchorLuckSection.maxanchorLuckSection +
          "]";
        updateUpgradeOrnaments(res).then(res => {
          document.body.click();

          this.getList();
          this.anchorLuckSection.minanchorLuckSection = null;
          this.anchorLuckSection.maxanchorLuckSection = null;
        });
      }
    },
    handleR() {
      document.body.click();
      this.getList();
    },
    handleChangeType(res) {
      let data = res;
      updateUpgradeOrnaments(data)
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
    handleSubmitone() {
      addUpgradeOrnaments(this.prizeIds).then(res => {
        this.dialogFormVisible = false;
        this.$modal.msgSuccess("添加成功");
        this.getList();
      });
    },
    selectPrize(selection) {
      this.prizeIds = selection.map(item => item.id);
    },
    orresetQuery() {
      this.orform = {};
      if (this.activeName == "first") {
        this.serchornaments();
      } else {
        return;
      }
    },
    orhandleClick() {
      if (this.activeName == "first") {
        this.serchornaments();
      } else {
        return;
      }
    },
    tabclick() {
      // alert("66");
      if (this.activeName == "first") {
        this.serchornaments();
      } else {
        return;
      }
    },
    //
    serchornaments() {
      this.loadings = true;
      listOrnaments(this.orform).then(res => {
        this.orList = res.data.records;
        this.loadings = false;
        this.ortotal = res.data.total;
      });
    },
    /** 查询幸运升级数据列表 */
    getList() {
      this.loading = true;
      getupgradeOrnaments(this.queryParams).then(response => {
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
        ornamentsId: null,
        ornamentsLevelId: null,
        luckSection: null,
        anchorLuckSection: null,
        status: null,
        createTime: null,
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
      this.dialogFormVisible = true;
      this.title = "添加幸运升级数据";
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
      this.$router.push({
        path: "/luckyUpgrade/upgradeFall",
        query: {
          id: id
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateUpgradeOrnaments(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUpgradeOrnaments(this.form).then(response => {
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
        .confirm('是否确认删除幸运升级数据编号为"' + ids + '"的数据项？')
        .then(function() {
          return delUpgradeOrnaments(ids);
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
<style scoped lang="scss">
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
  height: 450px;
}
</style>
