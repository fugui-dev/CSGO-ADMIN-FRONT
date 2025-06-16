import request from '@/utils/request'
//福利-查询福利列表
export function getBonus(query) {
     return request({
    url: '/admin/bonus/list',
    method: 'get',
    params: query
  })
}
//福利-获取福利详细信息
export function getBonusid(id) {
     return request({
    url: `/admin/bonus/${id}`,
    method: 'get',
  })
}
//福利-获取福利详细信息
export function delBonus(ids) {
     return request({
    url: `/admin/bonus/${ids}`,
    method: 'delete',
  })
}
//福利-新增福利
export function addBonus(data) {
     return request({
    url: '/admin/bonus',
    method: 'post',
    data: data
  })
}
//福利-修改福利
export function updateBonus (data) {
     return request({
    url: '/admin/bonus',
    method: 'put',
    data: data
  })
}