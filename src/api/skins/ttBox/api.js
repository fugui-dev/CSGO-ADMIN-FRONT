import request from '@/utils/request'

// 查询宝箱数据列表
export function listBox(query) {
  return request({
    url: '/admin/box/list',
    method: 'get',
    params: query
  })
}

// 查询宝箱数据详细
export function getBox(boxId) {
  return request({
    url: '/admin/box/' + boxId,
    method: 'get'
  })
}

// 新增宝箱数据
export function addBox(data) {
  return request({
    url: '/admin/box',
    method: 'post',
    data: data
  })
}

// 修改宝箱数据
export function updateBox(data) {
  return request({
    url: '/admin/box',
    method: 'put',
    data: data
  })
}

// 删除宝箱数据
export function delBox(boxId) {
  return request({
    url: '/admin/box/' + boxId,
    method: 'delete'
  })
}

//宝箱类型
export function boxTypelist(data) {
  return request({
    url: '/admin/boxType/list',
    method: 'get',
    params:data
  })
}
//新增宝箱

export function boxType(data) {
  return request({
    url: '/admin/boxType',
    method: 'post',
    data:data
  })
}
//
export function boxTypeChange(data) {
  return request({
    url: '/admin/boxType',
    method: 'put',
    data:data
  })
}
//
export function boxTypeId(id) {
  return request({
    url: `/admin/boxType/${id}`,
    method: 'get',
  })
}
//
export function boxChange(data) {
  return request({
    url: `/admin/box`,
    method: 'put',
    data:data
  })
}
//宝箱类型-删除宝箱类型数据
export function delBoxType(ids) {
  return request({
    url: `/admin/boxType/${ids}`,
    method: 'delete',
  })
}
//宝箱-查看奖项
export function getBoxOrnaments(boxId,page,size) {
  return request({
    url: `/admin/boxOrnaments/list/${boxId}?pageNum=${page}&pageSize=${size}`,
    method: 'get',
  })
}
//宝箱-修改奖项
export function saveBoxOrnaments(data) {
  return request({
    url: `/admin/boxOrnaments`,
    method: 'put',
    data:data
  })
}
//宝箱-新增奖项
export function addBoxOrnaments(data) {
  return request({
    url: `/admin/boxOrnaments`,
    method: 'post',
    data:data
  })
}
//宝箱-获取奖项详细信息
export function getidBoxOrnaments(id) {
  return request({
    url: `/admin/boxOrnaments/${id}`,
    method: 'get',
  })
}
//宝箱-获取奖项详细信息
export function delBoxOrnaments(boxId,ids) {
  return request({
    url: `/admin/boxOrnaments/${boxId}/${ids}`,
    method: 'delete',
  })
}
//宝箱记录-获取宝箱记录数据列表
export function getBoxRecords(data) {
  return request({
    url: `/admin/boxRecords/list`,
    method: 'get',
    params:data
  })
}
//获取宝箱利润率
export function getProfitMargin(boxId) {
  return request({
    url: `/admin/boxOrnaments/getProfitMargin/${boxId}`,
    method: 'get',
  })
}

//宝箱饰品-批量填货
 export function batchAdd(data) {
  return request({
    url: `/admin/boxOrnaments/batchAdd`,
    method: 'post',
    data: data
  })
}
//宝箱-重置宝箱
 export function resetBox(boxId) {
  return request({
    url: `/admin/box/resetBox/${boxId}`,
    method: 'get',
  })
}
//
//宝箱-统计宝箱数据
 export function countBox(boxId,data) {
  return request({
    url: `/admin/box/statisticsBoxData/${boxId}?date=${data}`,
    method: 'get',
  })
}
