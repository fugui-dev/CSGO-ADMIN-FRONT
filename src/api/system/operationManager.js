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

