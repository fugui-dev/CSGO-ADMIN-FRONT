<template>
  <div class="home">
    <el-table :data="userData" style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="nickName" label="用户昵称"></el-table-column>
      <el-table-column align="center" prop="name" label="用户头像">
        <template slot-scope="scope">
          <image-preview :src="scope.row.avatar" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="code" label="座位号"></el-table-column>
      <el-table-column align="center" prop="joinSeatNum" label="掉落饰品">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.row.ornamentsDataList)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="left" label="获胜" style="margin-left: 5px;">
        <template slot-scope="scope">
          <span v-if="scope.row.isWin">
            <span class="ds" style="background-color: #00a65a;"></span>
            是
            <el-button
              type="text"
              style="margin-left: 25px;"
              @click="handleView(scope.row.winnerOrnamentsDataList)"
            >赢家所得饰品</el-button>
          </span>
          <span v-else>
            <span class="ds" style="background-color: #dd4b39;"></span>否
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="掉落饰品" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column align="center" property="imageUrl" label="饰品图片">
          <template slot-scope="scope">
            <image-preview :src="scope.row.imageUrl" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column align="center" property="ornamentName" label="饰品名称"></el-table-column>
        <el-table-column align="center" property="ornamentId" label="饰品ID"></el-table-column>
        <el-table-column align="center" property="ornamentLevelImg" label="饰品级别">
          <template slot-scope="scope">
            <image-preview :src="scope.row.levelImg" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column align="center" property="ornamentsLevelId" label="饰品级别ID"></el-table-column>
        <el-table-column align="center" property="ornamentsPrice" label="饰品价格"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getFightResult } from "@/api/skins/ttFight/api";

export default {
  data() {
    return {
      loading: false,
      dialogTableVisible: false,
      tableData: [],
      userData: [],
      gridData: [],
      winnerData: [],
      id: Number(this.$route.query.id),
      boxId: Number(this.$route.query.id)
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleView(res) {
      this.gridData = [];
      this.gridData = res;
      this.dialogTableVisible = true;
    },
    getList() {
      this.loading = true;
      getFightResult(this.id).then(res => {
        this.loading = false;
        this.tableData = res.data;
        this.userData = res.data.fight.seats;
        this.winnerData = res.data.winnerGainsOrnamentsData;
        // 初始化userData中每个元素的ornamentsDataList
        this.userData.forEach(element => {
          element.ornamentsDataList = [];
        });
        this.userData.forEach(element => {
          element.winnerOrnamentsDataList = [];
        });
        this.userData.forEach(element => {
          if (res.data.winnerIds.includes(element.playerId)) {
            element.isWin = 1
          } else {
            element.isWin = 0
          }
          // 查找fightResult中userId与element.playerId相等的对象
          let results = res.data.fightResult.filter(item => item.userId === element.playerId);
          results.forEach(result => {
            let ornamentsData = {
              imageUrl: result.imageUrl,
              ornamentName: result.ornamentName,
              ornamentId: result.ornamentId,
              ornamentLevelImg: result.ornamentLevelImg,
              ornamentsLevelId: result.ornamentsLevelId,
              ornamentsPrice: result.ornamentsPrice
            }
            element.ornamentsDataList.push(ornamentsData);
          });
          let winnerResults = res.data.fightResult.filter(item => item.holderUserId === element.playerId);
          // 如果存在匹配结果，将每个结果添加到 winnerOrnamentsDataList 中
          winnerResults.forEach(winnerResult => {
            let ornamentsData = {
              imageUrl: winnerResult.imageUrl,
              ornamentName: winnerResult.ornamentName,
              ornamentId: winnerResult.ornamentId,
              ornamentLevelImg: winnerResult.ornamentLevelImg,
              ornamentsLevelId: winnerResult.ornamentsLevelId,
              ornamentsPrice: winnerResult.ornamentsPrice
            };
            element.winnerOrnamentsDataList.push(ornamentsData);
          });
        });
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
</style>