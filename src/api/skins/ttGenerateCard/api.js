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

export function addRechargeCardByAmount(amount, num, cardType, merchantId) {
  const params = {
    amount: amount,
    num: num,
    cardType: cardType || 0
  };
  if (merchantId) {
    params.merchantId = merchantId;
  }
  return request({
    url: '/admin/rechargeCard/generateCardByAmount',
    method: 'post',
    params: params
  })
}

export function downloadRechargeCard() {
  return request({
    url: `/admin/rechargeCard/export`,
    method:'post'
 })
}

export function generateCardInfo(data) {
  return request({
    url: '/admin/rechargeCard/info',
    method: 'post',
    data: data
  })
}

export function createGenerateCard(data) {
  return request({
    url: '/admin/rechargeCard/create',
    method: 'post',
    data: data
  })
}

export function delRechargeCard(ids) {
  return request({
    url: '/admin/rechargeCard/' + ids,
    method: 'delete'
  })
}