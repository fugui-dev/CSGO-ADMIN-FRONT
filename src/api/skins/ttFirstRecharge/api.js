import request from '@/utils/request'

// 查询首充赠送列表
export function listRecharge(query) {
  return request({
    url: '/admin/recharge/list',
    method: 'get',
    params: query
  })
}

// 查询首充赠送详细
export function getRecharge(id) {
  return request({
    url: '/admin/recharge/' + id,
    method: 'get'
  })
}

// 新增首充赠送
export function addRecharge(data) {
  return request({
    url: '/admin/recharge',
    method: 'post',
    data: data
  })
}

// 修改首充赠送
export function updateRecharge(data) {
  return request({
    url: '/admin/recharge',
    method: 'put',
    data: data
  })
}

// 删除首充赠送
export function delRecharge(id) {
  return request({
    url: '/admin/recharge/' + id,
    method: 'delete'
  })
}
