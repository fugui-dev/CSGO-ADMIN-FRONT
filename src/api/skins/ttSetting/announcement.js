import request from '@/utils/request'

// 查询公告列表
export function listAnnouncement(query) {
  return request({
    url: '/admin/announcement/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getAnnouncement(announcementId) {
  return request({
    url: '/admin/announcement/' + announcementId,
    method: 'get'
  })
}

// 新增公告
export function addAnnouncement(data) {
  return request({
    url: '/admin/announcement',
    method: 'post',
    data: data
  })
}

// 删除公告
export function delAnnouncement(announcementId) {
  return request({
    url: '/admin/announcement/' + announcementId,
    method: 'delete'
  })
}