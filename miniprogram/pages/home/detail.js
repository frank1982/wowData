// pages/home/detail.js
const app = getApp();
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
    datailWords:"",
    //nowday:"",
    loadingShow: false,
    img0Loaded:false,
    img1Loaded: false,
    img0:"",
    img1:"",
    img00:"",
    img10:"",
    //heartImgSrc:"../../images/heart.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("options+++++++++++", options)
    var serverName = options.serverName
    var dotime = options.dotime
    var goodsA=options.goodA
    var goodsH=options.goodH
    
 
    wx.setNavigationBarTitle({
      title: serverName
    })
    
    var dayStr = dotime
    var dd = dayStr.substring(8, 10)
    var yy = dayStr.substring(11, 15)
    var mmstr = dayStr.substring(4, 7)
    var mm = this.GetMonth(mmstr)
    var timeStr = yy + mm + dd
    var img0Str = 'cloud://wow-d7eecd.776f-wow-d7eecd/goods/' + timeStr + '_' + serverName + '_alliance.png'
    var img1Str = 'cloud://wow-d7eecd.776f-wow-d7eecd/goods/' + timeStr + '_' + serverName + '_horde.png'

    var tmpT = "更新时间: " + dayStr.substring(3, 21)
    var upday = ""
    if (this.countDayInterval(dayStr) > 0) {
      upday = this.countDayInterval(dayStr) + "天前"
    } else {
      upday = "1天内"
    }

    var datailWords = app.globalData.detailWords

    this.setData({

      serverName: serverName,
      goods_alliance: goodsA,
      goods_horde: goodsH,
      updateTime: tmpT + " " + upday,
      datailWords: datailWords,

      //datailWords: app.globalData.detailWords,
      //nowday:timeStr,
      img0: img0Str,
      img1: img1Str,
    })

    /*
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

          var tmpT = "更新时间: "+dayStr.substring(3,21)
          var upday = ""
          if (this.countDayInterval(dayStr) > 0){
            upday = this.countDayInterval(dayStr) + "天前"  
          }else{
            upday = "1天内"
          }
          

          this.setData({
            goods_alliance: res.data[0].goods_alliance,
            goods_horde: res.data[0].goods_horde,
            updateTime: tmpT + " " + upday,
            //nowday:timeStr,
            img0: img0Str,
            img1: img1Str,
          })
        }
    })
    */
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
  /*
  clickHeart:function(){

    console.log('click heart')
    //console.log(app.globalData.isHeart)
    if (app.globalData.isHeart){
      wx.showToast({
        title: '您刚刚已经点过啦',
        icon: 'none',
        duration: 1000
      })
    }else{
      wx.cloud.callFunction({
        // 云函数名称
        name: 'updateHearts',
        // 传给云函数的参数
        data: {
          serverName: this.data.serverName
        },
        success: function (res) {
          //console.log(res)
        },
        fail: console.error
      })
      wx.showToast({
        title: '谢谢鼓励',
        icon: 'success',
        duration: 1000
      })
      app.globalData.isHeart = !app.globalData.isHeart
    }
    //app.globalData.isHeart = !app.globalData.isHeart
    

  },
  */
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
  countDayInterval: function (daystr1) {
    //var daystr1 = this.data.info_alliance.updateDay
    var daystr2 = new Date()
    console.log(daystr1)
    console.log(daystr2)
    var t1 = new Date(daystr1)
    var t2 = new Date()
    //转成毫秒数，两个日期相减
    var ms = t2.getTime() - t1.getTime();
    //转换成天数
    var day = parseInt(ms / (1000 * 60 * 60 * 24));
    return day
  },
})