import request from '@/utils/request'

// 查询比赛列表
export function getMatchListApi(data) {
  return request({
    url: '/admin/match/history/list',
    method: 'post',
    data: data
  })
}

// 创建比赛
export function addMatchApi(data) {
  return request({
    url: '/admin/match/create',
    method: 'post',
    data: data
  })
}

// 获取助威配置列表
export function getCheerListApi(query) {
  return request({
    url: '/admin/match/stage/cheer/list',
    method: 'get',
    params: query
  })
}

// 创建助威配置
export function addCheerApi(data) {
  return request({
    url: '/admin/match/stage/cheer/create',
    method: 'post',
    data: data
  })
}

// 更新助威配置
export function updateCheerApi(data) {
  return request({
    url: '/admin/match/stage/cheer/update',
    method: 'put',
    data: data
  })
}

// 删除助威配置
export function deleteCheerApi(id) {
  return request({
    url: '/admin/match/stage/cheer/' + id,
    method: 'delete'
  })
}

// 获取比赛阶段列表
export function getMatchStageListApi(data) {
  return request({
    url: '/admin/match/stage/list',
    method: 'post',
    data: data
  })
}

// 获取比赛队伍列表
export function getTeamListApi(data) {
  return request({
    url: '/admin/match/team/list',
    method: 'post',
    data: data
  })
}

// 获取夺冠胜利宝箱配置列表
export function getMatchRewardBoxConfigListApi() {
  return request({
    url: '/admin/match/reward/box/config/list',
    method: 'get'
  })
}

// 创建夺冠胜利宝箱配置
export function createMatchRewardBoxConfigApi(data) {
  return request({
    url: '/admin/match/reward/box/config/create',
    method: 'post',
    data: data
  })
}

// 更新夺冠胜利宝箱配置
export function updateMatchRewardBoxConfigApi(data) {
  return request({
    url: '/admin/match/reward/box/config/update',
    method: 'put',
    data: data
  })
}

// 删除夺冠胜利宝箱配置
export function deleteMatchRewardBoxConfigApi(id) {
  return request({
    url: '/admin/match/reward/box/config/' + id,
    method: 'delete'
  })
}