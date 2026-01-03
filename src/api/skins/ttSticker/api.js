import request from '@/utils/request'

// 贴纸管理
// 查询贴纸列表
export function listSticker(query) {
  return request({
    url: '/admin/sticker/list',
    method: 'get',
    params: query
  })
}

// 查询贴纸详情
export function getSticker(id) {
  return request({
    url: `/admin/sticker/${id}`,
    method: 'get'
  })
}

// 新增贴纸
export function addSticker(data) {
  return request({
    url: '/admin/sticker',
    method: 'post',
    data: data
  })
}

// 修改贴纸
export function updateSticker(data) {
  return request({
    url: '/admin/sticker',
    method: 'put',
    data: data
  })
}

// 删除贴纸
export function delSticker(ids) {
  return request({
    url: `/admin/sticker/${ids}`,
    method: 'delete'
  })
}

// 贴纸箱子配置
// 查询贴纸箱子配置列表
export function listStickerBoxConfig(query) {
  return request({
    url: '/admin/stickerBoxConfig/list',
    method: 'get',
    params: query
  })
}

// 根据箱子ID查询配置
export function getStickerBoxConfigByBoxId(boxId) {
  return request({
    url: `/admin/stickerBoxConfig/box/${boxId}`,
    method: 'get'
  })
}

// 新增贴纸箱子配置
export function addStickerBoxConfig(data) {
  return request({
    url: '/admin/stickerBoxConfig',
    method: 'post',
    data: data
  })
}

// 修改贴纸箱子配置
export function updateStickerBoxConfig(data) {
  return request({
    url: '/admin/stickerBoxConfig',
    method: 'put',
    data: data
  })
}

// 删除贴纸箱子配置
export function delStickerBoxConfig(ids) {
  return request({
    url: `/admin/stickerBoxConfig/${ids}`,
    method: 'delete'
  })
}

// 贴纸兑换奖励管理
// 查询贴纸奖励列表
export function listStickerReward(query) {
  return request({
    url: '/admin/stickerReward/list',
    method: 'get',
    params: query
  })
}

// 查询贴纸奖励详情
export function getStickerReward(id) {
  return request({
    url: `/admin/stickerReward/${id}`,
    method: 'get'
  })
}

// 新增贴纸奖励
export function addStickerReward(data) {
  return request({
    url: '/admin/stickerReward',
    method: 'post',
    data: data
  })
}

// 修改贴纸奖励
export function updateStickerReward(data) {
  return request({
    url: '/admin/stickerReward',
    method: 'put',
    data: data
  })
}

// 删除贴纸奖励
export function delStickerReward(ids) {
  return request({
    url: `/admin/stickerReward/${ids}`,
    method: 'delete'
  })
}

// 贴纸兑换奖励记录
// 查询贴纸兑换奖励记录列表
export function listStickerExchangeRecord(query) {
  return request({
    url: '/admin/stickerExchangeRecord/list',
    method: 'get',
    params: query
  })
}

// 查询贴纸兑换奖励记录详情
export function getStickerExchangeRecord(id) {
  return request({
    url: `/admin/stickerExchangeRecord/${id}`,
    method: 'get'
  })
}

// 贴纸获取记录
// 查询贴纸获取记录列表
export function listStickerObtainRecord(query) {
  return request({
    url: '/admin/stickerObtainRecord/list',
    method: 'get',
    params: query
  })
}

// 查询贴纸获取记录详情
export function getStickerObtainRecord(id) {
  return request({
    url: `/admin/stickerObtainRecord/${id}`,
    method: 'get'
  })
}
