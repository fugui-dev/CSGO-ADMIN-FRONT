<template>
  <div class="home">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="发货平台">
        <el-select v-model="partyType" placeholder="请选择发货平台" @change="handleQuery">
          <el-option label="CS2PIFA" value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货" prop="phoneNumber">
        <el-select v-model="queryParams.delivery" placeholder="请选择发货模式" clearable>
          <el-option
            v-for="dict in dict.type.delivery_way"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
            @keyup.enter.native="handleQuery"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="userName	">
        <el-select v-model="queryParams.orderBy" placeholder="请选择排序方式" clearable>
          <el-option
            v-for="dict in dict.type.sale_sorting"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
            @keyup.enter.native="handleQuery"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="itemName" label="装备名称"></el-table-column>
      <el-table-column align="center" prop="itemName" label="装备名称">
        <template slot-scope="scope">
          <image-preview :src="scope.row.imageUrl" :width="40" :height="40" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="cnyPrice" label="价格（人民币）"></el-table-column>
      <el-table-column align="center" prop="price" label="价格"></el-table-column>
      <el-table-column align="center" prop="delivery" label="发货方式">
        <template slot-scope="scope">
          <div
            v-if="scope.row.delivery == 1"
            style="display:flex; align-items:center;justify-content:center;line-height: 1;"
          >
            <span
              style="width: 8px; height:8px; margin-right:5px;   border-radius: 50%;   background-color: #F39c12; display:inline-block;"
            ></span>
            人工发货
          </div>
          <div
            v-if="scope.row.delivery == 2"
            style="display:flex; align-items:center;justify-content:center;"
          >
            <span
              style="width: 8px; height:8px; margin-right:5px;   border-radius: 50%;   background-color: #00a65a; display:inline-block;"
            ></span>
            自动发货
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleAppoint(scope.row)">购买发货</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="指定获奖者" :visible.sync="dialogFormVisible">
      <el-form :model="formAdd" label-width="120px">
        <el-form-item label="用户">
          <el-popover placement="bottom-start" width="460" trigger="hover" ref="morePop">
            <el-input slot="reference" v-model="form.nickName" placeholder="用户 " readonly></el-input>
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
                      <div>{{ item.nickName }}</div>
                      <div>{{item.phoneNumber}}</div>
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
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <pagination
      v-show="total>0"
      :limit.sync="queryParams.limit"
      :page.sync="queryParams.page"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { listUser } from "@/api/skins/ttuser/api";
import { tradeBuy, getAvailableMarketList } from "@/api/skins/ttdelivery/api";
export default {
  dicts: ["delivery_way", "sale_sorting"],
  data() {
    return {
      partyType: "7", // 默认CS2PIFA
      total: 1,
      loading: false,
      formAdd: {},
      orOnselects: {},
      orform: {},
      userList: {},
      // id: Number(this.$route.query.id),
      // t_id: Number(this.$route.query.t_id),
      id: this.$route.query.id.toString(),
      t_id: this.$route.query.t_id.toString(),
      tableData: [],
      dialogFormVisible: false,
      loadings: false,
      queryParams: {
        page: 1,
        limit: 10,
        delivery: null,
        orderBy: null
      },
      form: {},
      forms: {
        nickName: null
      }
    };
  },
  mounted() {
    this.getList();
    this.serchornaments();
  },
  methods: {
    addOr(res) {
      this.form.nickName = res.nickName;
      this.form.userId = res.userId;
      this.$refs.morePop.doClose();
    },

    handleSubmit() {
      namedWinner(this.form).then(res => {
        this.dialogFormVisible = false;
        this.getList();
        this.$message({
          message: "编辑成功",
          type: "success"
        });
      });
    },
    serchornaments() {
      this.loadings = true;
      listUser(this.queryParams).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loadings = false;
      });
    },

    handleAppoint(res) {
      let aa = {
        productId: res.id,
        deliveryRecordId: this.t_id,
        partyType: parseInt(this.partyType)
      };
      this.$confirm("确定购买发货？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          tradeBuy(aa).then(res => {
            this.getList();
            this.$message({
              type: "success",
              message: "购买发货成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消购买发货"
          });
        });
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
    resetQuery() {
      this.queryParams = {
        page: 1,
        limit: 10,
        delivery: null,
        orderBy: null
      };
      this.getList();
    },
    handleQuery() {
      this.getList();
    },
    getList() {
      this.loading = true;
      let data = {
        partyType: parseInt(this.partyType),
        ornamentsId: []
      }
      data.ornamentsId.push(this.id);
      getAvailableMarketList(data).then(res => {
        this.total = res.data.length;
        this.tableData = res.data;
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
