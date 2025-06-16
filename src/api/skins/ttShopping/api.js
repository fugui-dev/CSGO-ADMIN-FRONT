import request from '@/utils/request'

export function shoppingList(query) {
    return request({
        url: '/admin/shopping/list',
        method: 'get',
        params: query
    })
}
export function batchPutAwayOrSoldOut(query, status) {
    return request({
        url: `/admin/shopping/batchPutAwayOrSoldOut/${status}`,
        method: 'post',
        data: query
    })
}
