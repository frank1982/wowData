// pages/home/newSpecial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    specialData:[],
    onShowData: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: "专题统计"
    })

    const db = wx.cloud.database()
    db.collection('special')
    .orderBy('_id', 'desc')
    .limit(10)
    .get()
    .then(res => {

      //console.log(res.data)
      var result = res.data
      this.setData({
        specialData:result
      })
      this.initOnShowData(result)
    })
  },
  initOnShowData:function(result){

    console.log("init onShow data")
    //console.log(result)
    var end = []
    for(var i=0;i<result.length;i++){
      //console.log(result[i])
      var tmp = {}
      tmp["list"] = result[i].list//第2期
      tmp["topic"] = result[i].topic

      //统计时间区间
      //前三名
      var dataArray = result[i].data
      var firstTime = dataArray[0].updateTime
      var lastTime = firstTime
      var no1name = dataArray[0].serverName
      var no1num = dataArray[0].alliance + dataArray[0].horde

      for(var j=0;j<dataArray.length;j++){

        //console.log(dataArray[j])
        var dataItem = dataArray[j]
        if (firstTime > dataItem.updateTime){
          firstTime = dataItem.updateTime
        }
        if (lastTime < dataItem.updateTime){
          lastTime = dataItem.updateTime
        }

        if (no1num < dataItem.alliance + dataItem.horde){
          no1num = dataItem.alliance + dataItem.horde
          no1name = dataItem.serverName
        }
      }
      //console.log(no1name)
      //console.log(no1num)
      tmp["no1name"] = no1name
      var ftStr = firstTime.substr(5, 5).replace(/-/g, "/")
      var ltStr = lastTime.substr(5, 5).replace(/-/g, "/")
      tmp["timeStr"] = ftStr+"至"+ltStr
      //tmp["firstTime"] = firstTime
      //tmp["lastTime"] = lastTime
      //icon
      tmp["icon"] = "cloud://wow-d7eecd.776f-wow-d7eecd-1300201816/specialIcons/special" + result[i]._id +".png"

      end.push(tmp)
    }

    //console.log(end)
    this.setData({
      onShowData: end
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  clickItem:function(e){

    var index = e.currentTarget.dataset.bean
    console.log(e.currentTarget.dataset.bean)
    //var mydata = JSON.stringify(this.data.specialData[index]);
    var mydata = JSON.stringify((this.data.specialData[index]))
    wx.navigateTo({

      url: '/pages/home/specialDetail?mydata='+mydata,

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})