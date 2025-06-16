<template>
  <div class="home">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="ID" prop="userName">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入ID"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['admin:prize:edit']"
        >删除</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table :data="formWatchss" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="id" label="id" width="180"></el-table-column>
      <el-table-column align="center" prop="jackpotName" label="所属奖池" width="180"></el-table-column>
      <el-table-column align="center" prop label="饰品图">
        <template slot-scope="scope">
          <image-preview :src="scope.row.imageUrl" :width="40" :height="40" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="shortName" label="饰品名称"></el-table-column>
      <el-table-column align="center" prop="usePrice" label="金额"></el-table-column>
      <!-- <el-table-column align="center" prop="usePrice" label="颜色"></el-table-column> -->
      <el-table-column align="center" prop="ornamentsNum" label="数量" width="50">
        <template slot-scope="scope">
          <el-popover placement="top" width="290" popper-class="layout">
            <el-row>
              <el-col :span="18">
                <el-input v-model="scope.row.ornamentsNum" clearable></el-input>
              </el-col>
              <el-col :span="6">
                <div style="text-align: right; margin: 0;line-height:36px">
                  <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                  <el-button type="text" size="mini" @click="handleChangeOrnum(scope.row)">确定</el-button>
                </div>
              </el-col>
            </el-row>
            <el-button slot="reference" type="text">{{scope.row.ornamentsNum}}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="最后更新"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" @click="handleChange(scope.row)">编辑</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <!--  -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <div v-if="type == 1">
        <el-form :model="formAdd" label-width="120px">
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
              <el-input
                slot="reference"
                v-model="orOnselects.itemName"
                placeholder="点击选择饰品"
                readonly
              ></el-input>
              <el-form>
                <el-row>
                  <el-col :span="18">
                    <el-input
                      v-model="orform.itemName"
                      placeholder="请输入饰品名称"
                      @input="serchornaments"
                    ></el-input>
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
                      >{{ item.name }} - ￥ {{ item.usePrice }}</div>
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
          <el-form-item label="数量">
            <el-input-number v-model="formAdd.ornamentsNum" :min="1" :max="1000"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="type == 2">
        <el-form :model="formAdd" label-width="120px">
          <el-form-item label="所属奖池">
            <el-select v-model="formAdd.jackpotId" placeholder="请选择">
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
              <el-input
                slot="reference"
                v-model="orOnselects.itemName"
                placeholder="点击选择饰品"
                readonly
              ></el-input>
              <el-form>
                <el-row>
                  <el-col :span="18">
                    <el-input
                      v-model="orform.itemName"
                      placeholder="请输入饰品名称"
                      @input="serchornaments"
                    ></el-input>
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
          <el-form-item label="数量">
            <el-input-number v-model="formAdd.ornamentsNum" :min="1" :max="1000"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
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
  rollJackpotdetial,
  rollJackpotOrnamentsList,
  rollJackpotOrnamentsChange,
  rollJackpotOrnamentDel
} from "@/api/skins/ttRoll/api";
import { listOrnaments } from "@/api/skins/ttOrnaments/api";

export default {
  data() {
    return {
      total: 0,
      type: 1,
      loading: false,
      loadings: false,
      title: "添加饰品",
      showSearch: true,
      dialogFormVisible: false,
      formWatch: [],
      formWatchs: [],
      formWatchss: [],
      tableData: [],
      orform: {
        itemName: null,
        pageNum: 1,
        pageSize: 20
      },
      changeOr: {
        jackpotId: Number(this.$route.query.id),
        ornamentsId: null,
        ornamentsLevelId: 0,
        ornamentsNum: 1
      },
      orOnselect: {},
      orOnselects: {
        itemName: null
      },
      orList: null,
      formAdd: {
        jackpotId: null,
        ornamentsId: null,
        ornamentsLevelId: null,
        ornamentsNum: 1,
        price: null
      },
      queryParams: {
        jackpotId: Number(this.$route.query.id),
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleDelete(res) {
      rollJackpotOrnamentDel(Number(this.$route.query.id), res.id).then(res => {
        this.getList();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
    handleChange(res) {
      this.type = 2;
      this.dialogFormVisible = true;
      this.formAdd = res;
      this.formAdd.jackpotId = Number(this.$route.query.id);
    },
    // 点击数量修改数量
    handleChangeOrnum(res) {
      res.jackpotId = Number(this.changeOr.jackpotId);
      rollJackpotOrnamentsChange(res)
        .then(res => {
          this.getList();
          this.visible = false;
          document.body.click();
          this.$message({
            message: "修改成功",
            type: "success"
          });
        })
        .catch(err => {
          this.getList();
          document.body.click();
        });
    },
    handleSubmit() {
      if (this.type == 1) {
        rollJackpotAdd(this.formAdd).then(res => {
          this.getList();
          this.dialogFormVisible = false;
          this.orOnselects.itemName = "";
          this.$message({
            message: "添加成功",
            type: "success"
          });
        });
      } else if (this.type == 2) {
        this.formAdd.jackpotId = this.changeOr.jackpotId;
        rollJackpotOrnamentsChange(this.formAdd).then(res => {
          this.getList();
          this.dialogFormVisible = false;
          this.formAdd = {};
          this.$message({
            message: "编辑成功",
            type: "success"
          });
        });
      }
    },
    addOr(res) {
      this.formAdd.ornamentsId = res.id;
      this.formAdd.price = res.usePrice;
      this.orOnselect = res;
      this.orOnselects.itemName = res.name + "   -   ￥" + res.usePrice;
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
          this.orList.push.apply(this.orList, res.data.records);
        });
      }
    },
    serchornaments() {
      this.loadings = true;
      listOrnaments(this.orform).then(res => {
        this.orList = res.data.records;
        this.loadings = false;
      });
    },
    resetQuery() {
      this.getList();
      this.queryForm = {
        jackpotId: Number(this.$route.query.id),
        pageNum: 1,
        pageSize: 10
      };
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleCreat() {
      this.type = 1;
      this.dialogFormVisible = true;
      this.title = "添加饰品";
      this.formAdd.jackpotId = Number(this.$route.query.id);
    },
    getList() {
      rollJackpotList(this.queryForm).then(res => {
        this.tableData = res.rows;
      });
      this.loading = true;
      rollJackpotOrnamentsList(this.queryParams).then(res => {
        this.total = res.total;
        this.formWatch = res.rows;
        this.loading = false;
        rollJackpotdetial(Number(this.$route.query.id)).then(res => {
          this.formWatchs = res.data;
          for (let i = 0; i < this.formWatch.length; i++) {
            this.formWatch[i].jackpotName = res.data.jackpotName;
          }
          this.formWatchss = this.formWatch;
        });
      });
    },
    handleExport() {
      this.download(
        "admin/prize/export",
        {
          ...this.queryParams
        },
        `Roll_${new Date().getTime()}.xlsx`
      );
    }
  }
};
</script>
<style scoped lang="scss">
.layout {
  padding: 5px;
}
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
.home {
  padding: 20px;
}
</style>
