// pages/home/newInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updateTime: "",
    loadingShow: false,
    img0Loaded: false,
    img1Loaded: false,
    img0: "",
    img1: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("options+++++++++++", options)
    var serverName = options.serverName
    var updateTime = options.updateTime
    var tmpT = "更新时间: " + updateTime.substring(3, 21)
    
    var dd = updateTime.substring(8, 10)
    var yy = updateTime.substring(11, 15)
    var mmstr = updateTime.substring(4, 7)
    var mm = this.GetMonth(mmstr)
    var timeStr = yy + mm + dd
    var img0Str = 'cloud://wow-d7eecd.776f-wow-d7eecd/goods/' + timeStr + '_' + serverName + '_alliance.png'
    var img1Str = 'cloud://wow-d7eecd.776f-wow-d7eecd/goods/' + timeStr + '_' + serverName + '_horde.png'
    wx.setNavigationBarTitle({
      title: serverName,
      
    })
    this.setData({
      updateTime:tmpT,
      img0: img0Str,
      img1: img1Str
    })
    
  },
  imageLoad0: function (e) {
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