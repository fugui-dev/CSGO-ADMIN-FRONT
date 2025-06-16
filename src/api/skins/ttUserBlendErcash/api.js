import request from '@/utils/request'

// 查询收支明细
export function getUserBlendErcash(data) {
  return request({
    url: '/admin/blendErcash/list',
    method: 'post',
    data: data
  })
}