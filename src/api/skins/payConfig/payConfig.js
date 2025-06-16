import request from '@/utils/request'

// 查询支付配置列表
export function listPayConfig(query) {
  return request({
    url: '/payConfig/payConfig/list',
    method: 'get',
    params: query
  })
}

// 查询支付配置详细
export function getPayConfig(id) {
  return request({
    url: '/payConfig/payConfig/' + id,
    method: 'get'
  })
}

// 新增支付配置
export function addPayConfig(data) {
  return request({
    url: '/payConfig/payConfig',
    method: 'post',
    data: data
  })
}

// 修改支付配置
export function updatePayConfig(data) {
  return request({
    url: '/payConfig/payConfig',
    method: 'put',
    data: data
  })
}

// 删除支付配置
export function delPayConfig(id) {
  return request({
    url: '/payConfig/payConfig/' + id,
    method: 'delete'
  })
}
