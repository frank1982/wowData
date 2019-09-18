// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    //console.log("console.log(event.pvnum)")
    //console.log(event.pvnum)
    return await db.collection('words').doc('pvs').update({
      // data 传入需要局部更新的数据
      data: {
        pv: event.pvnum,
      }
    })
  } catch (e) {
    console.error(e)
  }
}