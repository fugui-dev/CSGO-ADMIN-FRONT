import request from '@/utils/request'

//banner
//banner列表
export function getBanner(query) {
  return request({
    url: '/admin/banner/list',
    method: 'get',
    params: query
  })
}
export function getBannerid(id) {
  return request({
    url: `/admin/banner/${id}`,
    method: 'get',
  })
}
//添加banner
export function addBanner(query) {
    return request({
        url: '/admin/banner',
        method: 'post',
        data: query
    })
}
//删除
export function delBanner(ids) {
    return request({
        url: `/admin/banner/${ids}`,
        method: 'delete',
    })
}
//修改banner
export function changeBanner(query) {
    return request({
        url: '/admin/banner',
        method: 'put',
        data: query
    })
}


//avatar
//avatar列表

export function getuserAvatar(query) {
  return request({
    url: '/admin/userAvatar/list',
    method: 'get',
    params: query
  })
}
//新增
export function adduserAvatar(query) {
  return request({
    url: '/admin/userAvatar',
    method: 'post',
    data: query
  })
}
//修改
export function changheuserAvatar(query) {
  return request({
    url: '/admin/userAvatar',
    method: 'put',
    data: query
  })
}
//删除
export function deluserAvatar(ids) {
  return request({
    url: `/admin/userAvatar/${ids}`,
    method: 'delete',
  })
}
//id
export function getuserAvatarid(id) {
  return request({
    url: `/admin/userAvatar/${id}`,
    method: 'get',
  })
}


//综合设置
export function getParameterSetting() {
  return request({
    url: `/admin/websiteSetup/getParameterSetting`,
    method: 'post',
  })
}

//
export function updateParameterSetting(data) {
  return request({
    url: `/admin/websiteSetup/updateParameterSetting`,
    method: 'post',
    data:data
  })
}
//vip等级-生成vip等级
export function addVipLevel(num) {
  return request({
    url: `/admin/vipLevel/generateVipLevel/${num}`,
    method: 'post',
  })
}
//vip等级-获取vip等级详细信息
export function getVipLevelid(id) {
  return request({
    url: `/admin/vipLevel/${id}`,
    method: 'get',
  })
}
//vip等级-重置vip等级
export function resetVipLevel(id) {
  return request({
    url: `/admin/vipLevel`,
    method: 'post',
  })
}

//vip等级-获取vip等级列表
export function getVipLevel() {
  return request({
    url: `/admin/vipLevel/list?pageSize=20`,
    method: 'get',
  })
}
//vip等级-修改vip等级
export function changeVipLevel(data) {
  return request({
    url: `/admin/vipLevel`,
    method: 'put',
    data:data
  })
}

//推广等级-生成推广等级
export function generatePromotionLevel(num) {
  return request({
    url: `/admin/promotionLevel/generatePromotionLevel/${num}`,
    method: 'post',
  })
}
//推广等级-获取推广等级详细信息
export function getPromotionLevelid(id) {
  return request({
    url: `/admin/promotionLevel/${id}`,
    method: 'get',
  })
}
//推广等级-重置推广等级
export function resetPromotionLevel() {
  return request({
    url: `/admin/promotionLevel`,
    method: 'post',
  })
}

//推广等级-获取推广等级列表
export function getPromotionLevel() {
  return request({
    url: `/admin/promotionLevel/list`,
    method: 'get',
  })
}

//推广等级-修改推广等级
export function changePromotionLevel(data) {
  return request({
    url: `/admin/promotionLevel`,
    method: 'put',
    data:data
  })
}


//文章管理-查询文章列表
export function getContent() {
  return request({
    url: `admin/content/list`,
    method: 'get',
  })
}
//文章管理-查询文章详细信息显示
export function getContentid(id) {
  return request({
    url: `/admin/content/${id}`,
    method: 'get',
  })
}
//删除
export function delContent(ids) {
  return request({
    url: `/admin/content/${ids}`,
    method: 'delete',
  })
}
//文章管理-新增文章列表
export function addContent(data) {
  return request({
    url: `/admin/content`,
    method: 'post',
    data:data
  })
}
//文章管理-修改文章
export function changeContent(data) {
  return request({
    url: `/admin/content`,
    method: 'put',
        data:data
  })
}


//文章类别管理-文章类别列表
export function getContentType(data) {
  return request({
    url: `admin/contentType/list`,
    method: 'get',
    params:data
  })
}
//文章类别管理-获取文章类别详细信息
export function getContentTypeid(id) {
  return request({
    url: `/admin/contentType/${id}`,
    method: 'get',
  })
}
//文章类别管理-删除文章类别
export function delContentType(ids) {
  return request({
    url: `/admin/contentType/${ids}`,
    method: 'delete',
  })
}
//文章类别管理-新增文章类别
export function addContentType(data) {
  return request({
    url: `/admin/contentType`,
    method: 'post',
    data:data
  })
}
//文章类别管理-修改文章类别
export function changeContentType(data) {
  return request({
    url: `/admin/contentType`,
    method: 'put',
        data:data
  })
}
//
export function getOperationalStatistics() {
  return request({
    url: `/admin/websiteSetup/getOperationalStatistics`,
    method: 'get',
  })
}

// VIP设置管理
// 获取VIP设置列表
export function getVipConfig(query) {
  return request({
    url: '/admin/vipConfig/list',
    method: 'get',
    params: query
  })
}

// 获取所有VIP设置（不分页）
export function getAllVipConfig() {
  return request({
    url: '/admin/vipConfig/all',
    method: 'get',
  })
}

// 获取VIP设置详细信息
export function getVipConfigId(id) {
  return request({
    url: `/admin/vipConfig/${id}`,
    method: 'get',
  })
}

// 新增VIP设置
export function addVipConfig(data) {
  return request({
    url: '/admin/vipConfig',
    method: 'post',
    data: data
  })
}

// 修改VIP设置
export function changeVipConfig(data) {
  return request({
    url: '/admin/vipConfig',
    method: 'put',
    data: data
  })
}

// 删除VIP设置
export function delVipConfig(ids) {
  return request({
    url: `/admin/vipConfig/${ids}`,
    method: 'delete',
  })
}

// 用户VIP每日记录管理
// 获取用户VIP每日记录列表
export function getUserVipDailyRecord(query) {
  return request({
    url: '/admin/userVipDailyRecord/list',
    method: 'get',
    params: query
  })
}

// 获取用户VIP每日记录详细信息
export function getUserVipDailyRecordId(id) {
  return request({
    url: `/admin/userVipDailyRecord/${id}`,
    method: 'get',
  })
}

// 手动发放返点
export function distributeRebate(id) {
  return request({
    url: `/admin/userVipDailyRecord/distribute/${id}`,
    method: 'post',
  })
}

// 获取VIP消费返点记录列表
export function getVipConsumeRebateRecord(params) {
  return request({
    url: '/admin/vipConsumeRebateRecord/list',
    method: 'get',
    params: params
  })
}

// 手动发放VIP返点
export function distributeVipRebate(id) {
  return request({
    url: `/admin/vipConsumeRebateRecord/distribute/${id}`,
    method: 'post',
  })
}
