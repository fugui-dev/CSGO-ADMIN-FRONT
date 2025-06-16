
import request from '@/utils/request'
export function getRedPacket(query) {
  return request({
    url: '/admin/redPacket/list',
    method: 'get',
    params: query
  })
}
export function addRedPacket(query) {
  return request({
    url: '/admin/redPacket',
    method: 'post',
    data: query
  })
}
//删除
export function delRedPacket(ids) {
  return request({
    url: `/admin/redPacket/${ids}`,
    method: 'delete',
  })
}
//根据id查询
export function getRedPacketid(ids) {
  return request({
    url: `/admin/redPacket/${ids}`,
    method: 'get',
  })
}
//修改
export function changeRedPacket(query) {
  return request({
    url: `/admin/redPacket`,
    method: 'put',
    data: query

  })
}
//开启记录
export function getRedPacketRecordList(query) {
  return request({
    url: `/admin/redPacketRecord/getRedPacketRecordList`,
    method: 'get',
    params: query

  })
}