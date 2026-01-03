import request from '@/utils/request'

// 查询商人列表
export function listMerchant(query) {
  return request({
    url: '/admin/merchant/list',
    method: 'get',
    params: query
  })
}

// 获取所有商人列表（用于下拉选择）
export function getAllMerchants() {
  return request({
    url: '/admin/merchant/all',
    method: 'get'
  })
}

// 添加商人
export function addMerchant(data) {
  return request({
    url: '/admin/merchant',
    method: 'post',
    data: data
  })
}

