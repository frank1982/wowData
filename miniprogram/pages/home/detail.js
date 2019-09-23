// pages/home/detail.js
Page({

  /**
   * 页面的初始数据
   */
  //'cloud://wow-d7eecd.776f-wow-d7eecd/goods/{{nowday}}_{{serverName}}_alliance.png'
  //'cloud://wow-d7eecd.776f-wow-d7eecd/goods/{{nowday}}_{{serverName}}_horde.png'
  data: {
    serverName:"",
    goods_alliance:0,
    goods_horde:0,
    updateTime:"",
    nowday:"",
    loadingShow: false,
    img0Loaded:false,
    img1Loaded: false,
    img0:"",
    img1:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options+++++++++++", options)
    this.setData({
      serverName: options.serverName
    })
    wx.setNavigationBarTitle({
      title: options.serverName
    })

    const db = wx.cloud.database()
    db.collection('goods').where({
      _id: this.data.serverName
    })
    .get()
    .then(res => {
        console.log(res.data)
        if (res.data.length > 0) {

          var dayStr = res.data[0].dotime
          //Sun Sep 15 2019 09:31:09 GMT+0800 (CST)
          var dd = dayStr.substring(8, 10)
          var yy = dayStr.substring(11, 15)
          var mmstr = dayStr.substring(4, 7)
          var mm = this.GetMonth(mmstr)
          var timeStr = yy+mm+dd
          console.log(timeStr)
          var img0Str = 'cloud://wow-d7eecd.776f-wow-d7eecd/goods/' +timeStr+'_'+this.data.serverName+'_alliance.png'
          var img1Str = 'cloud://wow-d7eecd.776f-wow-d7eecd/goods/' + timeStr + '_' + this.data.serverName + '_horde.png'

          this.setData({
            goods_alliance: res.data[0].goods_alliance,
            goods_horde: res.data[0].goods_horde,
            updateTime: dayStr,
            nowday:timeStr,
            img0: img0Str,
            img1: img1Str,
          })
        }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  imageLoad0:function(e){
    console.log("image0 load")
    this.setData({
      img0Loaded: true,
    })
    if (this.data.img1Loaded) {
      this.setData({
        loadingShow: true,
      })
    }
    
    
  },
  imageLoad1: function (e) {
    console.log("image1 load")
    this.setData({
      img1Loaded: true,
    })
    if (this.data.img0Loaded) {
      this.setData({
        loadingShow: true,
      })
    }
  },
  GetMonth: function (monthName) {
    var monthList = ["Jua", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (var i = 0; i <= monthList.length; i++) {
      if (monthList[i] == monthName) {

        var monthNum = i + 1
        if (monthNum < 10) {
          monthNum = "0" + monthNum
        }
        return monthNum
      }
    }
  },
})