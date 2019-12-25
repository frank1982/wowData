// pages/home/specialDetail.js
const onerpx_px = wx.getSystemInfoSync().windowWidth / 750;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],
    teams:[],
  
  },
  click0:function(){
    console.log("click0")
    wx.navigateTo({
      url:'batDetail?data='+JSON.stringify(this.data.teams[0])+"&name=1区1组",
    })
  },
  click1:function(){
    console.log("click1")
    wx.navigateTo({
      url:'batDetail?data='+JSON.stringify(this.data.teams[1])+"&name=1区2组",
    })
  },
  click2:function(){
    console.log("click2")
    wx.navigateTo({
      url:'batDetail?data='+JSON.stringify(this.data.teams[2])+"&name=5区1组",
    })
  },
  click3:function(){
    console.log("click3")
    wx.navigateTo({
      url:'batDetail?data='+JSON.stringify(this.data.teams[3])+"&name=5区2组",
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this
    wx.cloud.callFunction({
      // 需调用的云函数名
      //name: 'getAllPopRecords',
      name: 'getNewGoods',
      // 成功回调
      complete: res => {
        
        var results = res.result
        //console.log(results)
        console.log("共 " + results.length + " 条服务器goods信息")
        var team0 = []
        var team1 = []
        var team2 = []
        var team3 = []
        for(var i=0;i<results.length;i++){
         var item = results[i]
         //console.log(item)
         if(item.bat == '1区1组'){
          team0.push(item);
         }else if(item.bat == '1区2组'){
          team1.push(item);

         }else if(item.bat == '5区1组'){
          team2.push(item);
         }else if(item.bat == '5区2组'){
          team3.push(item);
         }
        }
        this.setData({
          teams:[team0,team1,team2,team3]
        })
        var info = [{},{},{},{}]
        var sum = 0
        var count = 0
        var hsum = 0
        var asum = 0
        var hshare = 0
        var ashare = 0
        for(var j=0;j<team0.length;j++){
          count = count+1
          sum += team0[j].goods_alliance
          sum += team0[j].goods_horde
          hsum += team0[j].goods_horde
          asum += team0[j].goods_alliance
        }
        hshare = Math.round(hsum/sum*100)
        ashare = Math.round(asum/sum*100)
        
        info[0].count = count
        info[0].ashare = ashare
        info[0].hshare = hshare

        var sum = 0
        var count = 0
        var hsum = 0
        var asum = 0
        var hshare = 0
        var ashare = 0
        for(var j=0;j<team1.length;j++){
          count = count+1
          sum += team1[j].goods_alliance
          sum += team1[j].goods_horde
          hsum += team1[j].goods_horde
          asum += team1[j].goods_alliance
        }
        hshare = Math.round(hsum/sum*100)
        ashare = Math.round(asum/sum*100)
        
        info[1].count = count
        info[1].ashare = ashare
        info[1].hshare = hshare

        var sum = 0
        var count = 0
        var hsum = 0
        var asum = 0
        var hshare = 0
        var ashare = 0
        for(var j=0;j<team2.length;j++){
          count = count+1
          sum += team2[j].goods_alliance
          sum += team2[j].goods_horde
          hsum += team2[j].goods_horde
          asum += team2[j].goods_alliance
        }
        hshare = Math.round(hsum/sum*100)
        ashare = Math.round(asum/sum*100)
        
        info[2].count = count
        info[2].ashare = ashare
        info[2].hshare = hshare


        var sum = 0
        var count = 0
        var hsum = 0
        var asum = 0
        var hshare = 0
        var ashare = 0
        for(var j=0;j<team3.length;j++){
          count = count+1
          sum += team3[j].goods_alliance
          sum += team3[j].goods_horde
          hsum += team3[j].goods_horde
          asum += team3[j].goods_alliance
        }
        hshare = Math.round(hsum/sum*100)
        ashare = Math.round(asum/sum*100)
        
        info[3].count = count
        info[3].ashare = ashare
        info[3].hshare = hshare

        console.log(info)
        this.setData({
          info:info
        })
        that.drawTotalBar0();
        that.drawTotalBar1();
        that.drawTotalBar2();
        that.drawTotalBar3();
      }
      
    })

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
   //this.drawTotalBar();

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
  drawTotalBar0: function () {
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    var FullW = 450 * onerpx_px
    var r = 6 * onerpx_px
    var ctx0 = wx.createCanvasContext('1000')
    var ctx1 = wx.createCanvasContext('1001')
    //console.log(this.data.totalCount.share_alliance)
    //console.log(this.data.totalCount.share_horde)
    this.roundRect(ctx0, 0, 0, FullW*this.data.info[0].ashare/100, H, r, '#0079FF')
    this.roundRect(ctx1, 0, 0, FullW*this.data.info[0].hshare/100, H, r, '#D50000')
    ctx0.draw();
    ctx1.draw();
  },
  roundRect(ctx, x, y, w, h, r, c = '#fff') {
    if (w < 2 * r) { r = w / 2; }
    if (h < 2 * r) { r = h / 2; }

    ctx.beginPath();
    ctx.fillStyle = c;

    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);

    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);

    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);

    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);

    ctx.fill();
    ctx.closePath();
  },
  drawTotalBar1: function () {
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    var FullW = 450 * onerpx_px
    var r = 6 * onerpx_px
    var ctx0 = wx.createCanvasContext('2000')
    var ctx1 = wx.createCanvasContext('2001')
    //console.log(this.data.totalCount.share_alliance)
    //console.log(this.data.totalCount.share_horde)
    this.roundRect(ctx0, 0, 0, FullW*this.data.info[1].ashare/100, H, r, '#0079FF')
    this.roundRect(ctx1, 0, 0, FullW*this.data.info[1].hshare/100, H, r, '#D50000')
    ctx0.draw();
    ctx1.draw();
  },
 
  drawTotalBar2: function () {
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    var FullW = 450 * onerpx_px
    var r = 6 * onerpx_px
    var ctx0 = wx.createCanvasContext('3000')
    var ctx1 = wx.createCanvasContext('3001')
    //console.log(this.data.totalCount.share_alliance)
    //console.log(this.data.totalCount.share_horde)
    this.roundRect(ctx0, 0, 0, FullW*this.data.info[2].ashare/100, H, r, '#0079FF')
    this.roundRect(ctx1, 0, 0, FullW*this.data.info[2].hshare/100, H, r, '#D50000')
    ctx0.draw();
    ctx1.draw();
  },

  drawTotalBar3: function () {
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    var FullW = 450 * onerpx_px
    var r = 6 * onerpx_px
    var ctx0 = wx.createCanvasContext('4000')
    var ctx1 = wx.createCanvasContext('4001')
    //console.log(this.data.totalCount.share_alliance)
    //console.log(this.data.totalCount.share_horde)
    this.roundRect(ctx0, 0, 0, FullW*this.data.info[3].ashare/100, H, r, '#0079FF')
    this.roundRect(ctx1, 0, 0, FullW*this.data.info[3].hshare/100, H, r, '#D50000')
    ctx0.draw();
    ctx1.draw();
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
  

})