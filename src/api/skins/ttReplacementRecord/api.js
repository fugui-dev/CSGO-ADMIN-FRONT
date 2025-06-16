import request from '@/utils/request'

// 查询汰换记录列表
export function listReplacementRecord(query) {
  return request({
    url: '/admin/replacementRecord/list',
    method: 'get',
    params: query
  })
}

// 查询汰换记录详细
export function getReplacementRecord(id) {
  return request({
    url: '/admin/replacementRecord/' + id,
    method: 'get'
  })
}

// 新增汰换记录
export function addReplacementRecord(data) {
  return request({
    url: '/admin/replacementRecord',
    method: 'post',
    data: data
  })
}

// 修改汰换记录
export function updateReplacementRecord(data) {
  return request({
    url: '/admin/replacementRecord',
    method: 'put',
    data: data
  })
}

// 删除汰换记录
export function delReplacementRecord(id) {
  return request({
    url: '/admin/replacementRecord/' + id,
    method: 'delete'
  })
}
