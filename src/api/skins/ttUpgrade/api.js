import request from '@/utils/request'

// 查询幸运升级数据列表
export function getupgradeOrnaments(query) {
  return request({
    url: '/admin/upgradeOrnaments/list',
    method: 'get',
    params: query
  })
}

// 查询幸运升级数据详细
export function getUpgradeOrnamentsid(id) {
  return request({
    url: '/admin/upgradeOrnaments/'+ id,
    method: 'get'
  })
}

// 新增幸运升级数据
export function addUpgradeOrnaments(data) {
  return request({
    url: `/admin/upgradeOrnaments/batchAdd/${data}`,
    method: 'post',
    // data: data
  })
}

// 修改幸运升级数据
export function updateUpgradeOrnaments(data) {
  return request({
    url: '/admin/upgradeOrnaments',
    method: 'put',
    data: data
  })
}

// 删除幸运升级数据
export function delUpgradeOrnaments(ids) {
  return request({
    url: `/admin/upgradeOrnaments/${ids}`,
    method: 'delete'
  })
}
//失败奖励-删除奖励
export function delFail(ids) {
  return request({
    url: `/admin/upgradeFailOrnaments/${ids}`,
    method: 'delete'
  })
}
//失败奖励-获取奖励列表
export function getFail(data) {
  return request({
    url: `/admin/upgradeFailOrnaments/list`,
    method: 'post',
    data: data
  })
}
//失败 添加
export function addFail(data) {
  return request({
    url: `/admin/upgradeFailOrnaments/batchAdd`,
    method: 'post',
    data: data
  })
}
//失败 更新
export function upFail(data) {
  return request({
    url: `/admin/upgradeFailOrnaments`,
      method: 'put',
    data:data
  })
}

export function getupgradeRecord(data) {
  return request({
    url: '/admin/upgradeRecord/list',
    method: 'post',
    data: data
  })
}

//统计-获取升级饰品利润统计
export function getUserProfitStatistics(id) {
  return request({
    url:`/admin/upgradeOrnaments/getUpgradeProfitStatistics/${id}`,
    method: 'get',
  })
}


