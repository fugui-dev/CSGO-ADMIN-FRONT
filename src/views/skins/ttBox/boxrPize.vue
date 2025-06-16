<template>
  <div class="home">
    <div style="margin-bottom: 10px;">
      <el-button size="mini" type="primary" plain @click="handleCreat">新增</el-button>
      <el-button size="mini" type="success" plain @click="handleChanges" :disabled="single">修改</el-button>
      <el-button size="mini" type="danger" plain @click="handleDels" :disabled="multiple">删除</el-button>
    </div>

    <el-table :data="gridData" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />

      <el-table-column align="center" property="id" label="id" width="50"></el-table-column>
      <el-table-column align="center" property="name" label="名称"></el-table-column>
      <el-table-column align="center" property="address" label="封面">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" alt width="40px" height="40px" />
        </template>
      </el-table-column>
      <el-table-column align="center" property="level" label="颜色">
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
      <el-table-column align="center" property="usePrice" label="金额"></el-table-column>

      <el-table-column
        align="center"
        :label="'显示爆率'+'\n'+'总利润'+Profit.oddsTotalProfit+ '  ' + '总利润率'+Profit.oddsTotalProfitMargin"
      >
        <el-table-column align="center" property="odds" :label="'数量'+'(总'+Profit.oddsTotalNum+'件)'">
          <template slot-scope="scope">
            <el-popover placement="top" popper-class="layout">
              <el-row>
                <div style="text-align: center;">
                  <el-row>
                    <el-col :span="18">
                      <el-input v-model="scope.row.odds" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                      <div style="text-align: right; margin: 0;line-height:36px">
                        <el-button size="mini" type="text" @click="handleR">取消</el-button>
                        <el-button type="text" size="mini" @click="handleChangeType(scope.row)">确定</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <el-button slot="reference" type="text" class="under">{{scope.row.odds}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" property="oddsPercentum" label="爆率(100%)"></el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        :label="'真实爆率'+'\n'+'总利润'+Profit.realOddsTotalProfit + '  ' + '总利润率'+Profit.realOddsTotalProfitMargin "
      >
        <el-table-column
          align="center"
          property="realOdds"
          :label="'数量'+'(总'+Profit.realOddsTotalNum +'件)'"
        >
          <template slot-scope="scope">
            <el-popover placement="top" popper-class="layout">
              <el-row>
                <div style="text-align: center;">
                  <el-row>
                    <el-col :span="18">
                      <el-input v-model="scope.row.realOdds" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                      <div style="text-align: right; margin: 0;line-height:36px">
                        <el-button size="mini" type="text" @click="handleR">取消</el-button>
                        <el-button type="text" size="mini" @click="handleChangeType(scope.row)">确定</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <el-button slot="reference" type="text" class="under">{{scope.row.realOdds}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" property="realOddsPercentum" label="爆率(100%)"></el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        :label="'主播爆率'+'\n'+'总利润'+Profit.anchorOddsTotalProfit + '  ' + '总利润率'+Profit.anchorOddsTotalProfitMargin"
      >
        <el-table-column
          align="center"
          property="anchorOdds"
          :label="'数量'+'(总'+Profit.anchorOddsTotalNum +'件)'"
        >
          <template slot-scope="scope">
            <el-popover placement="top" popper-class="layout">
              <el-row>
                <div style="text-align: center;">
                  <el-row>
                    <el-col :span="18">
                      <el-input v-model="scope.row.anchorOdds" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                      <div style="text-align: right; margin: 0;line-height:36px">
                        <el-button size="mini" type="text" @click="handleR">取消</el-button>
                        <el-button type="text" size="mini" @click="handleChangeType(scope.row)">确定</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <el-button slot="reference" type="text" class="under">{{scope.row.anchorOdds}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" property="anchorOddsPercentum" label="爆率(100%)"></el-table-column>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleChange(scope.row)">修改</el-button>
          <el-button type="text" @click="handleView(scope.row)">查看</el-button>
          <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getlist"
    />
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="宝箱" :label-width="formLabelWidth">
          <el-select v-model="form.boxId" placeholder="请选择宝箱">
            <el-option
              v-for="item in boxList"
              :key="item.boxId"
              :label="item.boxName"
              :value="item.boxId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择饰品" :label-width="formLabelWidth">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="hover"
            ref="morePop"
            @show="popShow"
            @hide="popHidden"
          >
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
        <el-form-item label="颜色" :label-width="formLabelWidth">
          <el-select v-model="form.ornamentsLevelId" placeholder="请选择颜色">
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.level"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示数量" :label-width="formLabelWidth">
          <el-input-number v-model="form.odds" :min="0" :max="10000" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="真实数量" :label-width="formLabelWidth">
          <el-input-number v-model="form.realOdds" :min="0" :max="10000" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="主播数量" :label-width="formLabelWidth">
          <el-input-number v-model="form.anchorOdds" :min="0" :max="10000" label="描述文字"></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="幸运物品数量" :label-width="formLabelWidth">
          <el-input-number v-model="form.luckOdds" :min="0" :max="10000" label="描述文字"></el-input-number>
        </el-form-item>-->
        <!-- <el-form-item label="幸运物品" :label-width="formLabelWidth">
          <el-radio-group v-model="form.isLuck">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitone" v-if="type==1">确 定</el-button>
        <el-button type="primary" @click="handleSubmittwo" v-if="type==2">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改饰品" :visible.sync="dialogFormVisibles">
      <el-form ref="form" :model="form" label-width="150px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="	宝箱ID">{{ form.boxId }}</el-form-item>
            <el-form-item label="饰品级别ID">{{ form.level }}</el-form-item>
            <el-form-item label="显示数量">{{ form.odds}}</el-form-item>
            <el-form-item label="真实数量">{{ form.realOdds}}</el-form-item>
            <el-form-item label="主播数量	">{{ form.anchorOdds }}</el-form-item>
            <!-- <el-form-item label="幸运物品数量">{{ form.luckOdds}}</el-form-item> -->
            <!-- <el-form-item label="幸运物品" prop="isLuck">
              <span v-if="form.isLuck === '0'">否</span>
              <span v-if="form.isLuck === '1'">是</span>
            </el-form-item>-->
          </el-col>
          <el-col :span="12">
            <el-form-item label="	饰品ID">{{ form.ornamentId }}</el-form-item>
            <el-form-item label="饰品名称">{{ form.itemName}}</el-form-item>

            <el-form-item label="更新者：">{{ form.updateBy ||'无' }}</el-form-item>
            <el-form-item label="更新时间：">{{ form.updateTime ||'未更新' }}</el-form-item>

            <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibles = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listBox,
  getBoxOrnaments,
  saveBoxOrnaments,
  addBoxOrnaments,
  getidBoxOrnaments,
  delBoxOrnaments,
  getProfitMargin
} from "@/api/skins/ttBox/api";
import { listOrnaments } from "@/api/skins/ttOrnaments/api";
import { listLevel } from "@/api/skins/ttOrnamentsLevel/api";
export default {
  data() {
    return {
      profit: 0,
      odds: 0,
      real: 0,
      luck: 0,
      anchor: 0,
      title: "",
      single: true,
      multiple: true,
      total: 1,
      formLabelWidth: "100px",
      levelList: [],
      form: {
        boxId: Number(this.$route.query.id),
        anchorOdds: 0,
        isLuck: 0,
        ornamentsLevelId: null,
        luckOdds: 0,
        odds: 0,
        ornamentId: null,
        realOdds: 0
      },
      dialogFormVisible: false,
      dialogFormVisibles: false,
      queryParams: {
        boxId: Number(this.$route.query.id),
        pageNum: 1,
        pageSize: 10
      },
      loading: false,
      loadings: false,
      orform: { itemName: null },
      gridData: [],
      boxList: [],
      orList: [],
      orOnselects: { itemName: "" },
      formAdd: {},
      id: this.$route.query.id,
      type: 1,
      Profit: {}
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    popHidden() {
      this.orform.itemName = "";
    },
    popShow() {
      this.serchornaments();
    },
    handleDels() {
      this.$modal
        .confirm('是否确认删除饰品编号为"' + this.ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          delBoxOrnaments(this.id, this.ids).then(res => {
            this.getlist();
            this.$modal.msgSuccess("删除成功");
          });
        })
        .catch(() => {});
    },
    handleDel(res) {
      this.$modal
        .confirm('是否确认删除饰品编号为"' + res.id + '"的数据项？')
        .then(() => {
          this.loading = true;
          delBoxOrnaments(this.id, res.id).then(res => {
            this.getlist();
            this.$modal.msgSuccess("删除成功");
          });
        })
        .catch(() => {});
    },

    handleChanges() {
      this.title = "修改饰品";
      this.type = 2;

      listBox(this.queryParams).then(res => {
        this.boxList = res.rows;
      });
      listLevel().then(response => {
        this.levelList = response.rows;
      });
      getidBoxOrnaments(this.ids[0]).then(res => {
        this.orOnselects.itemName = res.itemName;

        this.dialogFormVisible = true;
        this.form = res.data;
      });
    },
    handleView(res) {
      this.title = "饰品详情";
      getidBoxOrnaments(res.id).then(res => {
        this.dialogFormVisibles = true;

        this.form = res.data;
      });
    },
    handleChange(res) {
      this.title = "修改饰品";
      this.orOnselects.itemName = res.itemName;
      this.type = 2;
      listBox(this.queryParams).then(res => {
        this.boxList = res.rows;
      });
      listLevel().then(response => {
        this.levelList = response.rows;
      });
      getidBoxOrnaments(res.id).then(res => {
        this.dialogFormVisible = true;
        this.form = res.data;
      });
    },
    handleSubmitone() {
      addBoxOrnaments(this.form).then(res => {
        this.dialogFormVisible = false;
        this.$modal.msgSuccess("添加成功");
        this.orform.itemName = "";
        this.orOnselects.itemName = "";
        this.form = {
          boxId: Number(this.$route.query.id),
          anchorOdds: 0,
          isLuck: 0,
          ornamentsLevelId: null,
          luckOdds: 0,
          odds: 0,
          ornamentId: null,
          realOdds: 0
        };

        this.getlist();
      });
    },
    handleSubmittwo() {
      this.dialogFormVisible = false;
      this.loading = true;
      saveBoxOrnaments(this.form).then(res => {
        this.$modal.msgSuccess("添加成功");
        this.orform.itemName = "";
        this.orOnselects.itemName = "";
        this.getlist();
        this.form = {
          boxId: Number(this.$route.query.id),
          anchorOdds: 0,
          isLuck: 0,
          ornamentsLevelId: null,
          luckOdds: 0,
          odds: 0,
          ornamentId: null,
          realOdds: 0
        };
      });
    },
    addOr(res) {
      this.form.ornamentId = res.id;
      this.orOnselect = res;
      this.orOnselects.itemName = res.name + "   -   ￥" + res.usePrice;
      this.orform.itemName = null;
      this.orList = null;
      this.$refs.morePop.doClose();
    },
    serchornaments() {
      this.loadings = true;
      listOrnaments(this.orform).then(res => {
        this.orList = res.data.records;
        this.loadings = false;
      });
    },
    handleCreat() {
      this.title = "新增饰品";
      this.type = 1;
      this.orOnselects.itemName = "";
      this.form = {
        boxId: Number(this.$route.query.id),
        anchorOdds: 0,
        isLuck: 0,
        ornamentsLevelId: null,
        luckOdds: 0,
        odds: 0,
        ornamentId: null,
        realOdds: 0
      };
      this.dialogFormVisible = true;
      listBox(this.queryParams).then(res => {
        this.boxList = res.rows;
      });
    },
    scrollEventFn(e) {
      if (
        e.srcElement.scrollTop + e.srcElement.clientHeight >=
        e.srcElement.scrollHeight
      ) {
        if (typeof this.orform.pageNum === 'number') {
          this.orform.pageNum += 1;
        } else {
          this.orform.pageNum = 1;
        }
        this.orform.pageSize = 999;
        this.orform.pageNum = 1;
        listOrnaments(this.orform).then(res => {
          this.orList.push.apply(this.orList, res.rows);
        });
      }
    },
    handleR() {
      document.body.click();
    },
    handleChangeType(res) {
      document.body.click();
      this.loading = true;
      saveBoxOrnaments(res).then(res => {
        this.$modal.msgSuccess("修改成功");
        this.getlist();
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    getlist() {
      this.loading = true;
      getBoxOrnaments(
        this.queryParams.boxId,
        this.queryParams.pageNum,
        this.queryParams.pageSize
      ).then(res => {
        this.total = res.total;
        this.gridData = res.rows;
        this.loading = false;
        this.odds = 0;
        this.real = 0;
        this.luck = 0;
        this.anchor = 0;
        this.gridData.forEach(element => {
          this.odds += element.odds;
          this.real += element.realOdds;
          this.luck += element.luckOdds;
          this.anchor += element.anchorOdds;
          // this.profit += element
        });
      });
      listLevel().then(response => {
        this.levelList = response.rows;
      });
      getProfitMargin(this.id)
        .then(res => {
          this.Profit = res;
        })
        .catch(err => {
          this.Profit = {
            anchorOddsTotalNum: 0,
            anchorOddsTotalProfit: 0,
            anchorOddsTotalProfitMargin: 0,
            oddsTotalNum: 0,
            oddsTotalProfit: 0,
            oddsTotalProfitMargin: 0,
            realOddsTotalNum: 0,
            realOddsTotalProfit: 0,
            realOddsTotalProfitMargin: 0
          };
        });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep.under {
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
}
.home {
  padding: 20px;
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
::v-deep.el-table th.el-table__cell > .cell {
  white-space: pre !important;
}
</style>
