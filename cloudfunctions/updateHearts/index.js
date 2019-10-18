// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {

    var serverName = event.serverName
    console.log(event.serverName)
    
    await db.collection('hearts').where({
      _id: serverName
    }).get().then(res => {
      var num = res.data[0].heartNum + 1
      //console.log("num:"+num)
      return db.collection('hearts').doc(serverName).update({
        data: {
          heartNum: num,

        }
      })
      
    })
    
  } catch (e) {
    console.error(e)
  }
}