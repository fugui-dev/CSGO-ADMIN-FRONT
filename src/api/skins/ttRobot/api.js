import request from '@/utils/request'

// 查询机器人列表
export function listRobot(query) {
  return request({
    url: '/admin/robot/list',
    method: 'get',
    params: query
  })
}

// 查询机器人详细
export function getRobot(robotId) {
  return request({
    url: '/admin/robot/' + robotId,
    method: 'get'
  })
}

// 查询机器人开箱记录
export function getRobotBoxRecords(robotId, query) {
  return request({
    url: '/admin/robot/' + robotId + '/boxRecords',
    method: 'get',
    params: query
  })
}

// 查询机器人对战记录
export function getRobotFights(robotId, query) {
  return request({
    url: '/admin/robot/' + robotId + '/fights',
    method: 'get',
    params: query
  })
}

// 创建机器人
export function createRobot(data) {
  return request({
    url: '/admin/robot/create',
    method: 'post',
    data: data
  })
}

