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