<template>
  <div class="level-container">
    <div class="level-main">
      <!-- 冠军 -->
      <div class="level-1" v-if="championData.team && championData.team.result">
        <div class="rank-winner">
          <div class="winner-avatar">
            <img :src="championData.team.teamAvatar" alt="">
          </div>
          <p v-if="championData.team && championData.team.teamName">{{ championData.team.teamName }}</p>
          <div class="avatar-bg"></div>
        </div>
      </div>
      <div class="level-1" v-else-if="championData.opponentTeam && championData.opponentTeam.result">
        <div class="rank-winner">
          <div class="winner-avatar">
            <img :src="championData.opponentTeam.teamAvatar" alt="">
          </div>
          <p v-if="championData.opponentTeam && championData.opponentTeam.teamName">{{ championData.opponentTeam.teamName }}</p>
          <div class="avatar-bg"></div>
        </div>
      </div>
      <div class="level-1" v-else>
        <div class="rank-winner">
          <div class="winner-avatar">
            <img src="@/assets/images/u1.png" alt="">
          </div>
          <p v-if="championData.team && championData.team.teamName">{{ championData.team.teamName }}</p>
          <div class="avatar-bg"></div>
        </div>
      </div>
      <!-- 决赛 -->
      <div class="arrow">
        <div></div>
        <div></div>
      </div>
      <div class="level-2 common-level">
        <level-item
            :data="item"
            :showTitle="true"
            label="决赛"
            v-for="(item, index) in upgradeData[4]"
            :key="index"
            class="level-item-wrap" />
      </div>
      <!-- 四强 -->
      <div class="level-group-title">
        <span>四强赛</span>
      </div>
      <div class="level-4 common-level">
        <level-item
            :data="item"
            :showTitle="true"
            v-for="(item, index) in upgradeData[3]"
            :key="index"
            class="level-item-wrap" />
      </div>
      <!-- 八强 -->
      <div class="level-group-title">
        <span>八强赛</span>
      </div>
      <div class="level-8 common-level">
        <level-item
            :data="item"
            :showTitle="true"
            v-for="(item, index) in upgradeData[2]"
            :key="index"
            class="level-item-wrap" />
      </div>
    </div>
    <!-- 分组赛 -->
    <div class="level-group">
      <div class="level-group-title">
        <span>分组赛</span>
      </div>
      <div class="level-group-round" v-for="(item, index) in groupData" :key="index">
        <div class="level-group-round-header">
          <h2 :style="{ backgroundColor: roundColor(index) }">第 {{ index + 1 }} 回合</h2>
        </div>
        <div class="level-group-round-list">
          <level-item
            :data="subItem"
            :showTitle="true"
            v-for="(subItem, subIndex) in item"
            :key="subIndex"
            class="level-item-wrap" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import levelItem from './levelItem.vue';

export default {
  name: "Level",
  components: {levelItem},
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  computed: {
    // 晋级赛数据处理
    upgradeData() {
      let res = {}
      for (let i = 2; i <= 4; i++) {
        const data = this.data.find(item => item.type === i)
        res[i] = []
        data.stageGroupList.forEach(item => {
          const roundData = item.stageGroupFightList.filter(ele => ele.round === 1)
          res[i] = res[i].concat(...roundData)
        });
      }
      // 八强
      if (res[2].length < 4) {
        for (let j = res[2].length; j < 4; j++) {
          res[2].push({
            team: {
              teamName: '暂无队伍'
            },
            opponentTeam: {
              teamName: '暂无队伍'
            }
          })
        }
      }
      // 四强
      if (res[3].length < 2) {
        for (let j = res[3].length; j < 2; j++) {
          res[3].push({
            team: {
              teamName: '暂无队伍'
            },
            opponentTeam: {
              teamName: '暂无队伍'
            }
          })
        }
      }
      // 决赛
      if (res[4].length < 1) {
        for (let j = res[4].length; j < 1; j++) {
          res[4].push({
            team: {
              teamName: '暂无队伍',
              result: false
            },
            opponentTeam: {
              teamName: '暂无队伍',
              result: false
            }
          })
        }
      }
      // 冠军数据处理
      this.championData = res[4][0]
      return res
    },
    // 分组赛数据处理
    groupData() {
      const data = this.data.find(item => item.type === 1)
      let res = new Array(3).fill(null).map(() => [])
      data.stageGroupList.forEach(item => {
        for (let i = 0; i < 3; i++) {
          const roundData = item.stageGroupFightList.filter(ele => ele.round === i + 1)
          res[i] = res[i].concat(...roundData)
        }
      });
      for (let i = 0; i < 3; i++) {
        if (res[i].length < 8) {
          for (let j = res[i].length; j < 8; j++) {
            res[i].push({
              team: {
                teamName: '暂无队伍',
                result: false
              },
              opponentTeam: {
                teamName: '暂无队伍',
                result: false
              }
            })
          }
        }
      }
      return res
    },
    roundColor() {
      return (index) => {
        switch (index) {
          case 0: return '#FF952A';
          case 1: return '#FF3C2A';
          case 2: return '#602bCF';
          default: return '#FF952A';
        }
      }
    }
  },
  data() {
    return {
      championData: {}
    }
  }
};
</script>
<style lang="scss" scoped>
.level-container {
  .common-level {
    background-color: #ddd;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    margin-top: 20px;
  }
  .level-1 {
    width: 100%;
    height: 140px;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
    .rank-winner {
      position: absolute;
      z-index: 2;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .winner-avatar {
      // TODO
      // background-image: var(--bg-winner-avatar);
      background-image: url('../../../assets/images/avatarBorder.png');
      background-size: contain;
      background-repeat: no-repeat;
      width: 88px;
      height: 88px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 8%;
      transform: translateX(5%);
      img {
        width: 61px;
        height: 61px;
        border-radius: 50%;
        transform: translate(-3px, 3px);
        background-color: #999;
      }
    }
    p {
      font-family: "titleFont", "Microsoft YaHei", 'sans-serif';
      font-size: 15px;
    }
    .avatar-bg {
      // TODO
      background-image: url('../../../assets/images/avatarBg.png');
      background-size: contain;
      background-repeat: no-repeat;
      width: 140px;
      height: 40px;
      margin-top: -16%;
    }
  }
}
.level-group {
  .level-group-round {
    background-color: #ddd;
    border-radius: 12px;
    margin-bottom: 20px;
  }
  .level-group-round-header {
    display: flex;
    justify-content: center;
    h2 {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      padding: 0 28px;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
    }
  }
  .level-group-round-list {
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
  }
}
.level-group-title {
  background: url('../../../assets/images/t0.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 94%;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  span {
    font-family: "titleFont", "Microsoft YaHei", 'sans-serif';
  }
}
.level-item-wrap {
  width: 25%;
  margin: 0 auto;
}
.arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(10px);
  div:nth-of-type(1) {
    width: 0;
    height: 0;
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
    border-bottom: 16px solid rgb(233, 162, 8);
  }
  div:nth-of-type(2) {
    width: 14px;
    height: 15px;
    background-color: rgb(233, 162, 8);
  }
}
</style>
