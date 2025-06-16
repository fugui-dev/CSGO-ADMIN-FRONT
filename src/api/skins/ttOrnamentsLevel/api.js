import request from '@/utils/request'

// 查询饰品级别数据列表
export function listLevel(query) {
  return request({
    url: '/admin/ornamentsLevel/list',
    method: 'get',
    params: query
  })
}

// 查询饰品级别数据详细
export function getLevel(id) {
  return request({
    url: '/admin/ornamentsLevel/' + id,
    method: 'get'
  })
}

// 新增饰品级别数据
export function addLevel(num) {
  return request({
    url: `/admin/ornamentsLevel/generateOrnamentsLevel/${num}`,
    method: 'post',
  })
}

// 修改饰品级别数据
export function updateLevel(data) {
  return request({
    url: '/admin/ornamentsLevel',
    method: 'put',
    data: data
  })
}

// 删除饰品级别数据
// export function delLevel(id) {
//   return request({
//     url: '/admin/ornamentsLevel/' + id,
//     method: 'delete'
//   })
// }
//重置列表
export function resetLevel() {
  return request({
    url: '/admin/ornamentsLevel',
    method: 'post'
  })
}
