import request from '@/utils/request'

export function getBalance() {
  return request({
    url: '/admin/CS2PIFA/balance',
    method: 'get',
  })
}
