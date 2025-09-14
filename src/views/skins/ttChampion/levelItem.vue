<template>
  <div class="level-item">
    <div class="level-item-container" v-if="showTitle">
      <div
        class="level-item-status"
        v-if="showStatus"
        :style="{backgroundColor: statusBgColor}">
          {{ statusText }}
      </div>
      <div class="level-item-wrap">
        <div class="level-item-content pad-margin-left">
          <h3>{{ data.team.aliasName }}</h3>
          <img :src="data.team.teamAvatar" alt="" v-if="data.team.teamAvatar">
          <img src="@/assets/images/u1.png" alt="" v-else style="border: none; margin-top: 6px;">
          <p>{{ data.team.teamName }}</p>
        </div>
      </div>
      <div class="label-item-center">
        <p v-if="label" class="label">{{ label }}</p>
        <p class="vs">VS</p>
      </div>
      <div class="level-item-wrap level-item-right">
        <div class="level-item-content pad-margin-right">
          <h3>{{ data.opponentTeam.aliasName }}</h3>
          <img :src="data.opponentTeam.teamAvatar" alt="" v-if="data.opponentTeam.teamAvatar">
          <img src="@/assets/images/u1.png" alt="" v-else style="border: none; margin-top: 6px;">
          <p>{{ data.opponentTeam.teamName }}</p>
        </div>
      </div>
    </div>
    <div class="level-item-container" v-else>
      <div
        class="level-item-status"
        v-if="showStatus"
        :style="{backgroundColor: statusBgColor}">
          {{ statusText }}
      </div>
      <div class="level-item-wrap">
        <div class="level-item-content">
          <img :src="data.team.teamAvatar" alt="" v-if="data.team.teamAvatar">
          <img src="@/assets/images/u1.png" alt="" v-else style="border: none; margin-top: 6px;">
          <p>{{ data.team.teamName }}</p>
        </div>
      </div>
      <div class="label-item-center">
        <p v-if="label" class="label">{{ label }}</p>
        <p class="vs">VS</p>
      </div>
      <div class="level-item-wrap level-item-right">
        <div class="level-item-content">
          <img :src="data.opponentTeam.teamAvatar" alt="" v-if="data.opponentTeam.teamAvatar">
          <img src="@/assets/images/u1.png" alt="" v-else style="border: none; margin-top: 6px;">
          <p>{{ data.opponentTeam.teamName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Level",
  props: {
    showTitle: {
      type: Boolean
    },
    label: {
      type: String
    },
    data: {
      type: Object,
      required: true
    },
    showStatus: {
      type: Boolean
    },
    statusText: {
      type: String
    },
    statusBgColor: {
      type: String
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
.level-item-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
  background-color: #eee;
  border-radius: 8px;
  margin: 10px;
  position: relative;
  background: linear-gradient(to right, rgb(188, 145, 207), rgb(112, 112, 200));
  .level-item-status {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    padding: 0 14px;
    z-index: 3;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .pad-margin-left {
    background-color: #526fa4;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .pad-margin-right {
    background-color: #75559d;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .level-item-wrap {
    margin-right: 12px;
    margin-top: 12px;
    .level-item-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h3 {
        font-family: "titleFont", "Microsoft YaHei", 'sans-serif';
        font-size: 13px;
        color: #701818;
        margin: 4px;
      }
      img {
        width: 40px;
        height: 40px;
        border-radius: 6px;
        border: 1px solid #060ee8;
        margin-bottom: 2px;
        background-color: #666;
      }
      p {
        font-family: "titleFont", "Microsoft YaHei", 'sans-serif';
        font-size: 13px;
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
        max-width: 120px;
        margin: 4px;
      }
    }
    .level-item-btn {
      cursor: pointer;
      margin-top: 5px;
      font-size: 12px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      border-radius: 11px;
      background: linear-gradient(to right, rgb(143, 5, 202), rgb(11, 11, 96));
    }
  }
  .level-item-right {
    margin-left: 12px;
    margin-right: 0;
    img {
      border: 1px solid #7414f2;
    }
  }
  .label-item-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    .label {
      font-family: "titleFont", "Microsoft YaHei", 'sans-serif';
      color: #ddd;
      font-size: 14px;
      margin-bottom: 2px;
    }
    .vs {
      font-family: "titleFont", "Microsoft YaHei", 'sans-serif';
      color: #f29614;
      font-size: 20px;
      transform: translateY(-6px);
    }
  }
}
</style>
