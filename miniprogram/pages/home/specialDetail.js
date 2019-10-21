// pages/home/specialDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    summary:"",
    timeStr:"",
    onShowData:[],
    canvas_ids: [],
    _id:"",
    topic:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //console.log("options+++++++++++", options)
    var mydata = JSON.parse(options.mydata)
    //console.log(mydata["list"])
    var _id = mydata._id
    var topic = mydata.topic
    var summary = mydata.summary
    var li = mydata.data
    var timeStr = ""
    var firstTime = li[0].updateTime
    var lastTime = firstTime
    for(var i=0;i<li.length;i++){
      var dataItem = li[i]
      if (firstTime > dataItem.updateTime) {
        firstTime = dataItem.updateTime
      }
      if (lastTime < dataItem.updateTime) {
        lastTime = dataItem.updateTime
      }
    }
    var ftStr = firstTime.substr(5, 5).replace(/-/g, "/")
    var ltStr = lastTime.substr(5, 5).replace(/-/g, "/")
    timeStr = ftStr + "至" + ltStr
    
    wx.setNavigationBarTitle({
      title: topic,
    })

    this.setData({
      summary:summary,
      timeStr: timeStr,
      _id: _id,
      topic:topic,
    })

    var showData = []
    var canvasList = []
    for (var i = 0; i < li.length; i++) {

      var item = li[i]
      //console.log(item)
      var server = {}
 
      server["serverName"] = item.serverName
      server["alliance"] = item.alliance
      server["horde"] = item.horde
      server["total"] = item.alliance + item.horde
      server["rate"] = item.alliance / item.horde
      server["dotime"] = item.updateTime


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

      showData.push(server)
      //计算显示出来的比例值
      canvasList[i] = i + 1
    }
    //找出总人口最多的数据，作为分母
    var max = 0
    for (var j = 0; j < showData.length; j++) {
      if (showData[j].total > max) {
        max = showData[j].total
      }
    }
    //console.log("服务器最多的goods是: " + max)
    for (var z = 0; z < showData.length; z++) {

      showData[z]["bar_alliance"] = parseFloat((showData[z]["alliance"] / max).toFixed(2))
      showData[z]["bar_horde"] = parseFloat((showData[z]["horde"] / max).toFixed(2))
    }

    this.setData({
      canvas_ids: canvasList,
    })

    //默认按总人口排序
    for (var f = 0; f < showData.length - 1; f++) {

      //2.内部循环 保证 了 最大值 被 移动到最后
      for (var z = 0; z < showData.length - 1; z++) {

        if (showData[z].total < showData[z+1].total) {
          // 使用 临时变量 的方式，交换两个 元素的值 -> 交换两个变量的值
          var sum = showData[z];
          showData[z] = showData[z+1]
          showData[z + 1] = sum;
        }

      }

    }

    //console.log(showData)
    //默认按总人口排序
    this.setData({
      onShowData: showData,
    });


  },
  selectServer: function (e) {
    var item = e.currentTarget.dataset.bean
    console.log(item)
    
    var serverName = item.serverName
    var alliance = item.alliance
    var horde = item.horde
    var dotime = item.dotime
    var id=this.data._id
    var topic = this.data.topic
    
    wx.navigateTo({

      url: '/pages/home/newSpecialInfo?serverName=' + serverName + "&alliance=" + alliance + "&horde=" + horde + "&dotime=" + dotime + "&id=" + id + "&topic=" + topic,

    })
    

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    this.drawBar()
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
  drawBar: function () {
    //console.log("draw bar")
    var onerpx_px = wx.getSystemInfoSync().windowWidth / 750;
    var H = 60 * onerpx_px
    var FullW = 450 * onerpx_px //==canvas 宽度
    var r = 6 * onerpx_px
    for (var i = 0; i < this.data.onShowData.length; i++) {
      var info = this.data.onShowData[i];
      var canvasId = this.data.canvas_ids[i]
      var bar_alliance = info.bar_alliance;
      var bar_horde = info.bar_horde;
      var ctx = wx.createCanvasContext(canvasId)
      this.roundRect(ctx, 0, 0, FullW * bar_alliance, H, r, '#0079FF')

      this.roundRect(ctx, FullW * bar_alliance, 0, FullW * bar_horde, H, r, '#D50000')

      ctx.draw();
    }
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