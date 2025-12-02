import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询运营管理列表
export function listOperationManager(query) {
  return request({
    url: '/admin/operationManager/list',
    method: 'get',
    params: query
  })
}

// 查询运营管理详细
export function getOperationManager(id) {
  return request({
    url: '/admin/operationManager/' + parseStrEmpty(id),
    method: 'get'
  })
}

// 新增运营管理
export function addOperationManager(data) {
  return request({
    url: '/admin/operationManager',
    method: 'post',
    data: data
  })
}

// 修改运营管理
export function updateOperationManager(data) {
  return request({
    url: '/admin/operationManager',
    method: 'put',
    data: data
  })
}

// 删除运营管理
export function delOperationManager(id) {
  return request({
    url: '/admin/operationManager/' + id,
    method: 'delete'
  })
}

// 导出运营管理
export function exportOperationManager(query) {
  return request({
    url: '/admin/operationManager/export',
    method: 'post',
    params: query
  })
}

// 绑定主播
export function bindAnchors(operationManagerId, anchorIds) {
  return request({
    url: '/admin/operationManager/' + operationManagerId + '/bindAnchors',
    method: 'post',
    data: anchorIds
  })
}

// 解绑主播
export function unbindAnchor(id) {
  return request({
    url: '/admin/operationManager/anchor/' + id + '/unbind',
    method: 'put'
  })
}

// 查询运营管理绑定的主播列表
export function getBindAnchors(operationManagerId) {
  return request({
    url: '/admin/operationManager/' + operationManagerId + '/anchors',
    method: 'get'
  })
}

