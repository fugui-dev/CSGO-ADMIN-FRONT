<template>
  <div class="app-container home">
    <el-row>
      <div class="top1">
        <el-col :span="6">
          <div class="box1" @click="handto(1)">
            <div>
              <h1>{{total}}</h1>
              <p>在线用户</p>
            </div>
            <div class="iconall">
              <i class="el-icon-s-custom"></i>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="box2" @click="handto(2)">
            <div>
              <h1>￥{{totalRecord.toFixed(2)}}</h1>
              <p>总充值：{{totalRecord.toFixed(2)}}</p>
            </div>
            <div class="iconall">
              <i class="el-icon-s-order"></i>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="box3" @click="handto(3)">
            <div>
              <h1>{{totaldeliver}}</h1>
              <p>待处理提货申请</p>
            </div>
            <div class="iconall">
              <i class="el-icon-shopping-cart-1"></i>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="box4">
            <div>
              <h1>${{balance}}</h1>
              <p>ZBT余额</p>
            </div>
            <div class="iconall">
              <i class="el-icon-wallet"></i>
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
    <el-row style="margin-top: 25px;">
      <el-col :span="24">
        <div id="main"></div>
      </el-col>
    </el-row>
    <el-col :span="6">
      <div class="with-box" v-if="info">
        <div class="with-header">ZBT信息</div>
        <div class="with-border">
          <div class="wite-line">
            <div>帐号余额</div>
            <div>{{ info.balance }}</div>
          </div>
          <div class="wite-line">
            <div>余额预警值</div>
            <div>{{ info.balanceLack }}</div>
          </div>
          <div class="wite-line">
            <div>appKey</div>
            <div>{{ info.appKey }}</div>
          </div>
          <div class="wite-line">
            <div>appSecret</div>
            <div>{{ info.appSecret }}</div>
          </div>
          <div class="wite-line" @click="handleClick">
            <div>白名单Ip</div>
            <div v-if="isShow == false">已隐藏</div>
            <div v-if="isShow == true" id="ip">{{ info.grantIpList.replaceAll(',', " | ") }}</div>
          </div>
          <div class="wite-line">
            <div>回调地址</div>
            <div>{{ info.callbackUrl }}</div>
          </div>
          <div class="wite-line">
            <div>当前状态</div>
            <div v-if="info.status == 'NORMAL'">正常</div>
          </div>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
import { listUser_Online } from "@/api/skins/ttuser/api";
import { getBalance, developmentInfo } from "@/api/index";
import { deliverGoodslist } from "@/api/skins/ttdelivery/api";
import { rechargeRecord } from "@/api/skins/ttRecharge/api";
import { getOperationalStatistics } from "@/api/skins/ttSetting/api";

import * as echarts from "echarts";

export default {
  name: "Index",
  data() {
    return {
      date: [],
      deliveryPriceTotal: [],
      profit: [],
      rechargePriceTotal: [],
      totaldeliver: null,
      totalRecord: Number(0),
      isShow: false,
      info: null,
      total: null,
      balance: 0,
      // 版本号
      version: "3.8.6",
      queryParams: {
        pageNum: 1,
        pageSize: 99999999
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleClick(res) {
      this.isShow = !this.isShow;
    },
    draw() {
      var chartDom = document.getElementById("main");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: "近30日充值"
        },
        legend: {
          data: ["充值总金额", "提货总金额", "利润"]
        },
        tooltip: {
          trigger: "axis"
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack"] },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: "category",
          data: this.date
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "充值总金额",
            data: this.rechargePriceTotal,
            type: "line",
            showBackground: true,
            show: false,
            smooth: true
          },
          {
            name: "提货总金额",
            data: this.deliveryPriceTotal,
            type: "line",
            showBackground: true,
            show: false,
            smooth: true
          },
          {
            name: "利润",
            data: this.profit,
            type: "line",
            smooth: true
          }
        ]
      };

      option && myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    handto(res) {
      if (res == 1) {
        this.$router.push("/user/ipAddr");
      } else if (res == 2) {
        this.$router.push("/currency/ttRechargeRecord");
      } else if (res == 3) {
        this.$router.push("/delivery/index");
      }
    },
    getList() {
      developmentInfo().then(res => {
        this.info = res.data;
      });
      getBalance().then(res => {
        this.balance = Number(res.data.data).toFixed(2);
      });
      listUser_Online(this.queryParams).then(response => {
        this.list = response.rows;
        this.total = response.total;
      });
      deliverGoodslist(this.queryParams).then(res => {
        this.tableData = res.rows;
        this.totaldeliver = res.total;
      });
      rechargeRecord(this.queryParams).then(res => {
        res.rows.forEach(element => {
          if (element.anchorVirtual != 1){
            this.totalRecord += Number(element.arrivalAmount);
          }
        });
      });
      getOperationalStatistics().then(res => {

        res.data.forEach(e => {
          this.date.push(e.date);
          this.deliveryPriceTotal.push(e.deliveryPriceTotal);
          this.profit.push(e.profit);
          this.rechargePriceTotal.push(e.rechargePriceTotal);
          this.draw();
        });
      });
    },
    goTarget(href) {
      window.open(href, "_blank");
    }
  }
};
</script>

<style scoped lang="scss">
.with-box {
  width: 90%;
  margin: 0 auto;
  background-color: rgb(0, 157, 220);
  border: 1px solid rgb(0, 157, 220);
  border-radius: 15px;
  color: #fff;
  .with-header {
    height: 41px;
    width: 100%;
    padding: 10px;
    font-size: 18px;
    border-bottom: 1px solid rgb(221, 254, 225);
  }
  .with-border {
    width: 96%;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 10px;
    .wite-line {
      position: relative;
      display: flex;
      border-top: 1px solid rgb(204, 238, 225);

      .tag {
        position: absolute;
        right: 0;
      }
      :first-child {
        width: 90.63px;
        padding: 10px;
      }
      :last-child {
        padding: 10px;
      }
    }
  }
}
.wd {
  width: 200px;
  height: 150px;
  border-radius: 5px;
  .wdss {
    display: flex;
  }
}
#main {
  width: 100%;
  height: 410px;
}
.navto {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 26px;
  background: rgba(0, 0, 0, 0.1);
  text-align: center;
  line-height: 26px;
  color: rgba(255, 255, 255, 0.8);
  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
    color: rgba(255, 255, 255, 1);
    .fy {
      color: rgba(255, 255, 255, 1);
    }
  }
  .fy {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
  }
}
.top1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.box1,
.box2,
.box3,
.box4 {
  width: 94%;
  margin: 0 auto;
  height: 130px;
  background-color: #00c0ef;
  padding: 10px;
  position: relative;
  border-radius: 15px;
  &:hover {
    .iconall {
      transform: scale(1.3);
    }
  }
  .iconall {
    width: 80px;
    height: 80px;
    font-size: 80px;
    position: absolute;
    opacity: 0.7;
    right: 10px;
    top: 10px;
    transition: all 0.5s ease;
  }
  h1 {
    font-size: 38px;
    font-weight: 700;
    margin: 0 0 0 0;
    color: #fff;
  }
  p {
    font-size: 15px;
    color: #fff;
    margin: 0 0 0 0;
  }
}
.box2 {
  background-color: #f39c12;
}
.box3 {
  background-color: #00a65a;
}
.box4 {
  background-color: #dd4b39;
}
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

