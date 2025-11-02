import request from '@/utils/request'

// 查询饰品数据列表
export function listOrnaments(query) {
  return request({
    url: '/admin/ornaments/list',
    method: 'get',
    params: query
  })
}

// 查询饰品数据详细
export function getOrnaments(id) {
  return request({
    url: '/admin/ornaments/' + id,
    method: 'get'
  })
}

// 新增饰品数据
export function addOrnaments(data) {
  return request({
    url: '/admin/ornaments',
    method: 'post',
    data: data
  })
}
// 发放饰品
export function grantOrnaments(data,userId,ornamentsId,num) {
  return request({
    url: `/admin/ornaments/grantOrnaments/${userId}/${ornamentsId}/${num}`,
    method: 'post',
    params:data
  })
}

// 修改饰品数据
export function updateOrnaments(data) {
  return request({
    url: '/admin/ornaments',
    method: 'put',
    data: data
  })
}

// 删除饰品数据
export function delOrnaments(id) {
  return request({
    url: '/admin/ornaments/' + id,
    method: 'delete'
  })
}

// 网站道具-查询网站道具列表
export function getWebsiteProperty(params) {
  return request({
    url: '/admin/websiteProperty/list',
    method: 'get',
    params: params
  })
}

// 网站道具-查询网站道具详细信息
export function getWebsitePropertyid(id) {
  return request({
    url: `/admin/websiteProperty/${id}`,
    method: 'get',
  })
}

// 网站道具-删除网站道具
export function delWebsiteProperty(ids) {
  return request({
    url: `/admin/websiteProperty/${ids}`,
    method: 'delete'
  })
}

// 网站道具-修改网站道具
export function changeWebsiteProperty(data) {
  return request({
    url: '/admin/websiteProperty',
    method: 'put',
    data: data
  })
}

// 网站道具-新增网站道具
export function addWebsiteProperty(data) {
  return request({
    url: '/admin/websiteProperty',
    method: 'post',
    data: data
  })
}

// 获取所有外观列表（从饰品表查询）
export function getExteriorList() {
  return request({
    url: '/admin/ornaments/exterior/list',
    method: 'get'
  })
}

// 获取所有类型列表（从饰品表查询）
export function getTypeList() {
  return request({
    url: '/admin/ornaments/type/list',
    method: 'get'
  })
}

