<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
          @click="handleAdd"
        >创建</el-button>
      </el-col>
      
      <right-toolbar @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="matchList">
      <el-table-column align="center" label="id" prop="id" width="55" />
      <el-table-column align="center" label="比赛名称" prop="name" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-discount"
            @click="handleWatch(scope.row)"
          >{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述" prop="description" width="170" />
      <el-table-column align="center" label="日期" prop="dayTime" width="100" />
      <el-table-column align="center" label="开始时间" prop="startTime" width="170" />
      <el-table-column align="center" label="结束时间" prop="endTime" width="170" />
      <el-table-column align="center" label="报名开放时间" prop="openTime" width="170" />
      <el-table-column align="center" label="报名开始时间" prop="signUpStartTime" width="170" />
      <el-table-column align="center" label="报名结束时间" prop="signUpEndTime" width="170" />
      <el-table-column align="center" label="金额" prop="amount" />
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.champion_match_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="队伍最大人数" prop="maxTeamNum" width="140" />
      <el-table-column align="center" label="队伍数量" prop="teamSize" />
    </el-table>

    <pagination
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />

    <!-- 创建比赛 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="比赛名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入比赛名称" />
        </el-form-item>
        <el-form-item label="比赛描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入比赛描述" />
        </el-form-item>
        <el-form-item label="报名费" prop="amount" class="number">
          <el-input-number v-model="form.amount" :precision="2" :step="0.1" :max="1000000"></el-input-number>
        </el-form-item>
        <el-form-item label="开放时间" prop="openTime">
          <el-date-picker
            v-model="form.openTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开放时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="比赛开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择比赛开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名截止时间" prop="signUpEndTime">
          <el-date-picker
            v-model="form.signUpEndTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择报名截止时间">
          </el-date-picker>
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
import { getMatchListApi, addMatchApi } from "@/api/skins/ttChampion/api";

export default {
  name: "Champion",
  dicts: [
    "champion_match_status"
  ],
  data() {
    return {
      
      
      // 遮罩层
      loading: true,
      
      // 总条数
      total: 0,
      // 比赛列表
      matchList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      formAdd: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "比赛名称不能为空", trigger: "blur" }
        ],
        description: [
          { required: true, message: "比赛描述不能为空", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "比赛开始时间不能为空", trigger: "blur" },
          { validator: this.validateDatetime, trigger: "blur" }
        ],
        signUpEndTime: [
          { required: true, message: "报名截止时间不能为空", trigger: "blur" },
          { validator: this.validateDatetime, trigger: "blur" }
        ],
        openTime: [
          { required: true, message: "开放时间不能为空", trigger: "blur" },
          { validator: this.validateDatetime, trigger: "blur" }
        ],
        amount: [
          { required: true, message: "报名费不能为空", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 1000000,
            message: "请输入合理的金额",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 验证日期
    validateDatetime(rule, value, callback) {
      if (new Date(value) <= new Date()) {
        callback(new Error('请选择未来日期'));
      } else {
        callback();
      }
    },

    /** 查询比赛列表 */
    getList() {
      this.loading = true;
      getMatchListApi(this.queryParams).then(res => {
        if (res.code === 200) {
          this.matchList = res.data.records
          this.total = res.data.total
        } else {
          this.$modal.msgError("请求失败");
        }
      }).finally(() => {
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
        name: null,
        description: null,
        amount: null,
        openTime: null,
        startTime: null,
        signUpEndTime: null
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "创建比赛";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addMatchApi(this.form).then(res => {
            if (res.code === 200) {
              this.$modal.msgSuccess(res.msg);
              this.open = false;
              this.getList();
            } else {
              this.$modal.msgError(res.msg);
            }
          });
        }
      });
    },
    /** 跳转比赛详情 */
    handleWatch(res) {
      this.$router.push({
        path: "/champion/matchDetail",
        query: {
          id: res.id
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep.number {
  .el-input--medium {
    width: 100px;
  }
  .el-input__inner {
    padding: 0;
  }
  .el-input-number__increase {
    display: none;
  }
  .el-input-number__decrease {
    display: none;
  }
}
::v-deep.under {
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
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
.box1 {
  padding: 14px;
  font-size: 16px;
  text-align: center;
}
.box2 {
  color: red;
}
#main {
  width: 500px;
  height: 400px;
}
</style>
