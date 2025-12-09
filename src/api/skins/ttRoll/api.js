import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/admin/roll/list",
    method: "get",
    params: query,
  });
}
export function rollJackpotList(query) {
  return request({
    url: "/admin/rollJackpot/list",
    method: "get",
    params: query
  });
}
//Roll房-查看奖项列表
export function getRollPrizeList(rollId) {
  return request({
    url: `/admin/roll/getRollPrizeList/${rollId}`,
    method: "get",
  });
}
// 查看roll奖池的饰品
export function rollJackpotOrnamentsList(query) {
  return request({
    url: `/admin/rollJackpotOrnaments/list`,
    method: "get",
    params: query,
  });
}
//指定获奖者
export function namedWinner(query) {
  return request({
    url: "/admin/roll/namedWinner",
    method: "post",
    data: query,
  });
}
//取消指定roll房奖品
export function cancelNamedWinner(data) {
  return request({
    url: "/admin/roll/cancelNamedWinner",
    method: "delete",
    data: data,
  });
}
//获取指定将品用户 /admin/roll/getRollUsers/{rollId}
export function getzhidinguser(rollId) {
  return request({
    url: `/admin/roll/getRollUsers/${rollId}`,
    method: "get",
  });
}


export function roll(query) {
  return request({
    url: "/admin/roll",
    method: "post",
    data: query,
  });
}
export function rollJackpotCreat(query) {
  return request({
    url: "/admin/rollJackpot",
    method: "post",
    data: query,
  });
}
export function rollJackpotAdd(data) {
  return request({
    url: "/admin/rollJackpotOrnaments",
    method: "post",
    data: data,
  });
}
export function rollJackpotChange(query) {
  return request({
    url: "/admin/rollJackpot",
    method: "put",
    data: query,
  });
}
export function rollChange(query) {
  return request({
    url: "/admin/roll",
    method: "put",
    data: query,
  });
}
export function delRoll(rollId) {
  return request({
    url: `/admin/roll/remove/${rollId}`,
    method: "delete",
  });
}
export function endRoll(rollId) {
  return request({
    url: `/api/roll/endRoll/${rollId}`,
    method: "get",
  });
}
// 更新ROLL房排序
export function updateRollSort(data) {
  return request({
    url: "/admin/roll/updateSort",
    method: "put",
    data: data,
  });
}

export function rollJackpotOrnamentDel(jackpotId, rollJackpotOrnamentsIds) {
  return request({
    url: `/admin/rollJackpotOrnaments/${jackpotId}/${rollJackpotOrnamentsIds}`,
    method: "delete",
  });
}
export function delRollJackpot(jackpotId) {
  return request({
    url: `/admin/rollJackpot/remove/${jackpotId}`,
    method: "delete",
  });
}
// 根据id差奖池
export function rollJackpotdetial(jackpotId) {
  return request({
    url: `/admin/rollJackpot/${jackpotId}`,
    method: "get",
  });
}
//修改奖池饰品
export function rollJackpotOrnamentsChange(query) {
  return request({
    url: `/admin/rollJackpotOrnaments`,
    method: "put",
    data: query,
  });
}
//Roll房奖池饰品-批量填货
export function batchAdd(rollId, OrnamentsIds) {
  return request({
    url: `/admin/rollJackpotOrnaments/batchAdd/${rollId}/${OrnamentsIds}`,
    method: "post",
  });
}

//时间Roll房-新增时间Roll房
export function addtimeRoll(data) {
  return request({
    url: `/admin/timeRoll`,
    method: "post",
    data: data,
  });
}

//时间Roll房-修改时间Roll房数据
export function changetimeRoll(data) {
  return request({
    url: `/admin/timeRoll`,
    method: "put",
    data: data,
  });
}

//时间Roll房-状态修改
export function changeStatus() {
  return request({
    url: `/admin/timeRoll/changeStatus`,
    method: "put",
  });
}

//时间Roll房-查看奖项列表

export function getTimeRollPrizeList() {
  return request({
    url: `/admin/timeRoll/getTimeRollPrizeList/${id}`,
    method: "get",
  });
}

//时间Roll房-查询时间Roll房列表
export function getTimeRoll() {
  return request({
    url: `/admin/timeRoll/list`,
    method: "get",
  });
}

//时间Roll房-指定获奖者
export function timeNamedWinner(query) {
  return request({
    url: `/admin/timeRoll/namedWinner`,
    method: "post",
    data: query,
  });
}

//时间Roll房-删除时间Roll房
export function delTimeroll(id) {
  return request({
    url: `/admin/timeRoll/remove/${id}`,
    method: "delete",
  });
}

//时间Roll房-获取时间Roll房详细信息

export function getTimeRollDetial(timeRollId) {
  return request({
    url: `/admin/timeRoll/${timeRollId}`,
    method: "get",
  });
}
