import request from '@/utils/request'

//获取对战列表
export function getFightlist(data){
    return request({
    url: '/admin/fight/list',
    method: 'get',
    params: data
  })
}
//获取对战宝箱列表
export function getFightBoxList(fightId){
    return request({
    url: `/admin/fight/getFightBoxList/${fightId}`,
    method: 'get',
  })
}
//查询对战结果
export function getFightResult  (fightId){
    return request({
    url:  `/admin/fightResult/getFightResult/${fightId}`,
    method: 'get',
  })
}  
