import request from '@/utils/request'

//充值记录
export function rechargeRecord(data) {
  return request({
    url: '/admin/rechargeRecord/list',
      method: 'get',
    params:data
  })
}
//充值
export function getRechargeList(data) {
  return request({
    url: '/admin/rechargeList/list',
      method: 'get',
    params:data
  })
}
//修改
export function changeRechargeList(data) {
  return request({
    url: '/admin/rechargeList',
      method: 'put',
    data:data
  })
}
//新增
export function addRechargeList(data) {
  return request({
    url: '/admin/rechargeList',
      method: 'post',
    data:data
  })
}
//id查询
export function getRechargeListid(id) {
  return request({
    url: `/admin/rechargeList/${id}`,
      method: 'get',
  })
}
//删除
export function delRechargeList(id) {
  return request({
    url: `/admin/rechargeList/${id}`,
      method: 'delete',
  })
}