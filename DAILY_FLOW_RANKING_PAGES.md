# 日用户流水排行榜管理页面说明

## 已创建的页面

### 1. 排行榜列表页面
**路径**: `/src/views/skins/dailyFlowRanking/index.vue`

**功能**:
- 查看日流水排行榜列表
- 按日期筛选排行榜（默认显示今天）
- 手动触发统计（用于测试或补数据）
- 手动触发发放奖励（用于测试或补发）
- 显示排名、用户信息、流水数据、奖励状态等

**字段说明**:
- 排名：1-100
- 用户ID、用户名、昵称
- 充值金额、消费金额、总流水
- 奖励金额、奖励状态（已发放/未发放）、发放时间
- 统计日期

### 2. 奖励配置管理页面
**路径**: `/src/views/skins/dailyFlowRanking/rewardConfig.vue`

**功能**:
- 查看奖励配置列表
- 新增奖励配置
- 修改奖励配置
- 删除奖励配置
- 支持配置不同排名范围的奖励金额和奖励类型

**字段说明**:
- 排名范围：起始排名和结束排名（包含）
- 奖励金额：奖励的金额
- 奖励类型：1=金币，2=弹药
- 状态：启用/禁用
- 排序：数字越小越靠前
- 备注：配置说明

## API接口文件

**路径**: `/src/api/skins/dailyFlowRanking/api.js`

**包含的接口**:
- `getDailyFlowRankingList(statDate)` - 查询排行榜列表
- `getUserRanking(userId, statDate)` - 查询指定用户的排名
- `triggerStatistics(statDate)` - 手动触发统计
- `triggerDistributeRewards(statDate)` - 手动触发发放奖励
- `getRewardConfigList()` - 查询奖励配置列表
- `getRewardConfig(id)` - 查询奖励配置详情
- `addRewardConfig(data)` - 新增奖励配置
- `updateRewardConfig(data)` - 修改奖励配置
- `deleteRewardConfig(ids)` - 删除奖励配置

## 路由配置

需要在路由配置文件中添加以下路由：

```javascript
{
  path: '/skins/dailyFlowRanking',
  component: Layout,
  redirect: '/skins/dailyFlowRanking/index',
  name: 'DailyFlowRanking',
  meta: { title: '日流水排行榜', icon: 'chart' },
  children: [
    {
      path: 'index',
      name: 'DailyFlowRankingList',
      component: () => import('@/views/skins/dailyFlowRanking/index'),
      meta: { title: '排行榜列表', icon: 'list' }
    },
    {
      path: 'rewardConfig',
      name: 'DailyFlowRankingRewardConfig',
      component: () => import('@/views/skins/dailyFlowRanking/rewardConfig'),
      meta: { title: '奖励配置', icon: 'money' }
    }
  ]
}
```

## 菜单配置

在后台管理系统的菜单管理中，需要添加以下菜单项：

1. **日流水排行榜**（父菜单）
   - 菜单名称：日流水排行榜
   - 路由地址：`/skins/dailyFlowRanking`
   - 菜单图标：chart

2. **排行榜列表**（子菜单）
   - 菜单名称：排行榜列表
   - 路由地址：`/skins/dailyFlowRanking/index`
   - 菜单图标：list
   - 父菜单：日流水排行榜

3. **奖励配置**（子菜单）
   - 菜单名称：奖励配置
   - 路由地址：`/skins/dailyFlowRanking/rewardConfig`
   - 菜单图标：money
   - 父菜单：日流水排行榜

## 使用说明

### 1. 查看排行榜
- 进入"排行榜列表"页面
- 选择日期查看指定日期的排行榜（不选择则显示今天）
- 可以查看前100名的用户流水和排名情况

### 2. 配置奖励规则
- 进入"奖励配置"页面
- 点击"新增配置"按钮
- 设置排名范围（例如：1-1表示第1名，4-10表示第4到10名）
- 设置奖励金额
- 选择奖励类型（金币或弹药）
- 设置状态（启用/禁用）
- 保存配置

### 3. 手动操作
- **手动统计**：点击"手动统计"按钮，可以手动触发统计指定日期的流水数据
- **手动发放奖励**：点击"手动发放奖励"按钮，可以手动触发发放指定日期的奖励

## 注意事项

1. **排名范围**：排名起始必须小于等于排名结束，且都在1-100之间
2. **奖励类型**：选择金币会发放到用户的`account_amount`，选择弹药会发放到`account_credits`
3. **配置优先级**：如果多个配置的排名范围有重叠，系统会按照排序顺序，取第一个匹配的配置
4. **定时任务**：系统会在每天0:00自动统计，0:30自动发放奖励，无需手动操作

