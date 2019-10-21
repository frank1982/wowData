// pages/home/newSpecialInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    serverName: "",
    alliance: 0,
    horde: 0,
    dotime: "",
    loadingShow: false,
    img0Loaded: false,
    img1Loaded: false,
    img0: "",
    img1: "",
    topic:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log("options+++++++++++", options)
    var serverName = options.serverName
    var dotime = options.dotime
    var goodsA = options.alliance
    var goodsH = options.horde
    var id = options.id
    var topic = options.topic

    wx.setNavigationBarTitle({
      title: serverName
    })
    var img0 = "cloud://wow-d7eecd.776f-wow-d7eecd-1300201816/special/" + id + "/" + serverName+"0.png"
    var img1 = "cloud://wow-d7eecd.776f-wow-d7eecd-1300201816/special/" + id + "/" + serverName + "1.png"
    this.setData({
      dotime:"统计时间: "+dotime,
      alliance: goodsA,
      horde:goodsH,
      img0: img0,
      img1: img1,
      topic:topic,
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
  }
})