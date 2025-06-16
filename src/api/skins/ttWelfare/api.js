import request from '@/utils/request'

// 查询福利列表列表
export function listWelfare(query) {
  return request({
    url: '/admin/welfare/list',
    method: 'get',
    params: query
  })
}

// 查询福利列表详细
export function getWelfare(welfareId) {
  return request({
    url: '/admin/welfare/' + welfareId,
    method: 'get'
  })
}

// 新增福利列表
export function addWelfare(data) {
  return request({
    url: '/admin/welfare',
    method: 'post',
    data: data
  })
}

// 修改福利列表
export function updateWelfare(data) {
  return request({
    url: '/admin/welfare',
    method: 'put',
    data: data
  })
}

// 删除福利列表
export function delWelfare(welfareId) {
  return request({
    url: '/admin/welfare/' + welfareId,
    method: 'delete'
  })
}
