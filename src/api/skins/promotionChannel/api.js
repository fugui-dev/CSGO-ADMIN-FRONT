import request from '@/utils/request'


// 百度营销api测试接口
export function bdPromotionTestApi(data) {
  return request({
    url: '/api/bdPromotion/testApi',
    method: 'post',
    data: data
  })
}


// 查询推广渠道通道报表数据
export function reportInfo(id) {
  return request({
    url: '/promotion/channel/reportInfo?id=' + id,
    method: 'get'
  })
}


// 查询推广渠道通道列表
export function listChannel(query) {
  return request({
    url: '/promotion/channel/list',
    method: 'get',
    params: query
  })
}

// 查询推广渠道通道详细
export function getChannel(id) {
  return request({
    url: '/promotion/channel/' + id,
    method: 'get'
  })
}

// 新增推广渠道通道
export function addChannel(data) {
  return request({
    url: '/promotion/channel',
    method: 'post',
    data: data
  })
}

// 修改推广渠道通道
export function updateChannel(data) {
  return request({
    url: '/promotion/channel',
    method: 'put',
    data: data
  })
}

// 删除推广渠道通道
export function delChannel(id) {
  return request({
    url: '/promotion/channel/' + id,
    method: 'delete'
  })
}
