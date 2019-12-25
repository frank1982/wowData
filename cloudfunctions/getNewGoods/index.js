/*
//官方方法
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('newGoods').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('newGoods').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {

    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}
*/

/*
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('newGoods').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('newGoods').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  const result = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  }, -Infinity)

  result.data = result.data || [] // 处理 没有数据时 reduce 结果 undefined 的情况
  //console.log("result:")
  //console.log(result.data)
  return result

}
*/

const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('newGoods').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('newGoods').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  //return (await Promise.all(tasks)).reduce((acc, cur) => {
  const result = (await Promise.all(tasks)).reduce((acc, cur) => {  
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  //console.log(result.data)
  var list=[]
  for(var i=0;i<result.data.length;i++){

    var tmp = {}
    console.log(result.data[i])
    tmp["serverName"]=result.data[i]._id
    tmp['bat']=result.data[i].bat
    var dts = result.data[i].data
    var l = Math.min(10,dts.length)
    var sum_goods_alliance = 0
    var sum_goods_horde = 0
    for(var j=0;j<l;j++){
      sum_goods_alliance += dts[j].alliance
      sum_goods_horde += dts[j].horde
    }
    tmp["goods_alliance"] = Math.round(sum_goods_alliance / l)
    tmp["goods_horde"] = Math.round(sum_goods_horde / l)
    tmp["dotime"] = dts[0].updateTime
    list.push(tmp)
  }
  return list
}