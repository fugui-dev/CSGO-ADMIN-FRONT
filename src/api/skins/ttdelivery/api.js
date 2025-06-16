import request from '@/utils/request'

//申请记录
export function deliverGoodslist(query) {
     return request({
    url: '/admin/deliverGoods/getDeliveryApplyList',
    method: 'get',
    params: query
  })
}
//获取饰品所有在售列表
export function getAvailableMarketList(data) {
  return request({
    url: '/admin/deliverGoods/getAvailableMarketList',
    method: 'post',
    data: data
  })
}
//同步状态
export function synchronousStatus(query) {
     return request({
    url: `/admin/deliverGoods/synchronousStatus`,
       method: 'get',
    params:query
  })
}
//提货记录
export function getDeliveryRecordList(query) {
     return request({
    url: '/admin/deliverGoods/getDeliveryRecordList',
    method: 'get',
    params: query
  })
}
//发货
export function tradeBuy(data) {
     return request({
    url: '/admin/deliverGoods/tradeBuy',
    method: 'post',
    data: data
  })
}
//退回
export function deliveryFail(query) {
     return request({
    url: '/admin/deliverGoods/deliveryFail',
    method: 'post',
    params: query
  })
}

