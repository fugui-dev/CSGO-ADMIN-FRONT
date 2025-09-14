<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 队伍排名 -->
      <el-tab-pane label="比赛队伍" name="teamRank">
        <el-table v-loading="loading" :data="teamRankList">
          <el-table-column align="center" label="队伍排名" prop="rank" width="80" />
          <el-table-column align="center" label="队伍ID" prop="id" width="80" />
          <el-table-column align="center" label="队伍名称" prop="name" />
          <el-table-column align="center" label="队伍头像" prop="avatar" width="100">
            <template slot-scope="scope">
              <image-preview :src="scope.row.avatar" :width="40" :height="40" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="队伍描述" prop="description" width="200" />
          <el-table-column align="center" label="人员最大数量" prop="maxMemberCount" width="100" />
          <el-table-column align="center" label="队伍人数" prop="memberCount" width="100" />
          <el-table-column align="center" label="队伍积分" prop="totalScore" width="100" />
          <el-table-column align="center" label="胜利场数" prop="winCount" width="100" />
          <el-table-column align="center" label="队长用户ID" prop="captainUserId" width="100" />
          <el-table-column align="center" label="状态" prop="status" width="170">
            <dict-tag :options="dict.type.champion_match_status" :value="championTeamInfo.status"/>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 冠军队伍 -->
      <el-tab-pane label="冠军队伍" name="championTeam">
        <div class="champion-team" v-if="championTeamInfo.name">
          <el-descriptions title="冠军队伍信息">
            <el-descriptions-item label="队伍头像">
              <img :src="championTeamInfo.avatar" alt="" class="winner-avatar">
            </el-descriptions-item>
            <el-descriptions-item label="队伍ID">{{ championTeamInfo.id }}</el-descriptions-item>
            <el-descriptions-item label="队伍名称">{{ championTeamInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="队伍描述">{{ championTeamInfo.description }}</el-descriptions-item>
            <el-descriptions-item label="人员最大数量">{{ championTeamInfo.maxMemberCount }}</el-descriptions-item>
            <el-descriptions-item label="队伍人数">{{ championTeamInfo.memberCount }}</el-descriptions-item>
            <el-descriptions-item label="队伍总分">{{ championTeamInfo.totalScore }}</el-descriptions-item>
            <el-descriptions-item label="胜利场数">{{ championTeamInfo.winCount }}</el-descriptions-item>
            <el-descriptions-item label="队长用户ID">{{ championTeamInfo.captainUserId }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <dict-tag :options="dict.type.champion_match_status" :value="championTeamInfo.status"/>
            </el-descriptions-item>
          </el-descriptions>
          <!-- 用户列表 -->
          <div class="user-list">
            <h4>队伍用户列表</h4>
            <el-table v-loading="loading" :data="championTeamInfo.matchUserList">
              <el-table-column align="center" label="用户ID" prop="userId" width="80" />
              <el-table-column align="center" label="用户名称" prop="userName" />
              <el-table-column align="center" label="用户头像" prop="userAvatar" width="100">
                <template slot-scope="scope">
                  <image-preview :src="scope.row.userAvatar" :width="40" :height="40" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="积分" prop="totalScore" width="100" />
              <el-table-column align="center" label="是否队长" prop="isCaptain" width="170">
                <template slot-scope="scope">
                  <span v-if="scope.row.isCaptain">是</span>
                  <span v-else>否</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="empty-box" v-else>暂无数据</div>
      </el-tab-pane>
      <!-- 晋级图 -->
      <el-tab-pane label="晋级图" name="level">
        <level v-if="levelData.length" :data="levelData"/>
        <div class="empty-box" v-else>暂无数据</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getMatchStageListApi, getTeamListApi } from "@/api/skins/ttChampion/api";
import level from "./level.vue";

export default {
  name: "MatchDetail",
  components: {level},
  dicts: [
    "champion_match_status"
  ],
  data() {
    return {
      activeName: 'teamRank',
      // 遮罩层
      loading: true,
      // 比赛阶段列表
      levelData: [],
      // 冠军队伍
      championTeamInfo: {},
      // 比赛队伍排名
      teamRankList: []
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取比赛阶段列表
    getList() {
      this.loading = true;
      const matchId = Number(this.$route.query.id)
      if (Number.isNaN(matchId)) return;

      getMatchStageListApi({matchId}).then(res => {
        if (res.code === 200) {
          this.levelData = res.data
          console.log(this.levelData)
        } else {
          this.$modal.msgError("请求失败");
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 获取冠军队伍
    getChampionTeamInfo() {
      this.loading = true;
      const matchId = Number(this.$route.query.id)
      if (Number.isNaN(matchId)) return;

      getTeamListApi({
        matchId: matchId,
        champion: true
      }).then(res => {
        if (res.data && res.data.length) {
          this.championTeamInfo = res.data[0]
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 获取队伍排名
    getTeamRank() {
      this.loading = true
      const matchId = Number(this.$route.query.id)
      if (Number.isNaN(matchId)) return;

      getTeamListApi({
        matchId: matchId.value,
        champion: false
      }).then(res => {
        if (res.data && res.data.length) {
          this.teamRankList = res.data
          this.teamRankList.sort((a, b) => a.rank - b.rank)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
      if (tab.paneName === 'level') {
        this.getList()
      } else if (tab.paneName === 'championTeam') {
        this.getChampionTeamInfo()
      } else if (tab.paneName === 'teamRank') {
        this.getTeamRank()
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.empty-box {
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #1890ff;
}
// .detail-container {
//   position: relative;

  .winner-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #999;
  }
  .user-list {
    margin-top: 30px;
  }
  .team-rank-list {
    width: 94%;
    margin: 20px auto;
  }
  .team-rank-list-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3px;
    padding: 5px 10px;
    height: 46px;
    box-sizing: border-box;
    background: linear-gradient(to right, rgb(91, 21, 7), rgb(66, 1, 15));
    div {
      font-family: "titleFont", "Microsoft YaHei", 'sans-serif';
      font-size: 14px;
      display: flex;
      align-items: center;
    }
    div:nth-of-type(2) {
      justify-content: center;
    }
    div:nth-of-type(3) {
      justify-content: end;
    }
  }
  .highlight {
    background: linear-gradient(to right, rgb(143, 5, 202), rgb(11, 11, 96));
  }
  .non-highlight {
    background: linear-gradient(to right, rgb(105, 94, 116), rgb(24, 24, 36));
  }
  .team-rank-list-item {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3px;
    padding: 5px 10px;
    .team-rank-list-item-left {
      display: flex;
      align-items: center;
      .serial-num {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid #aaa;
        background-color: #444;
        font-family: "titleFont", "Microsoft YaHei", 'sans-serif';
        font-size: 18px;
        color: #eee;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
      }
      img {
        width: 38px;
        height: 38px;
        border-radius: 6px;
        border: 1px solid #f2b307;
        margin-right: 4px;
      }
      span {
        font-family: "titleFont", "Microsoft YaHei", 'sans-serif';
        font-size: 13px;
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
        max-width: 120px;
      }
    }
    .team-rank-list-item-center {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-family: "titleFont", "Microsoft YaHei", 'sans-serif';
        font-size: 13px;
      }
    }
    .team-rank-list-item-right {
      display: flex;
      align-items: center;
      justify-content: end;
      padding-left: 4px;
      img {
        width: 10px;
        height: 13px;
        margin-right: 3px;
      }
      span {
        font-family: "titleFont", "Microsoft YaHei", 'sans-serif';
        font-size: 13px;
      }
    }
  }
  .team-rank-list-item:nth-of-type(2) {
    .serial-num {
      border: 1px solid #f2a814;
      color: #684412;
      background: linear-gradient(#f8debb, #fab71b);
    }
  }
  .team-rank-list-item:nth-of-type(3) {
    .serial-num {
      border: 1px solid #ccc;
      color: #ffffff;
      background: linear-gradient(#e9e7e3, #646463);
    }
  }
  .team-rank-list-item:nth-of-type(4) {
    .serial-num {
      border: 1px solid #f0edd9;
      color: #ffffff;
      background: linear-gradient(#e8dabf, #9c7315);
    }
  }
// }
</style>
