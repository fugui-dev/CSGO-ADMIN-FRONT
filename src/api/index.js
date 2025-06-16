import request from '@/utils/request'

export function getBalance() {
  return request({
    url: '/admin/zbt/balance',
    method: 'get',
  })
}
export function developmentInfo() {
  return request({
    url: '/admin/zbt/developmentInfo',
    method: 'get',
  })
}
