import request from '@/utils/request'

// 查询排行榜列表
export function getDailyFlowRankingList(statDate) {
  return request({
    url: '/admin/dailyFlowRanking/list',
    method: 'get',
    params: { statDate }
  })
}

// 查询指定用户的排名
export function getUserRanking(userId, statDate) {
  return request({
    url: `/admin/dailyFlowRanking/user/${userId}`,
    method: 'get',
    params: { statDate }
  })
}

// 手动触发统计
export function triggerStatistics(statDate) {
  return request({
    url: '/admin/dailyFlowRanking/statistics',
    method: 'post',
    params: { statDate }
  })
}

// 手动触发发放奖励
export function triggerDistributeRewards(statDate) {
  return request({
    url: '/admin/dailyFlowRanking/distributeRewards',
    method: 'post',
    params: { statDate }
  })
}

// 查询奖励配置列表
export function getRewardConfigList() {
  return request({
    url: '/admin/dailyFlowRankingRewardConfig/list',
    method: 'get'
  })
}

// 查询奖励配置详情
export function getRewardConfig(id) {
  return request({
    url: `/admin/dailyFlowRankingRewardConfig/${id}`,
    method: 'get'
  })
}

// 新增奖励配置
export function addRewardConfig(data) {
  return request({
    url: '/admin/dailyFlowRankingRewardConfig',
    method: 'post',
    data: data
  })
}

// 修改奖励配置
export function updateRewardConfig(data) {
  return request({
    url: '/admin/dailyFlowRankingRewardConfig',
    method: 'put',
    data: data
  })
}

// 删除奖励配置
export function deleteRewardConfig(ids) {
  return request({
    url: `/admin/dailyFlowRankingRewardConfig/${ids}`,
    method: 'delete'
  })
}

