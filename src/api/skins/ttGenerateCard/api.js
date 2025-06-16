import request from '@/utils/request'


export function getRechargeCard(query) {
  return request({
    url: '/admin/rechargeCard/list',
    method: 'get',
    params: query
  })
}
export function addRechargeCard(rechargeListId,num) {
  return request({
    url: `/admin/rechargeCard/generateCard/${rechargeListId}/${num}`,
    method:'post'
 })
}

export function downloadRechargeCard() {
  return request({
    url: `/admin/rechargeCard/export`,
    method:'post'
 })
}