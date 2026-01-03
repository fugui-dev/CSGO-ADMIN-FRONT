import request from '@/utils/request'

// 查询用户个人利润率统计列表
export function listUserProfitStatistics(query) {
  return request({
    url: '/admin/userProbabilityControl/list',
    method: 'get',
    params: query
  })
}

// 获取用户个人利润率详情
export function getUserProfitDetail(userId, windowSize) {
  return request({
    url: '/admin/userProbabilityControl/detail',
    method: 'get',
    params: {
      userId,
      windowSize
    }
  })
}

// 更新用户个人目标利润率
export function updateUserTargetProfitMargin(data) {
  return request({
    url: '/admin/userProbabilityControl/targetProfitMargin',
    method: 'put',
    params: data
  })
}

// 重置用户个人目标利润率
export function resetUserTargetProfitMargin(data) {
  return request({
    url: '/admin/userProbabilityControl/targetProfitMargin',
    method: 'delete',
    params: data
  })
}

// 获取所有宝箱的最大全局目标利润率
export function getMaxGlobalTargetProfitMargin() {
  return request({
    url: '/admin/userProbabilityControl/maxGlobalTargetProfitMargin',
    method: 'get'
  })
}

