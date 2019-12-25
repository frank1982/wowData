// pages/home/specialDetail.js
//const onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
// 在页面中定义激励视频广告
let videoAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //servers:[],
    serversOnShow:[],
    canvasList:[],
    max:0,
    isCoverShow:false,
    isShow:false,
    name:'',
    boxStr:'',
    boxtxt:'',
    isGoAllianceOrHorde:'',
    info:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //console.log(options)
    var data = JSON.parse(options.data)
    //console.log(data)
    wx.setNavigationBarTitle({
      title: options.name//页面标题为路由参数
    })
    this.setData({
      name:options.name,
      info:data,
    })
    var canvasList = []
    var serversOnShow = []
    
    for(var i=0;i<data.length;i++){

      var server = {}
      canvasList[i] = i+1 //canvas_id 不能为 0
      console.log(data[i])
      server.serverName = data[i].serverName
      server.a = data[i].goods_alliance
      server.h = data[i].goods_horde
      server.total = data[i].goods_alliance+data[i].goods_horde
      server.rate = (data[i].goods_alliance / data[i].goods_horde)
      if (server["rate"] > 1 && server["rate"] < 10) {
        //处理下 3.0的情况
        server["rate"] = server["rate"].toFixed(1)
        var numStr = server["rate"] + ""
        var endWord = numStr.substr(numStr.length - 1, numStr.length)
        if (endWord == "0") {
          numStr = numStr.substr(0, numStr.length - 2)
        }
        server["rateNum"] = numStr + ":1"
      } else if (server["rate"] >= 10) {
        server["rateNum"] = "10+:1"
      } else if (server["rate"] < 1 && server["rate"] > 0.1) {

        server["rate"] = server["rate"].toFixed(2)
        var x = (1 / server["rate"]).toFixed(1)
        //处理下 3.0的情况
        var numStr = x + ""
        var endWord = numStr.substr(numStr.length - 1, numStr.length)
        //console.log("end:" + endWord)
        if (endWord == "0") {
          numStr = numStr.substr(0, numStr.length - 2)
        }
        server["rateNum"] = "1:" + numStr
      } else if (server["rate"] < 0.1) {
        server["rateNum"] = "1:10+"
      } else if (server["rate"] == 1) {
        server["rateNum"] = "1:1"
      }



      serversOnShow.push(server)
    }
    console.log(serversOnShow)
    //找出总人口最多的数据，作为分母
    var max = 0
    for (var j = 0; j < serversOnShow.length; j++) {
      if (serversOnShow[j].total > max) {
        max = serversOnShow[j].total
      }
    }
    this.setData({
      max:max,
    })
    //默认按总人口排序
    var tmp = serversOnShow
        //console.log(serverInfoList)
        for (var a = 0; a < tmp.length - 1; a++) {

          //2.内部循环 保证 了 最大值 被 移动到最后
          for (var b = 0; b < tmp.length - 1; b++) {

            if (tmp[b].total < tmp[b + 1].total) {
              // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
              var sum = tmp[b];
              tmp[b] = tmp[b + 1];
              tmp[b + 1] = sum;
            }

          }

        }
    
    this.setData({
      canvasList:canvasList,
      serversOnShow:tmp,
    })
    console.log(canvasList)

    // 在页面onLoad回调事件中创建激励视频广告实例
if (wx.createRewardedVideoAd) {
  videoAd = wx.createRewardedVideoAd({
    adUnitId: 'adunit-73bb2f509af91457'
  })
  videoAd.onLoad(() => {})
  videoAd.onError((err) => {})
  videoAd.onClose((res) => {

    // 用户点击了【关闭广告】按钮
    if (res && res.isEnded) {
      // 正常播放结束，可以下发游戏奖励
      wx.navigateTo({
        url:'barInfo?data='+JSON.stringify(this.data.info)+"&name="+this.data.name+"&camp="+this.data.isGoAllianceOrHorde,
      })
  
    } else {
      // 播放中途退出，不下发游戏奖励
    }
  })


}
  },
  clickClose:function(){
    this.setData({
      isShow:false,
    })
  },
  clickLookBtn:function(e){
    console.log(e)
    console.log(e.currentTarget.dataset.bean)
    if(e.currentTarget.dataset.bean == "a"){
      this.setData({
       
        boxStr:this.data.name+'联盟阵容',
        boxtxt:'感谢支持 愿圣光与你同在',
        isGoAllianceOrHorde:'alliance'
      })
    }else{
      this.setData({
       
        boxStr:this.data.name+'部落阵容',
        boxtxt:'感谢支持 愿风指引你的道路',
        isGoAllianceOrHorde:'horde'
      })
    }
    this.setData({
      isShow:true,
    })
    
   


  },
  clickPlay:function(){
    // 用户触发广告后，显示激励视频广告
    
if (videoAd) {
  videoAd.show().catch(() => {
    // 失败重试
    videoAd.load()
      .then(() => videoAd.show())
      .catch(err => {
        console.log('激励视频 广告显示失败')
      })
  })
} 

  //test
  /*
  wx.navigateTo({
    url:'barInfo?data='+JSON.stringify(this.data.info)+"&name="+this.data.name+"&camp="+this.data.isGoAllianceOrHorde,
  })
  */
  },
  clickBtn:function(e){

    console.log(e.target.dataset.bean)//"0" "1" "2" "3"
    var bean = e.target.dataset.bean
    var serversOnShow = this.data.serversOnShow
    var tmp = serversOnShow

    if(bean == "0"){
      //默认按总人口排序
   
    for (var a = 0; a < tmp.length - 1; a++) {

      //2.内部循环 保证 了 最大值 被 移动到最后
      for (var b = 0; b < tmp.length - 1; b++) {

        if (tmp[b].total < tmp[b + 1].total) {
          // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
          var sum = tmp[b];
          tmp[b] = tmp[b + 1];
          tmp[b + 1] = sum;
        }

      }

    }
    }else if(bean == "1"){//联盟

      var tmp = serversOnShow
    //console.log(serverInfoList)
    for (var a = 0; a < tmp.length - 1; a++) {

      //2.内部循环 保证 了 最大值 被 移动到最后
      for (var b = 0; b < tmp.length - 1; b++) {

        if (tmp[b].a < tmp[b + 1].a) {
          // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
          var sum = tmp[b];
          tmp[b] = tmp[b + 1];
          tmp[b + 1] = sum;
        }

      }

    }


    }else if(bean == "2"){//部落

      for (var a = 0; a < tmp.length - 1; a++) {

        //2.内部循环 保证 了 最大值 被 移动到最后
        for (var b = 0; b < tmp.length - 1; b++) {
  
          if (tmp[b].h < tmp[b + 1].h){
            // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
            var sum = tmp[b];
            tmp[b] = tmp[b + 1];
            tmp[b + 1] = sum;
          }
  
        }
      }

    }else if(bean == "3"){//比例
      
      for (var a = 0; a < tmp.length - 1; a++) {

        //2.内部循环 保证 了 最大值 被 移动到最后
        for (var b = 0; b < tmp.length - 1; b++) {
  
          if (tmp[b].rate < tmp[b + 1].rate){
            // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
            var sum = tmp[b];
            tmp[b] = tmp[b + 1];
            tmp[b + 1] = sum;
          }
  
        }
      }
    }
    /*
    //按总人口排名
        var tmp = this.data.serverInfoOnShow
        //console.log(serverInfoList)
        for (var wai = 0; wai < tmp.length - 1; wai++) {

          //2.内部循环 保证 了 最大值 被 移动到最后
          for (var wei = 0; wei < tmp.length - 1; wei++) {

            if (tmp[wei].totalGoods < tmp[wei + 1].totalGoods) {
              // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
              var sum = tmp[wei];
              tmp[wei] = tmp[wei + 1];
              tmp[wei + 1] = sum;
            }

          }

        }
    */
   this.setData({
       
    serversOnShow:tmp,
  })
  this.drawBars()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    var that = this
    this.drawBars();
    setTimeout(function () {

      that.setData({
        isCoverShow: true,
        //isShow:true,//必须在这里延迟加载
      })

    }, 300);
    
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.setData({
      isShow:false,
    })
 
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
  drawBars: function () {
    //console.log("draw bar")
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 20 * onerpx_px
    //var FullW = 525 * onerpx_px
    var FullW = 650 * onerpx_px
    var r = 6 * onerpx_px
    for (var i = 0; i < this.data.serversOnShow.length; i++) {
      var info = this.data.serversOnShow[i];
      var canvasId = this.data.canvasList[i];
      var bar_alliance = info.a/info.total*(info.total/this.data.max);
      var bar_horde = info.h/info.total*(info.total/this.data.max);
      //console.log(canvasId)
      //console.log(bar_alliance)
      var ctx = wx.createCanvasContext(canvasId)
      this.roundRect(ctx, 0, 0, FullW * bar_alliance, H, r, '#0079FF')

      this.roundRect(ctx, FullW * bar_alliance, 0, FullW * bar_horde, H, r, '#D50000')

      ctx.draw();
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
})