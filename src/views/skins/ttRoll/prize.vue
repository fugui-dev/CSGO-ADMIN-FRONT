<template>
  <div class="home">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="奖池名称" prop="userName">
        <el-input
          v-model="queryParams.jackpotName"
          placeholder="请输入奖池名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          icon="el-icon-plus"
          size="mini"
          @click="handleCreat"
          v-hasPermi="['admin:prize:export']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['admin:prize:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="jackpotId" label="ID"></el-table-column>
      <el-table-column align="center" prop="jackpotName" label="奖池名称"></el-table-column>
      <el-table-column align="center" prop="createBy" label="创建者"></el-table-column>
      <el-table-column align="center" prop="updateBy" label="更新者"></el-table-column>
      <el-table-column align="center" prop="description" label="奖池描述"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.jackpotId)"
          >删除</el-button>
          <el-button type="text" size="mini" icon="el-icon-edit" @click="handleChange(scope.row)">编辑</el-button>

          <el-dropdown size="mini">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-caret-right" @click.native="handleAdd(scope.row)">批量填货</el-dropdown-item>
              <el-dropdown-item icon="el-icon-view" @click.native="handleWatch(scope.row)">查看奖项</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- TODO 此处需要加分页 -->
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" v-if="type === 1 " label-width="120px">
        <el-form-item label="奖池名称">
          <el-input v-model="form.jackpotName" autocomplete="off" placeholder="请输入奖池名称"></el-input>
        </el-form-item>

        <el-form-item label="奖池说明">
          <el-input
            type="textarea"
            v-model="form.description"
            autocomplete="off"
            placeholder="请输入奖池说明"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form" v-if="type === 2 " label-width="120px">
        <el-form-item label="奖池名称">
          <el-input v-model="form.jackpotName" autocomplete="off" placeholder="请输入奖池名称"></el-input>
        </el-form-item>

        <el-form-item label="奖池说明">
          <el-input
            type="textarea"
            v-model="form.description"
            autocomplete="off"
            placeholder="请输入奖池说明"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="formAdd" v-if="type === 3" label-width="120px">
        <el-form-item label="所属奖池">
          <el-select v-model="formAdd.jackpotId" filterable placeholder="请选择">
            <el-option
              v-for="item in tableData"
              :key="item.jackpotId"
              :label="item.jackpotName"
              :value="item.jackpotId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖池">
          <el-popover placement="bottom-start" width="460" trigger="hover" ref="morePop">
            <el-input slot="reference" v-model="orOnselects.itemName" placeholder="点击选择饰品" readonly></el-input>
            <el-form>
              <el-row>
                <el-col :span="18">
                  <el-input v-model="orform.itemName" placeholder="请输入饰品名称" @input="serchornaments"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-button @click="serchornaments" style="margin-left: 35px;">搜索</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-form v-loading="loadings" v-if="orList !== null">
                  <div class="magicbox" @scroll="scrollEventFn" v-if="orList.length > 0">
                    <div
                      class="magic"
                      v-for="(item,index) in orList"
                      :key="index"
                      @click="addOr(item)"
                    >{{ item.itemName }} - ￥ {{ item.usePrice }}</div>
                  </div>
                  <div v-else>
                    <div style="margin:0 auto; text-align:center; margin-top:10px;">无此名称饰品名称</div>
                  </div>
                </el-form>
                <el-form v-else>
                  <div style="margin:0 auto; text-align:center; margin-top:10px;">请输入饰品名称</div>
                </el-form>
              </el-row>
            </el-form>
          </el-popover>
        </el-form-item>
        <el-form-item label="数量" prop="ornamentsNum">
          <el-input-number v-model="formAdd.ornamentsNum" :min="1" :max="1000"></el-input-number>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量填货" :visible.sync="FormVisible" width="85%">
      <el-form :model="formPrize">
        <el-form-item label="所属奖池">
          <el-select v-model="formPrize.jackpotId" filterable placeholder="请选择">
            <el-option
              v-for="item in tableData"
              :key="item.jackpotId"
              :label="item.jackpotName"
              :value="item.jackpotId"
            ></el-option>
          </el-select>
        </el-form-item>

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
                  <el-form-item label="价格区间" class="orform max">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="FormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitone">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  rollJackpotList,
  delRollJackpot,
  rollJackpotCreat,
  rollJackpotChange,
  rollJackpotAdd,
  rollJackpotOrnamentsList,
  batchAdd
} from "@/api/skins/ttRoll/api";
import { listOrnaments, getWebsiteProperty } from "@/api/skins/ttOrnaments/api";
export default {
  dicts: [
    "shopping_isputaway_status",
    "ornaments_exterior_name",
    "ornaments_type_name"
  ],
  data() {
    return {
      activeName: "first",
      FormVisible: false,
      // 总条数
      total: 0,
      totalPrize: 1,
      ortotal: 1,
      formLabelWidth: "120px",
      boxList: [],
      prizeIds: [],
      type: 1,
      loading: false,
      loadings: false,
      dialogFormVisible: false,
      title: "",
      showSearch: true,
      formWatch: null,
      tableData: [],
      orOnselect: {},
      orOnselects: {
        itemName: null
      },
      orList: null,
      formAdd: {
        jackpotId: null,
        ornamentsId: null,
        ornamentsLevelId: null,
        ornamentsNum: 1
      },
      form: {
        description: null,
        jackpotName: null
      },
      queryParams: {
        jackpotName: null,
        pageNum: 1,
        pageSize: 10
      },
      formPrize: {
        boxId: null,
        anchorOdds: 0,
        isLuck: 0,
        ornamentsLevelId: null,
        luckOdds: 0,
        odds: 0,
        ornamentsId: null,
        realOdds: 0
      },
      orform: {
        itemName: null,
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    serchprop() {
      this.loadings = true;
      getWebsiteProperty(this.orform).then(res => {
        this.orList = res.rows;
        this.loadings = false;
        this.ortotal = res.total;
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
    handleSubmitone() {
      batchAdd(this.formPrize.jackpotId, this.prizeIds).then(res => {
        this.FormVisible = false;
        this.$modal.msgSuccess("添加成功");
      });
    },

    handleWatch(res) {
      this.$router.push({
        path: "/roll/prizedetail",
        query: {
          id: res.jackpotId
        }
      });
    },
    addOr(res) {
      this.formAdd.ornamentsId = res.id;
      this.orOnselect = res;
      this.orOnselects.itemName = res.itemName + "   -   ￥" + res.usePrice;
      this.$refs.morePop.doClose();
      this.orform.itemName = null;
      this.orList = null;
    },
    scrollEventFn(e) {
      if (
        e.srcElement.scrollTop + e.srcElement.clientHeight >=
        e.srcElement.scrollHeight
      ) {
        this.orform.pageNum += 1;
        listOrnaments(this.orform).then(res => {
          this.orList.push.apply(this.orList, res.data?.records || []);
        });
      }
    },

    serchornaments() {
      this.loadings = true;
      listOrnaments(this.orform).then(res => {
        this.ortotal = res.data.total;
        this.orList = res.data.records;
        this.loadings = false;
      });
    },
    handleAdd(res) {
      this.formPrize.jackpotName = res.jackpotName;
      this.formPrize.jackpotId = res.jackpotId;
      this.serchornaments();

      this.title = "批量填货";
      this.FormVisible = true;
    },
    handleChange(res) {
      this.form = {};
      this.title = "编辑奖池";
      this.type = 2;
      this.form = res;
      this.dialogFormVisible = true;
    },
    resetQuery() {
      this.getList();
      this.queryForm = {
        jackpotName: null,
        pageNum: 1,
        pageSize: 20
      };
    },
    handleSubmit() {
      if (this.type == 1) {
        rollJackpotCreat(this.form).then(res => {
          this.getList();
          this.dialogFormVisible = false;
          this.$message({
            message: "新增成功",
            type: "success"
          });
        });
      } else if (this.type == 2) {
        rollJackpotChange(this.form).then(res => {
          this.getList();
          this.dialogFormVisible = false;
          this.$message({
            message: "编辑成功",
            type: "success"
          });
        });
      } else if (this.type == 3) {
        rollJackpotAdd(this.formAdd).then(res => {
          this.getList();
          this.orOnselects.itemName = "";
          this.dialogFormVisible = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
        });
      }
    },
    handleCreat() {
      (this.form = {
        description: null,
        jackpotName: null
      }),
        (this.title = "新增奖池");
      this.dialogFormVisible = true;
      this.type = 1;
    },
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除ID为"' + row + '"的Roll房？')
        .then(() => {
          delRollJackpot(row).then(res => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          });
        })
        .catch(() => {});
    },
    handleExport() {
      this.download(
        "admin/prize/export",
        {
          ...this.queryParams
        },
        `Roll_${new Date().getTime()}.xlsx`
      );
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      rollJackpotList(this.queryParams).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        document.body.click();
        this.loading = false;
      });
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
    &:hover {
      background-color: #409eff;
      transition: all ease 0.3s;
    }
  }
}
.orform ::v-deep {
  .el-form-item__content {
    width: 65%;
  }
}
.max ::v-deep {
  .el-form-item__content {
    .el-input {
      .el-input__inner {
        padding-right: 10px;
      }
    }
  }
}

.home {
  padding: 20px;
}
</style>
