import request from '@/utils/request'



//获取主播下团队列表数据
export function teamDetailsList(param) {
  return request({
    url: '/admin/user/teamDetailsList',
    method: 'post',
    data: param
  })
}


//获取主播实时数据
export function getRealTimeData(userId) {
  return request({
    url: '/admin/user/getPromotionDataInfo/' + userId,
    method: 'get'
  })
}

//查看某个主播的佣金列表
export function getCommissionList(userId) {
  return request({
    url: 'admin/commission/getCommissionListByUserId?userId=' + userId,
    method: 'get'
  })
}

//发放某个主播佣金
export function getCommissionById(commissionId) {
  return request({
    url: '/admin/commission/getCommissionById?commissionId=' + commissionId,
    method: 'get'
  })
}

// 查询注册用户信息列表
export function listUser(query) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: query
  })
}

// 查询注册用户信息详细
export function getUser(userId) {
  return request({
    url: '/admin/user/' + userId,
    method: 'get'
  })
}

// 修改注册用户信息
export function updateUser(data) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: data
  })
}

// 删除注册用户信息
export function delUser(userId) {
  return request({
    url: '/admin/user/' + userId,
    method: 'delete'
  })
}

export function listUser_Online(query) {
  return request({
    url: '/admin/user/online/list',
    method: 'get',
    params: query
  })
}

export function generateAccount(query) {
  return request({
    url:`/admin/user/generateAccount/${query}`,
    method:'post'
  })
}

//用户账户-余额变动记录
export function userAmountRecords(data) {
  return request({
    url:`/admin/userAmountRecords/list`,
    method: 'post',
    data: data
  })
}
//用户账户-弹药变动记录
export function userCreditsRecords(data) {
  return request({
    url:`/admin/userCreditsRecords/list`,
    method: 'get',
    params:data
  })
}
//获取用户背包
export function getPackSack(data) {
  return request({
    url:`/admin/user/getPackSack`,
    method: 'get',
    params:data
  })
}

// 推广记录-获取推广记录
export function getPromotionRecord(data) {
  return request({
    url:`/admin/promotionRecord/getPromotionRecord`,
    method: 'get',
    params:data
  })
}
export function statisticsPromotionData(userId) {
  return request({
    url:`/admin/promotionRecord/statisticsPromotionData/${userId}`,
    method: 'get',
  })
}

//用户背包-删除用户背包饰品
export function removeUserPackSackData(ids) {
  return request({
    url:`/admin/user/removeUserPackSackData/${ids}`,
    method: 'post',
  })
}
//统计-获取用户利润统计
export function getUserProfitStatistics(userId) {
  return request({
    url:`/admin/user/getUserProfitStatistics/${userId}`,
    method: 'get',
  })
}
