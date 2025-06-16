<template>
  <div>
    <div class="shoppingbox">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline" v-show="showSearch">
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
        <el-form-item label="是否上架">
          <el-select v-model="queryParams.isPutaway" placeholder="请选择" clearable>
            <el-option
              v-for="dict in dict.type.shopping_isputaway_status"
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
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button
          :disabled="multiple"
          v-hasPermi="['admin:shopping:putAway']"
          type="success"
          round
          size="mini"
          @click="putAway(0)"
        >上架</el-button>

        <el-button
          :disabled="multiple"
          v-hasPermi="['admin:shopping:soldOut']"
          type="warning"
          round
          size="mini"
          @click="soldOut(1)"
        >下架</el-button>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
    </div>
    <div class="shoppinglist">
      <el-table
        :data="ornamentsList"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <!--<el-table-column prop="id" label="饰品ID" width="150" align="center"></el-table-column>-->
        <el-table-column prop="shortName" label="饰品名称" width="350" align="center"></el-table-column>
        <el-table-column label="饰品封面" align="center">
          <template slot-scope="scope" width="200">
            <image-preview :src="scope.row.imageUrl" :width="60" :height="60" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="外观" width="180">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.exteriorName != ''">{{ scope.row.exteriorName }}</el-tag>
            <el-tag type="danger" v-else>无涂装</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" width="180">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.typeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="usePrice" label="价格" width="180"></el-table-column>
        <el-table-column align="center" label="弹药" prop="useCredits" width="180"></el-table-column>
        <el-table-column align="center" label="是否上架" width="180">
          <template slot-scope="scope">
            <div
              v-if="scope.row.isPutaway == '0'"
              style="display:flex; align-items:center;justify-content:center;line-height: 1;"
            >
              上架
              <span
                style="width: 8px; height:8px; margin-left:5px;   border-radius: 50%;   background-color: green; display:inline-block;"
              ></span>
            </div>
            <div
              v-if="scope.row.isPutaway == '1'"
              style="display:flex; align-items:center;justify-content:center;"
            >
              下架
              <span
                style="width: 8px; height:8px; margin-left:5px;   border-radius: 50%;   background-color: #696969; display:inline-block;"
              ></span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pgclass">
      <pagination
        v-show="total > 0"
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.pageNum"
        :total="total"
        @pagination="getList"
      />
      <!-- <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="20"
        layout="->, total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>-->
    </div>
  </div>
</template>
<script>
import {
  shoppingList,
  batchPutAwayOrSoldOut
} from "@/api/skins/ttShopping/api";
export default {
  dicts: [
    "shopping_isputaway_status",
    "ornaments_exterior_name",
    "ornaments_type_name"
  ],
  data() {
    return {
      dialogVisible: false,
      multiple: true,
      ids: [],
      single: true,
      loading: false,
      total: 0,
      tableData: [],
      showSearch: true,
      formInline: {
        id: "",
        itemName: "",
        isPutaway: ""
      },
      listBatch: [],
      ornamentsList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: "",
        itemName: "",
        isPutaway: "",
        exterior: "",
        minPrice: "",
        maxPrice: "",
        type: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    fun(val) {
      return Number(val).toFixed(0);
    },
    resetQuery() {
      this.queryParams.id = "";
      this.queryParams.itemName = "";
      this.queryParams.isPutaway = "";
      this.queryParams.exterior = "";
      this.queryParams.maxPrice = "";
      this.queryParams.minPrice = "";
      this.queryParams.type = "";
      this.getList();
    },
    soldOut(status) {
      this.$confirm(`确定下架吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          batchPutAwayOrSoldOut(this.listBatch, status).then(res => {
            this.getList();
          });
          this.$message({
            type: "success",
            message: "下架成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下架"
          });
        });
    },
    putAway(status) {
      this.$confirm(`确定上架吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          batchPutAwayOrSoldOut(this.listBatch, status).then(res => {
            this.getList();
          });
          this.$message({
            type: "success",
            message: "上架成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消上架"
          });
        });
    },
    updateBrandState(res) {
      batchPutAwayOrSoldOut([res]).then(res => {
        this.getList();
      });
    },
    handleSelectionChange(selection) {
      this.listBatch = selection;
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    changeisPutaway(e) {
    },
    handleSizeChange(res) {
      (this.queryParams.pageSize = res), this.getList();
    },
    handleCurrentChange(res) {
      (this.queryParams.pageNum = res), this.getList();
    },
    onSubmit() {
      this.getList();
    },
    getList() {
      this.loading = true;
      shoppingList(this.queryParams).then(response => {
        this.ornamentsList = [];
        this.ornamentsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    }
  }
};
</script>
<style scoped lang="scss">
.pgclass {
  padding: 20px;
}

.shoppingbox {
  width: 98%;
  margin: 0 auto;
  margin-top: 20px;
}

.shoppinglist {
  margin: 0 auto;
  margin-top: 20px;
  width: 98%;
}
</style>
