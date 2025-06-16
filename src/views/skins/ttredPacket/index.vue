<template>
  <div class="home">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="红包ID	" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入红包ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="红包标题	" prop="parentId">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入红包标题	"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="红包状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option label="进行中" value="0"></el-option>
          <el-option label="已结束" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button plain size="mini" @click="handleAdd">生成红包</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="id" label="红包ID"></el-table-column>
      <el-table-column align="center" prop="title" label="红包标题"></el-table-column>
      <el-table-column align="center" prop="num" label="红包个数"></el-table-column>
      <el-table-column align="center" prop="remainingNum" label="剩余红包个数">
        <template slot-scope="scope">
          <el-button type="text" @click="handleGo(scope.row)">{{scope.row.remainingNum}}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="amountRange" label="金额区间"></el-table-column>
      <el-table-column align="center" prop="password" label="红包口令" width="270"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == '0'" class="df">
            <span style="  background-color: #00a65a;" class="ds"></span>
            进行中
          </div>
          <div v-if="scope.row.status == '1'" class="df">
            <span style="  background-color: #dd4b39;" class="ds"></span>
            已结束
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="userId" label="主播ID">
        <template slot-scope="scope">
          <div v-if="scope.row.userId == '0'" class="df">无限制</div>
          <div v-else class="df">{{scope.row.userId}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="useStatus" label="是否启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.useStatus"
            :active-value="'0'"
            :inactive-value="'1'"
            inactive-color="#D9534F"
            active-color="#5CB85C"
            inactive-text="启用"
            active-text="禁用"
            @change="updateUserStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="description" label="红包描述"></el-table-column>

      <el-table-column align="center" prop="openingTime" label="红包开启时间" width="170"></el-table-column>
      <el-table-column align="center" prop="validity" label="红包有效期" width="170"></el-table-column>
      <el-table-column align="center" prop label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.row)">详情</el-button>
          <el-button type="text" @click="handleChaneg(scope.row)">修改</el-button>
          <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="红包开启限制" :label-width="formLabelWidth">
          <el-select v-model="form.userId" placeholder="请选择活动区域">
            <el-option label="无限制" :value="0"></el-option>
            <el-option
              v-for="item in userData"
              :key="item.userId"
              :label="item.nickName "
              :value="item.userId"
            >
              <span style="float: left">{{ item.nickName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
            </el-option>
          </el-select>
          <div style="font-size: 12px;">
            <i class="el-icon-info"></i> 无限制即任何人都可以开 否则表示仅主播下级用户可领取
          </div>
        </el-form-item>
        <el-form-item label="红包标题" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单个红包金额区间" prop="amount1" :label-width="formLabelWidth">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="amount1">
                <el-input
                  min="0"
                  type="number"
                  v-model="form.amount1"
                  @input="change($event)"
                  autocomplete="off"
                  placeholder="最低金额"
                ></el-input>
                <div style="font-size: 12px; color:#d9534f">
                  <i class="el-icon-info"></i>
                  总价值 {{this.form.amount1*this.form.num}} - {{this.form.amount2*this.form.num}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: center;">至</el-col>
            <el-col :span="6">
              <el-form-item prop="amount2">
                <el-input
                  min="0"
                  type="number"
                  v-model="form.amount2"
                  @input="change($event)"
                  autocomplete="off"
                  placeholder="最高金额"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="红包个数" prop="num" :label-width="formLabelWidth">
          <el-input-number v-model="form.num" :min="0" :max="9999" label="红包个数"></el-input-number>
        </el-form-item>
        <el-form-item label="红包描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="红包开启时间" prop="openingTime" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.openingTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="红包有效期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.validity"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="title == '生成红包'"
          label="生成数量"
          prop="createNum"
          :label-width="formLabelWidth"
        >
          <el-input-number v-model="form.createNum" :min="0" :max="100" label="生成数量"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="type == 1" type="primary" @click="hadnleSubmit('ruleForm')">确 定</el-button>
        <el-button v-if="type == 2" type="primary" @click="hadnleChangetrue('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="创建成功" :visible.sync="dialogTableVisible" width="30%">
      <div class="kami">
        <div v-for="(item,index ) in gridData.data" :key="index" style=" margin-top:1px;">{{ item }}</div>
      </div>
    </el-dialog>
    <el-dialog title="红包详情" :visible.sync="open">
      <el-form :model="form">
        <el-form-item label="红包开启限制" :label-width="formLabelWidth">
          <el-select v-model="form.userId" placeholder="请选择活动区域" disabled>
            <el-option label="无限制" :value="0"></el-option>
            <el-option
              v-for="item in userData"
              :key="item.userId"
              :label="item.nickName "
              :value="item.userId"
            >
              <span style="float: left">{{ item.nickName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
            </el-option>
          </el-select>
          <div style="font-size: 12px;">
            <i class="el-icon-info"></i> 无限制即任何人都可以开 否则表示仅主播下级用户可领取
          </div>
        </el-form-item>
        <el-form-item label="红包标题" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单个红包金额区间" prop="amount1" :label-width="formLabelWidth">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="amount1">
                <el-input
                  disabled
                  v-model="form.amount1"
                  @input="change($event)"
                  autocomplete="off"
                  placeholder="最低金额"
                ></el-input>
                <div style="font-size: 12px; color:#d9534f">
                  <i class="el-icon-info"></i>
                  总价值 {{this.form.amount1*this.form.num}} - {{this.form.amount2*this.form.num}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: center;">至</el-col>
            <el-col :span="6">
              <el-form-item prop="amount2">
                <el-input
                  disabled
                  v-model="form.amount2"
                  @input="change($event)"
                  autocomplete="off"
                  placeholder="最高金额"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="红包个数" prop="num" :label-width="formLabelWidth">
          <el-input-number v-model="form.num" :min="0" :max="9999" disabled label="红包个数"></el-input-number>
        </el-form-item>

        <el-form-item label="红包描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off" disabled type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="红包开启时间" prop="openingTime" disabled :label-width="formLabelWidth">
          <el-date-picker
            disabled
            v-model="form.openingTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="红包有效期" :label-width="formLabelWidth">
          <el-date-picker
            disabled
            v-model="form.validity"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRedPacket,
  addRedPacket,
  delRedPacket,
  getRedPacketid,
  changeRedPacket
} from "@/api/skins/ttredPacket/api";
import { listUser } from "@/api/skins/ttuser/api";
export default {
  data() {
    return {
      title: "生成红包",
      type: 1,
      rules: {
        createNum: [
          { required: true, message: "请输入生成数量", trigger: "blur" }
        ],
        amount1: [{ required: true, message: "请输入金额", trigger: "blur" }],
        amount2: [{ required: true, message: "请输入金额", trigger: "blur" }],
        title: [{ required: true, message: "请输入红包标题", trigger: "blur" }],
        openingTime: [
          { required: true, message: "请选择开启时间", trigger: "blur" }
        ],
        num: [
          { required: true, message: "请输入数量", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 9999,
            message: "请至少输入1个红包数",
            trigger: "blur"
          }
        ]
      },
      formLabelWidth: "130px",
      form: {
        num: 1,
        userId: 0,
        amount1: null,
        amount2: null,
        createNum: 1
      },
      cleanform: {
        num: 1,
        userId: 0,
        amount1: null,
        amount2: null,
        createNum: 1
      },
      dialogFormVisible: false,
      dialogTableVisible: false,
      open: false,
      total: 0,
      loading: false,
      tableData: [],
      gridData: {},
      userData: [],
      queryParamss: {
        pageNum: 1,
        pageSize: 30,
        userType: "01"
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        status: null,
        title: null
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleGo(res) {
      this.$router.push({
        path: "/ttredPacket/packetRecord",
        query: {
          id: res.id
        }
      });
    },
    change(e) {
      this.$forceUpdate();
    },
    updateUserStatus(res) {
      changeRedPacket(res)
        .then(res => {
          this.getList();
          this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .catch(err => {
          this.getList();
        });
    },
    handleView(res) {
      this.open = true;
      getRedPacketid(res.id).then(res => {
        this.form = res.data;
        this.form.amount1 = res.data.amountRange.split("-")[0];
        this.form.amount2 = res.data.amountRange.split("-")[1];
      });
    },
    hadnleChangetrue(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.amount =
            "[" + this.form.amount1 + "," + this.form.amount2 + "]";
          this.form.amount1 = null;
          this.form.amount2 = null;
          changeRedPacket(this.form).then(res => {
            this.dialogFormVisible = false;
            this.getList();
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          });
        } else {
          return false;
        }
      });
    },
    handleChaneg(res) {
      this.type = 2;
      this.title = "修改红包";
      this.form = { num: 1, userId: 0, amount1: null, amount2: null };
      this.dialogFormVisible = true;
      getRedPacketid(res.id).then(res => {
        this.form = res.data;

        this.form.amount1 = res.data.amountRange.split("-")[0];
        this.form.amount2 = res.data.amountRange.split("-")[1];
      });
    },
    handleDel(res) {
      delRedPacket(res.id).then(res => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getList();
      });
    },
    handleCope(data) {
      var txt = document.getElementById("txt").innerText; // 获取文本
      let textarea = document.createElement("textarea"); // 创建textarea文本框
      textarea.value = txt;
      textarea.readOnly = "readOnly";
      document.body.appendChild(textarea); // 追加元素
      textarea.select(); // 选中文本内容
      let result = document.execCommand("copy"); // 执行浏览器复制命令
      this.$message({
        type: "success",
        message: "复制成功!"
      });
      textarea.remove();
    },
    hadnleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.amount =
            "[" + this.form.amount1 + "," + this.form.amount2 + "]";
          this.form.amount1 = null;
          this.form.amount2 = null;
          addRedPacket(this.form).then(res => {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.getList();
            this.dialogFormVisible = false;
            this.dialogTableVisible = true;
            this.gridData = res;
          });
        } else {
          return false;
        }
      });
      //   this.form.amount = [
      //     Number(this.form.amount1),
      //     Number(this.form.amount2)
      //       ].toString();
    },
    handleAdd() {
      this.type = 1;
      this.title = "生成红包";
      this.form = {
        num: 1,
        userId: 0,
        amount1: null,
        amount2: null,
        createNum: 1
      };
      this.dialogFormVisible = true;
      listUser(this.queryParamss).then(res => {
        this.userData = res.rows;
      });
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        id: null,
        status: null
      };
      this.getList();
    },
    handleQuery() {
      this.getList();
    },
    getList() {
      this.loading = true;
      getRedPacket(this.queryParams).then(res => {
        this.tableData = res.rows;
        this.loading = false;
        this.total = res.total;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
}
.ds {
  width: 8px;
  height: 8px;
  margin-right: 10px;
  border-radius: 50%;
  display: inline-block;
}
.df {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
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
.kami {
  padding: 15px;
  background-color: #c3d1e4;
  color: #373232;
  border: 1px solid #8492a6;
  width: 95%;
  margin: 0 auto;
}
</style>