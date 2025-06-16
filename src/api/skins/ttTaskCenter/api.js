import request from '@/utils/request'

// 查询任务中心列表
export function listTaskCenter(query) {
  return request({
    url: '/admin/taskCenter/list',
    method: 'get',
    params: query
  })
}

// 查询任务中心详细
export function getTaskCenter(id) {
  return request({
    url: '/admin/taskCenter/' + id,
    method: 'get'
  })
}

// 新增任务中心
export function addTaskCenter(data) {
  return request({
    url: '/admin/taskCenter',
    method: 'post',
    data: data
  })
}

// 修改任务中心
export function updateTaskCenter(data) {
  return request({
    url: '/admin/taskCenter',
    method: 'put',
    data: data
  })
}

// 删除任务中心
export function delTaskCenter(id) {
  return request({
    url: '/admin/taskCenter/' + id,
    method: 'delete'
  })
}
